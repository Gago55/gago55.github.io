// three.js
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// physics
import { AmmoPhysics, ExtendedMesh, PhysicsLoader } from '@enable3d/ammo-physics'

// CSG
// import { CSG } from '@enable3d/three-graphics/jsm/csg'

// Flat
// import { TextTexture, TextSprite } from '@enable3d/three-graphics/jsm/flat'
import { Clock, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, SphereGeometry, TextureLoader, WebGLRenderer } from 'three'

// '/ammo' is the folder where all ammo file are
PhysicsLoader('/ammo', () => {
    // sizes
    const width = window.innerWidth
    const height = window.innerHeight

    const scene = new Scene()
    const camera = new PerspectiveCamera(50, width / height, 0.1, 1000)
    const renderer = new WebGLRenderer()
    let stopRender = false

    const orbit = new OrbitControls(camera, renderer.domElement)
    let isOrbitPaused = false

    const clock = new Clock()

    const physics = new AmmoPhysics(scene as any)
    let physicsDebug = false

    const player = createPlayer(physics, scene)
    const playerMovement = { x: 0, z: 0, needJump: false }
    const playerSpeed = .3

    // @ts-ignore
    window.player = player; window.physics = physics; window.THREE = THREE; window.scene = scene;

    const init = () => {

        scene.background = new THREE.Color(0xf0f0f0)

        camera.position.set(10, 10, 20)
        camera.lookAt(0, 0, 0)

        // renderer
        renderer.setSize(width, height)
        renderer.autoClear = false
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
        document.body.appendChild(renderer.domElement)


        // light
        scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 1))
        scene.add(new THREE.AmbientLight(0x666666))
        const light = new THREE.DirectionalLight(0xdfebff, 1)
        light.position.set(50, 200, 100)
        light.position.multiplyScalar(1.3)

        // extract the object factory from physics
        // the factory will make/add object without physics
        const { factory } = physics

        // blue box
        physics.add.box({ x: 0.05, y: 20 }, { lambert: { color: 0x2194ce } })

        // static ground
        // physics.add.ground({ width: 100, height: 100 })

        // add a normal sphere using the object factory
        // (NOTE: This will be factory.add.sphere() in the future)
        // first parameter is the config for the geometry
        // second parameter is for the material
        // you could also add a custom material like so { custom: new THREE.MeshLambertMaterial({ color: 0x00ff00 }) }
        const greenSphere = factory.add.sphere({ y: 20, z: 5 }, { lambert: { color: 0x00ff00 } })
        // once the object is created, you can add physics to it
        physics.add.existing(greenSphere)

        // green box
        const geometry = new THREE.BoxBufferGeometry()
        const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 })
        const cube = new ExtendedMesh(geometry, material)
        cube.position.set(0, 5, 0)
        scene.add(cube)
        physics.add.existing(cube as any)
        cube.body.setCollisionFlags(2) // make it kinematic



        new GLTFLoader().load('/textures/terraria_3d_illustration/scene.gltf', (gltf) => {
            const suz = gltf.scene.children[0].children[0].children[0]
            // suz.position.y= 10
            scene.add(suz)
            suz.rotation.x = -Math.PI / 2
            suz.scale.set(12, 12, 6)
            suz.position.set(-70, -50, 70)
            // @ts-ignore
            window.suz = suz
            // @ts-ignore
            physics.add.existing(suz, { shape: 'concave', collisionFlags: 1 })
        })


    }

    const initInputs = () => {
        window.addEventListener('keydown', e => {
            if (e.key == 'q' && e.ctrlKey) {
                stopRender = !stopRender
            }

            if (e.key === 'c') {
                // this.setOrbitControl(!this.orbit.enabled)
                isOrbitPaused = setOrbitControl(orbit, camera, isOrbitPaused)
            }

            if (e.key === 'p') {
                physicsDebug ? physics.debug?.disable() : physics.debug?.enable()
                physicsDebug = !physicsDebug
            }

            // if (this.isOrbitPaused)
            switch (e.key) {
                case 'd':
                    playerMovement.x = 1
                    break
                case 'a':
                    playerMovement.x = - 1
                    break
                case 'w':
                    playerMovement.z = - 1
                    break
                case 's':
                    playerMovement.z = 1
                    break
                case ' ':
                    playerMovement.needJump = true
                    break
            }
        })

        window.addEventListener('keyup', (e) => {

            if (e.key === 'w' || e.key === 's')
                playerMovement.z = 0
            if (e.key === 'a' || e.key === 'd')
                playerMovement.x = 0

        })

    }

    const renderScene = () => {

        if (playerMovement.x !== 0 || playerMovement.z !== 0) {

            player.body.applyCentralImpulse(playerMovement.x * playerSpeed, 0, playerMovement.z * playerSpeed)
        }

        if (playerMovement.needJump) {

            player.body.applyCentralImpulse(0, 10, 0)
            // player.body.applyCentralImpulse(new this.Ammo.btVector3(0, 3, 0))

            playerMovement.needJump = false
        }

        physics.update(clock.getDelta() * 1000)

        if (physicsDebug)
            physics.updateDebugger()

        // you have to clear and call render twice because there are 2 scenes
        // one 3d scene and one 2d scene
        renderer.clear()
        renderer.render(scene, camera)
        renderer.clearDepth()

        if (isOrbitPaused) {
            const { x, y, z } = player.position
            camera.position.set(x, y + 10, z + 20)
            camera.lookAt(player.position)
        }
    }

    // loop
    const animate = () => {

        if (!stopRender) {
            renderScene()
        }

        requestAnimationFrame(animate)
    }

    init()
    initInputs()
    animate()
})

const createPlayer = (physics: AmmoPhysics, scene: Scene): ExtendedMesh => {
    const mesh = new Mesh(new SphereGeometry(1, 16, 16,), new MeshBasicMaterial())
    new TextureLoader().load('/textures/player.png', t => {
        mesh.material.map = t
        mesh.material.needsUpdate = true
    })
    mesh.position.y = 10
    scene.add(mesh)
    physics.add.existing(mesh as any, { shape: 'sphere', mass: 1.5 })

    return mesh as any
}

const setOrbitControl = (control: OrbitControls, camera: PerspectiveCamera, value: boolean) => {
    control.enabled = value

    if (value) {
        camera.position.set(10, 10, 20)
        camera.lookAt(0, 0, 0)
    }

    return !value
}

