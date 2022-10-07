import { collidersMaterial } from './materials'
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
import { Clock, Group, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshStandardMaterial, PerspectiveCamera, PointLight, PointLightHelper, Scene, SphereGeometry, TextureLoader, Vector3, WebGLRenderer } from 'three'
import { wallsMaterial } from './materials'
import * as allMaterials from './materials'
import { LightGroup } from './helpers'


// '/ammo' is the folder where all ammo file are
PhysicsLoader('/ammo', () => {
    // sizes
    const width = window.innerWidth
    const height = window.innerHeight

    // const stats = new Stats()

    const scene = new Scene()
    const camera = new PerspectiveCamera(50, width / height, .1, 10000)
    const renderer = new WebGLRenderer({
        // antialias: true
    })
    let stopRender = false

    const orbit = new OrbitControls(camera, renderer.domElement)
    let isOrbitPaused = false

    const clock = new Clock()

    const physics = new AmmoPhysics(scene as any)
    let physicsDebug = false

    let player: ExtendedMesh
    let isPlayerHasCollision = false
    let playerSpawnPoint = new Vector3()

    const walls = new Group()
    const wallForce = 5

    const kinematics = new Group()

    const colliders = new Group()
    let actualCollider: string | undefined = undefined

    const hints = new Group()

    const playerMovement = { x: 0, z: 0, needJump: false }
    const playerSpeed = 3

    const cameraOffsetY = 100
    const cameraOffsetZ = 300
    const cameraMovement = { start: new Vector3(0, 0, 0), end: new Vector3(0, 0, 0), progress: 1 }
    const cameraPoses: Vector3[] = []
    let isCameraMoving = false
    let isCameraOnPlayer = true

    const playerSkins = new Group()
    const skinsMovement = {
        speed: 0.3,
        min: -20,
        max: 10,
        // distance: 20,
        pos: 0,
        direction: -1,
    }

    const gltfCollections: string[] = []


    // @ts-ignore
    window.player = player; window.physics = physics; window.THREE = THREE; window.scene = scene; window.children = scene.children; window.camera = camera; window.cameraMovement = cameraMovement; window.mats = allMaterials

    const init = () => {
        // @ts-ignore
        (function () { var script = document.createElement('script'); script.onload = function () { var stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop() { stats.update(); requestAnimationFrame(loop) }); }; script.src = '//cdn.jsdelivr.net/gh/Kevnz/stats.js/build/stats.min.js'; document.head.appendChild(script); })()
        // document.body.appendChild(stats)

        scene.background = new THREE.Color(0xf0f0f0)

        camera.position.set(0, 500, 0)
        camera.lookAt(0, 0, 0)

        // renderer
        renderer.setSize(width, height)
        renderer.autoClear = false
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
        document.body.appendChild(renderer.domElement)

        const lGroup = new LightGroup(scene, 300, 1000, 1)
        lGroup.addLightHelper()

        // @ts-ignore
        window.lights = lGroup
        // light
        // scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 1))
        // scene.add(new THREE.AmbientLight(0x666666))
        // const light = new THREE.DirectionalLight(0xdfebff, 1)
        // light.position.set(50, 200, 100)
        // light.position.multiplyScalar(1.3)
        // scene.add(light)

        // extract the object factory from physics
        // the factory will make/add object without physics
        const { factory } = physics

        physics.setGravity(0, -98, 0)
        // static ground
        // physics.add.ground({ width: 100, height: 100 })



        // new GLTFLoader().load('/textures/terraria_3d_illustration/scene.gltf', (gltf) => {
        //     const suz = gltf.scene.children[0].children[0].children[0]
        //     // suz.position.y= 10
        //     scene.add(suz)
        //     suz.rotation.x = -Math.PI / 2
        //     suz.scale.set(12, 12, 6)
        //     suz.position.set(-70, -50, 70)
        //     // @ts-ignore 
        //     window.suz = suz
        //     // @ts-ignore
        //     physics.add.existing(suz, { shape: 'concave', collisionFlags: 1 })
        // })


        new GLTFLoader().load('/assets/models/world1.glb', (gltf) => {

            let world
            const statics = new Group()
            statics.name = 'Statics'
            const dynamics = new Group()
            dynamics.name = 'Dynamics'

            walls.name = 'Walls'
            kinematics.name = 'Kinematics'
            playerSkins.name = 'Player Skins'
            colliders.name = 'Colliders'
            hints.name = 'Hints'
            // debugger

            for (const collection of gltf.scene.userData.gltfExtensions.EXT_collections.tree) {
                let name = collection.collection
                if (collection.children) {
                    name += "&&"
                    for (let child of collection.children) {
                        name += child.collection + ",,"
                    }
                }
                gltfCollections.push(name)
            }

            for (const child of gltf.scene.children) {
                const collectionName = child.userData.gltfExtensions.EXT_collections.collections[0]
                const parentCollectionName = gltfCollections.find(c => c.includes(collectionName))?.split('&&')[0] || collectionName
                // console.log(child.name, collectionName, parentCollectionName);


                child.scale.set(100, 100, 100)
                child.position.x *= 100
                child.position.y *= 100
                child.position.z *= 100
                if (child.name === 'World') {
                    world = child
                }
                else if (child.name === 'Player') {
                    const pos = new Vector3(child.position.x, child.position.y, child.position.z)
                    playerSpawnPoint = pos.clone()
                    player = createPlayer(physics, scene, pos)

                    isOrbitPaused = setOrbitControl(orbit, camera, player, false)

                }
                else if (child.name === 'Walls') {
                    // @ts-ignore
                    child.material = wallsMaterial
                    scene.add(child.clone())
                }
                else if (parentCollectionName === 'Statics') {
                    statics.add(child.clone())
                }
                else if (parentCollectionName === 'Dynamics') {
                    dynamics.add(child.clone())
                }
                else if (parentCollectionName === 'Walls') {
                    // @ts-ignore
                    child.material = collidersMaterial
                    child.scale.set(98, 98, 98)
                    walls.add(child.clone())
                }
                else if (parentCollectionName === 'Camera Poses') {
                    cameraPoses.push(child.position.clone())
                }
                else if (collectionName === 'Player Skins') {
                    playerSkins.add(child.clone())
                }
                else if (parentCollectionName === 'Kinematics') {
                    kinematics.add(child.clone())
                }
                else if (parentCollectionName === 'Colliders') {
                    // @ts-ignore
                    child.material = collidersMaterial

                    colliders.add(child.clone())
                }
                else if (parentCollectionName === 'Hints') {
                    child.visible = false

                    hints.add(child.clone())
                }
            }
            // suz.position.y= 10
            scene.add(world)
            scene.add(statics)
            scene.add(walls)
            scene.add(dynamics)
            scene.add(kinematics)
            scene.add(playerSkins)
            scene.add(colliders)
            scene.add(hints)
            // dynamics.position.y = 50
            // world.rotation.x = -Math.PI / 2
            // world.scale.set(100, 100, 100)
            // world.position.set(-70, -50, 70)
            // @ts-ignore 
            window.world = world; window.suz = dynamics
            // debugger
            physics.add.existing(world as any, { shape: 'concave', collisionFlags: 1 })

            if (statics.children.length)
                physics.add.existing(statics as any, { shape: 'concave', collisionFlags: 1 })

            // for (const child of statics.children) {
            //     physics.add.existing(child as any, { shape: 'concave', collisionFlags: 1 })
            // }

            for (const child of dynamics.children) {
                physics.add.existing(child as any, { shape: 'hull' })
            }

            for (const child of walls.children) {
                physics.add.existing(child as any, { shape: 'hull', collisionFlags: 6 })
            }

            for (const child of kinematics.children) {
                physics.add.existing(child as any, { shape: 'hull', collisionFlags: 2 })
            }

            for (const child of playerSkins.children) {
                physics.add.existing(child as any, { shape: 'hull', collisionFlags: 2 })
            }

            for (const child of colliders.children) {
                physics.add.existing(child as any, { shape: 'hull', collisionFlags: 6 })
            }

            setupCollisions()

            animate()

        })

        // new GLTFLoader().load('/assets/models/world1.gltf', (gltf) => {
        //     const world = gltf.scene
        //     world.scale.set(100, 100, 100)

        //     // @ts-ignore
        //     world.children[0].material = new MeshStandardMaterial()

        //     scene.add(world)

        //     physics.add.existing(world as any, { shape: 'concave', collisionFlags: 1 })
        // })

    }


    const initInputs = () => {
        window.addEventListener('keydown', e => {
            if (e.key == 'q' && e.ctrlKey) {
                stopRender = !stopRender
            }


            if (e.key === 'c') {
                // this.setOrbitControl(!this.orbit.enabled)
                isOrbitPaused = setOrbitControl(orbit, camera, player, isOrbitPaused)
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

            if (e.key === 'Enter' && actualCollider) {
                handleEnter(actualCollider)
            }
        })

        window.addEventListener('keyup', (e) => {

            if (e.key === 'w' || e.key === 's')
                playerMovement.z = 0
            if (e.key === 'a' || e.key === 'd')
                playerMovement.x = 0

        })

    }

    const setupPlayerCollision = () => {
        player.body.on.collision((obj, e) => {
            if (e !== 'end')
                isPlayerHasCollision = true
            else
                isPlayerHasCollision = false
        })
    }

    const setupCollisions = () => {

        for (const wall of walls.children) {
            physics.add.collider(wall as any, player as any, e => {
                if (wall.name.startsWith('frontLeft')) {
                    player.body.applyForceX(wallForce)
                    player.body.applyForceZ(wallForce)
                }
                else if (wall.name.startsWith('frontRight')) {
                    player.body.applyForceX(-wallForce)
                    player.body.applyForceZ(wallForce)
                }
                else if (wall.name.startsWith('backLeft')) {
                    player.body.applyForceX(wallForce)
                    player.body.applyForceZ(-wallForce)
                }
                else if (wall.name.startsWith('backRight')) {
                    player.body.applyForceX(-wallForce)
                    player.body.applyForceZ(-wallForce)
                }
                else if (wall.name.startsWith('left')) {
                    player.body.applyForceX(wallForce)
                }
                else if (wall.name.startsWith('right')) {
                    player.body.applyForceX(-wallForce)
                }
                else if (wall.name.startsWith('front')) {
                    player.body.applyForceZ(wallForce)
                }
                else if (wall.name.startsWith('back')) {
                    player.body.applyForceZ(-wallForce)
                }

                if (e !== 'end' && !isCameraMoving && cameraPoses.length) {
                    cameraMovement.progress = 0
                    cameraMovement.start = new Vector3(camera.position.x, camera.position.y, camera.position.z)
                    cameraMovement.end = getNearestCameraPos(camera.position, cameraPoses)
                    isCameraMoving = true
                    isCameraOnPlayer = false
                }

                if (e === 'end' && !isCameraMoving && cameraPoses.length) {
                    isCameraOnPlayer = true
                }



            })
        }

        for (const collider of colliders.children) {
            physics.add.collider(collider as any, player as any, e => {
                if (e === 'collision' && !actualCollider) {
                    actualCollider = collider.name.split('_')[1]
                    showHint(hints, player.position)
                }
                else if (e === 'end') {
                    actualCollider = undefined
                    hideHint(hints, player.position)
                }
            })
        }

        setupPlayerCollision()
    }

    const handleEnter = (event) => {
        console.log(event);

    }

    const renderScene = () => {

        if (playerMovement.x !== 0 || playerMovement.z !== 0) {

            player.body.applyCentralImpulse(playerMovement.x * playerSpeed, 0, playerMovement.z * playerSpeed)
        }

        if (playerMovement.needJump) {

            if (isPlayerHasCollision)
                player.body.applyCentralImpulse(0, 100, 0)
            // player.body.applyCentralImpulse(new this.Ammo.btVector3(0, 3, 0))

            playerMovement.needJump = false
        }

        if (player.position.y < -40)
            respawnPlayer(player, physics, playerSpawnPoint, setupPlayerCollision)



        //Skins

        playerSkins.position.y += skinsMovement.direction * skinsMovement.speed
        if (playerSkins.position.y >= skinsMovement.max)
            skinsMovement.direction = -1
        else if (playerSkins.position.y <= skinsMovement.min)
            skinsMovement.direction = 1


        for (const skin of playerSkins.children) {
            skin.rotation.y += .01;
            (skin as ExtendedMesh).body.needUpdate = true
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

            if (isCameraMoving) {
                const { x, y, z } = cameraMovement.start.lerp(cameraMovement.end, cameraMovement.progress)
                // console.log(x, y, z, cameraMovement.progress);

                camera.position.set(x, y, z)
                cameraMovement.progress += .01

                if (Math.abs(cameraMovement.progress - 1) < .01 || camera.position.distanceTo(cameraMovement.end) < 0.01) {
                    cameraMovement.progress = 1
                    isCameraMoving = false
                }
            }


            if (isCameraOnPlayer) {
                const { x, y, z } = player.position
                camera.position.set(x, y + cameraOffsetY, z + cameraOffsetZ)
            }
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
})

const showHint = (hints: Group, pos: Vector3) => {
    hints.children.reduce((a, b) => ((pos.distanceTo(a.position) < pos.distanceTo(b.position)) ? a : b)).visible = true
}

const hideHint = (hints: Group, pos: Vector3) => {
    hints.children.reduce((a, b) => ((pos.distanceTo(a.position) < pos.distanceTo(b.position)) ? a : b)).visible = false
}

const createPlayer = (physics: AmmoPhysics, scene: Scene, pos: Vector3): ExtendedMesh => {
    const mesh = new Mesh(new SphereGeometry(10, 16, 16,), new MeshBasicMaterial())
    new TextureLoader().load('/textures/player.png', t => {
        mesh.material.map = t
        mesh.material.needsUpdate = true
    })
    mesh.name = 'Player'
    mesh.position.set(pos.x, pos.y, pos.z)
    scene.add(mesh)
    physics.add.existing(mesh as any, { shape: 'sphere', radius: 10, mass: 1.5 })

    return mesh as any
}

const respawnPlayer = (player: ExtendedMesh, physics: AmmoPhysics, pos: Vector3, setupCollision: () => void) => {
    physics.destroy(player.body)
    player.position.set(pos.x, pos.y, pos.z)
    physics.add.existing(player as any, { shape: 'sphere', radius: 10, mass: 1.5 })
    setupCollision()
}

const setOrbitControl = (control: OrbitControls, camera: PerspectiveCamera, player: Mesh, value: boolean) => {
    control.enabled = value

    if (value) {
        const { x, y, z } = player.position
        camera.position.set(x, y + 500, z + 200)
        camera.lookAt(x, y, z)
        control.target = new Vector3(x, y, z)
        // control.
    }

    return !value
}

const getNearestCameraPos = (v: Vector3, poses: Vector3[]) => poses.reduce((a, b) => ((v.distanceTo(a) < v.distanceTo(b)) ? a : b))


