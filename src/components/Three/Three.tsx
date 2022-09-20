import { Component } from 'react'
import { connect } from 'react-redux'
import * as THREE from 'three'
import { AmbientLight, Clock, Color, GridHelper, Material, Mesh, MeshBasicMaterial, MeshNormalMaterial, PerspectiveCamera, PlaneBufferGeometry, PointLight, Quaternion, Raycaster, Scene, SphereBufferGeometry, TextureLoader, Vector2, Vector3, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { StateType } from '../../redux/store'
import Ammo from 'ammojs-typed'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { DragIndicatorOutlined } from '@mui/icons-material'

type AmmoType = typeof Ammo

type PhysicsType = {
    gravity: number
    world: Ammo.btSoftRigidDynamicsWorld
    rigidBodies: Array<Mesh>
    margin: number
    sphere: any,
    hinge: any,
    cloth: any,
    transformAux1: Ammo.btTransform
}

// AmmoPhysics as AmmoPhysicsType

interface IProps {
    // test: number 
}

interface IState {
}

class Three extends Component<IProps> {

    state = {
    }

    myDiv: any
    frameId: any

    scene = new Scene()
    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000)
    renderer = new WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })

    clock = new Clock()

    raycater = new Raycaster()
    mouse = new Vector2()

    // @ts-ignore
    Ammo: AmmoType
    // @ts-ignore
    physics: PhysicsType = { margin: 0.05, gravity: -9.8, rigidBodies: [] }
    // physics: AmmoPhysicsType | undefined = undefined
    sphereMovement = { x: 0, z: 0, needJump: false }

    plane = new Mesh(new PlaneBufferGeometry(1000, 1000), new MeshNormalMaterial())
    sphere = new Mesh(new SphereBufferGeometry(20, 30, 30), new MeshNormalMaterial())

    //Controls
    orbit = new OrbitControls(this.camera, this.renderer.domElement)
    isOrbitPaused = false

    //For dragging
    mousePressed = false

    setOrbitControl = (value: boolean) => {
        if (value && this.isOrbitPaused) {
            this.orbit.reset()
            this.orbit.enabled = true
            this.isOrbitPaused = false
            this.camera.position.set(20, 20, 20)
            this.camera.lookAt(0, 0, 0)
        }
        else if (!value) {
            this.orbit.saveState()
            this.orbit.enabled = false
            this.isOrbitPaused = true
        }
    }

    //Post Processing
    composer = new EffectComposer(this.renderer)
    outlinePass = new OutlinePass(new Vector2(window.innerWidth * 0.75, window.innerHeight - 88), this.scene, this.camera)
    renderPass = new RenderPass(this.scene, this.camera)
    effectFXAA = new ShaderPass(FXAAShader)

    stopRender = false
    needRender = false
    setNeedRender = (value: boolean) => { this.needRender = value }

    async componentDidMount() {
        window.addEventListener("resize", () => {
            this.handleWindowResize(window.innerWidth, window.innerHeight)
        })

        this.orbit.addEventListener('change', () => {
            this.needRender = true
        })


        this.handleWindowResize(window.innerWidth, window.innerHeight)

        this.myDiv.appendChild(this.renderer.domElement)

        try {
            this.Ammo = await Ammo()
            this.start()
        } catch (error) {

        }

        //Don't do it Again!!
        // @ts-ignore
        window.children = this.scene.children; window.camera = this.camera; window.scene = this.scene; window.orbit = this.orbit; window.renderScene = this.renderScene; window.setNeedRender = this.setNeedRender
        // @ts-ignore
        window.THREE = THREE; window.physics = this.physics

    }
    componentWillUnmount() {
        this.stop()
        this.myDiv.removeChild(this.renderer.domElement)
    }

    componentDidUpdate(prevProps: IProps, prevState: IState) {

        this.setNeedRender(true)
    }


    init = () => {
        // this.renderer.setClearColor('#ff0000')
        // this.renderer.setClearColor('#fafafa')
        this.renderer.setClearColor('#ffefe1')
        // this.renderer.shadowMap.enabled = true
        // this.renderer.shadowMap.type = PCFSoftShadowMap

        // Light settings
        const ambiend = new AmbientLight()
        this.scene.add(ambiend)

        // Controllers settings
        // this.orbit.enableRotate = false
        // this.orbit.enablePan = false
        this.setOrbitControl(false)

        // this.camera.position.set(10, 10, 10)
        // this.camera.position.set(-400, 500, 1100)
        // this.camera.lookAt(0, 0, 0)

        // this.plane.name = 'Plane'
        // this.plane.rotateX(-Math.PI / 2)
        // this.scene.add(this.plane)
        // this.physics?.addMesh(this.plane)

        // this.sphere.position.y = 200
        // this.scene.add(this.sphere)
        // this.physics?.addMesh(this.sphere, 20)
        // this.scene.add(new Mesh(new SphereBufferGeometry(5, 32, 32), new MeshBasicMaterial({ color: 'red' })))


        // this.visualizeItems(this.props.itemsPropsList)
        // this.outlinePass.selectedObjects = this.scene.children.filter(child => this.props.openItemsName.includes(child.name))

        // this.initOutline()
        // this.renderScene()
    }

    initPhysics = () => {

        // Physics configuration

        const collisionConfiguration = new this.Ammo.btSoftBodyRigidBodyCollisionConfiguration();
        const dispatcher = new this.Ammo.btCollisionDispatcher(collisionConfiguration);
        const broadphase = new this.Ammo.btDbvtBroadphase();
        const solver = new this.Ammo.btSequentialImpulseConstraintSolver();
        const softBodySolver = new this.Ammo.btDefaultSoftBodySolver();
        this.physics.world = new this.Ammo.btSoftRigidDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration, softBodySolver);
        this.physics.world.setGravity(new this.Ammo.btVector3(0, this.physics.gravity, 0));
        this.physics.world.getWorldInfo().set_m_gravity(new this.Ammo.btVector3(0, this.physics.gravity, 0));

        this.physics.transformAux1 = new this.Ammo.btTransform();

    }

    initInput = () => {

        window.addEventListener('keydown', (event) => {
            if (event.key == 'q' && event.ctrlKey) {
                this.stopRender = !this.stopRender
            }

            if (event.key === 'c') {
                this.setOrbitControl(!this.orbit.enabled)
            }

            // if (this.isOrbitPaused)
            switch (event.key) {

                // Q
                case 'd':

                    this.sphereMovement.x = 1;
                    break;

                // A
                case 'a':
                    this.sphereMovement.x = - 1;
                    break;
                case 'w':
                    this.sphereMovement.z = - 1;
                    break;

                // A
                case 's':
                    this.sphereMovement.z = 1;
                    break;
                case ' ':

                    this.sphereMovement.needJump = true;
                    break;
            }

        });

        window.addEventListener('keyup', (e) => {

            if (e.key === 'w' || e.key === 's')
                this.sphereMovement.z = 0;
            if (e.key === 'a' || e.key === 'd')
                this.sphereMovement.x = 0;

        });

    }

    createObjects = () => {

        const pos = new THREE.Vector3();
        const quat = new THREE.Quaternion();

        // Ground
        pos.set(0, - 0.5, 0);
        quat.set(0, 0, 0, 1);
        const ground = this.createParalellepiped(40, 1, 40, 0, pos, quat, new THREE.MeshPhongMaterial({ color: 0xFFFFFF }));
        ground.castShadow = true;
        ground.receiveShadow = true;

        // Wall
        const brickMass = 0.5;
        const brickLength = 1.2;
        const brickDepth = 0.6;
        const brickHeight = brickLength * 0.5;
        const numBricksLength = 6;
        const numBricksHeight = 8;
        const z0 = - numBricksLength * brickLength * 0.5;
        pos.set(0, brickHeight * 0.5, z0);
        quat.set(0, 0, 0, 1);
        for (let j = 0; j < numBricksHeight; j++) {

            const oddRow = (j % 2) == 1;

            pos.z = z0;

            if (oddRow) {

                pos.z -= 0.25 * brickLength;

            }

            const nRow = oddRow ? numBricksLength + 1 : numBricksLength;

            for (let i = 0; i < nRow; i++) {

                let brickLengthCurrent = brickLength;
                let brickMassCurrent = brickMass;

                if (oddRow && (i == 0 || i == nRow - 1)) {

                    brickLengthCurrent *= 0.5;
                    brickMassCurrent *= 0.5;

                }

                const brick = this.createParalellepiped(brickDepth, brickHeight, brickLengthCurrent, brickMassCurrent, pos, quat, this.createMaterial());
                brick.castShadow = true;
                brick.receiveShadow = true;

                if (oddRow && (i == 0 || i == nRow - 2)) {

                    pos.z += 0.75 * brickLength;

                } else {

                    pos.z += brickLength;

                }

            }

            pos.y += brickHeight;

        }

        this.physics.sphere = this.createSphere(.5, .5, new Vector3(5, 5, 0), new Quaternion(), new MeshBasicMaterial());
        this.physics.sphere.castShadow = true;
        this.physics.sphere.receiveShadow = true;

        // this.createWorld(this.Ammo)

    }

    createWorld = (Ammo: AmmoType) => {
        const loader = new GLTFLoader()
        const draco = new DRACOLoader()
        draco.setDecoderPath('/draco')
        loader.setDRACOLoader(draco)
        loader.load('textures/monkey.gltf', gltf => {
            // loader.load('textures/terraria_3d_illustration/scene.gltf', gltf => {
            const mass = 1
            const pos = { x: 10, y: 2, z: -10 }
            // const quat = { x: -0.7071067811865475, y: 0, z: 0, w: -0.7071067811865475 }
            const quat = { x: 0, y: 0, z: 0, w: 0 }
            // debugger
            const obj = gltf.scene.children[0] as Mesh //.children[0].children[0] 

            // obj.geometry.scale(pos.x, pos.y, pos.z)
            // obj.position.set(-50, -50, 0)
            // obj.rotation.setFromQuaternion(new Quaternion(quat.x, quat.y, quat.z, quat.w))

            // const transform = new Ammo.btTransform()
            // transform.setIdentity()
            // transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
            // transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))

            // const motionState = new Ammo.btDefaultMotionState(transform)
            // const localInertia = new Ammo.btVector3(0, 0, 0)

            const verticesPos = obj.geometry.getAttribute('position').array
            const triangles = []

            for (let i = 0; i < verticesPos.length; i += 3) {
                triangles.push({
                    x: verticesPos[i],
                    y: verticesPos[i + 1],
                    z: verticesPos[i + 2]
                })
            }

            const shape = new Ammo.btConvexHullShape()
            const triangleMesh = new Ammo.btTriangleMesh()
            const vecA = new Ammo.btVector3(0, 0, 0)
            const vecB = new Ammo.btVector3(0, 0, 0)
            const vecC = new Ammo.btVector3(0, 0, 0)

            for (let i = 0; i < triangles.length - 3; i += 3) {
                vecA.setX(triangles[i].x)
                vecA.setY(triangles[i].y)
                vecA.setZ(triangles[i].z)
                shape.addPoint(vecA, true)

                vecB.setX(triangles[i + 1].x)
                vecB.setY(triangles[i + 1].y)
                vecB.setZ(triangles[i + 1].z)
                shape.addPoint(vecB, true)

                vecC.setX(triangles[i + 2].x)
                vecC.setY(triangles[i + 2].y)
                vecC.setZ(triangles[i + 2].z)
                shape.addPoint(vecC, true)

                triangleMesh.addTriangle(vecA, vecB, vecC, true)
            }

            // debugger

            Ammo.destroy(vecA)
            Ammo.destroy(vecB)
            Ammo.destroy(vecC)

            // const shape = new Ammo.btConvexTriangleMeshShape(triangleMesh, true)
            shape.setMargin(this.physics.margin)

            // shape.calculateLocalInertia(mass, localInertia)

            this.createRigidBody(obj, shape, mass, new Vector3(pos.x, pos.y, pos.z), new Quaternion(quat.x, quat.y, quat.z, quat.w));
            // const rigidBodyInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia)
            // const rBody = new Ammo.btRigidBody(rigidBodyInfo)

            // this.physics.world.addRigidBody(rBody)
            // obj.userData.body = rBody

            // this.physics.rigidBodies.push(obj)

            // this.scene.add(obj)
        })
    }

    createSphere = (r: number, mass: number, pos: Vector3, quat: Quaternion, material: MeshBasicMaterial) => {
        const threeObject = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16,), material);
        threeObject.name = 'Sphere'
        const shape = new this.Ammo.btSphereShape(r);
        shape.setMargin(this.physics.margin);

        this.createRigidBody(threeObject, shape, mass, pos, quat);

        new TextureLoader().load('/textures/player.png', t => {
            material.map = t
            material.needsUpdate = true
        })

        return threeObject;
    }

    createParalellepiped = (sx: number, sy: number, sz: number, mass: number, pos: Vector3, quat: Quaternion, material: Material) => {

        const threeObject = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material);
        const shape = new this.Ammo.btBoxShape(new this.Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
        shape.setMargin(this.physics.margin);

        this.createRigidBody(threeObject, shape, mass, pos, quat);

        return threeObject;

    }

    createRigidBody = (threeObject: Mesh, physicsShape: Ammo.btBoxShape, mass: number, pos: Vector3, quat: Quaternion) => {

        threeObject.position.copy(pos);
        threeObject.quaternion.copy(quat);

        const transform = new this.Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new this.Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(new this.Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        const motionState = new this.Ammo.btDefaultMotionState(transform);

        const localInertia = new this.Ammo.btVector3(0, 0, 0);
        physicsShape.calculateLocalInertia(mass, localInertia);

        const rbInfo = new this.Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
        const body = new this.Ammo.btRigidBody(rbInfo);

        threeObject.userData.physicsBody = body;

        this.scene.add(threeObject);

        if (mass > 0) {

            this.physics.rigidBodies.push(threeObject);

            // Disable deactivation
            body.setActivationState(4);

        }

        this.physics.world.addRigidBody(body);

    }

    createRandomColor = () => {

        return Math.floor(Math.random() * (1 << 24));

    }

    createMaterial = () => {

        return new THREE.MeshPhongMaterial({ color: this.createRandomColor() });

    }

    sphereSpeed = .1
    updatePhysics = (deltaTime: number) => {

        // Hinge control
        // this.physics.hinge.enableAngularMotor(true, 0.8 * this.armMovement, 50);

        //Sphere
        if (this.sphereMovement.x !== 0 || this.sphereMovement.z !== 0) {

            (this.physics.sphere.userData.physicsBody as Ammo.btRigidBody).applyCentralImpulse(new this.Ammo.btVector3(this.sphereMovement.x * this.sphereSpeed, 0, this.sphereMovement.z * this.sphereSpeed))
        }

        if (this.sphereMovement.needJump) {
            console.log('jumb');

            (this.physics.sphere.userData.physicsBody as Ammo.btRigidBody).applyCentralImpulse(new this.Ammo.btVector3(0, 3, 0))


            this.sphereMovement.needJump = false
        }

        // Step world
        this.physics.world.stepSimulation(deltaTime, 10);

        // Update rigid bodies
        for (let i = 0, il = this.physics.rigidBodies.length; i < il; i++) {

            const objThree = this.physics.rigidBodies[i];
            const objPhys = objThree.userData.physicsBody;
            const ms = objPhys.getMotionState();
            if (ms) {

                ms.getWorldTransform(this.physics.transformAux1);
                const p = this.physics.transformAux1.getOrigin();
                const q = this.physics.transformAux1.getRotation();
                objThree.position.set(p.x(), p.y(), p.z());
                objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());

            }

        }

        if (this.isOrbitPaused) {
            const { x, y, z } = this.physics.sphere.position
            this.camera.position.set(x, y + 5, z + 5)
            this.camera.lookAt(this.physics.sphere.position)
        }
    }

    handleWindowResize = (winWidth: number, winHeight: number) => {
        const width = winWidth
        const height = winHeight //- 48


        this.renderer.setSize(width, height)

        this.composer.setSize(width, height)
        this.effectFXAA.uniforms['resolution'].value.set(1 / width, 1 / height)
        this.outlinePass.resolution = new Vector2(width, height)

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()

        // this.renderScene()
    }


    start = () => {


        this.init()
        this.initPhysics()
        this.createObjects()
        this.initInput()

        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stop = () => {
        cancelAnimationFrame(this.frameId)

        // this.orbit.dispose()
    }

    animate = () => {
        if (this.needRender) {
            this.needRender = false
        }

        if (!this.stopRender)
            this.renderScene()
        // this.physics.setMeshPosition(this.sphere, new Vector3(0, 300, 0), 1);

        this.frameId = window.requestAnimationFrame(this.animate)
    }

    renderScene = () => {

        const deltaTime = this.clock.getDelta();

        this.updatePhysics(deltaTime);

        this.renderer.render(this.scene, this.camera)
        this.composer.render()
    }

    render() {
        return (<>
            <div className={'three'} style={{ position: "relative" }} ref={(mount) => { this.myDiv = mount }}></div>
        </>)
    }
}

const mapStateToProps = (state: StateType) => ({
    test: state.appReducer.test
})

export default connect(undefined, undefined)(Three)