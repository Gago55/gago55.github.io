import { Component } from 'react'
import { connect } from 'react-redux'
import * as THREE from 'three'
import { Color, GridHelper, Mesh, MeshBasicMaterial, MeshNormalMaterial, PerspectiveCamera, PlaneBufferGeometry, Raycaster, Scene, Vector2, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { StateType } from '../../redux/store'


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

    raycater = new Raycaster()
    mouse = new Vector2()

    plane = new Mesh(new PlaneBufferGeometry(1000, 1000), new MeshNormalMaterial())

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

    needRender = false
    setNeedRender = (value: boolean) => { this.needRender = value }

    componentDidMount() {
        window.addEventListener("resize", () => {
            this.handleWindowResize(window.innerWidth, window.innerHeight)
        })

        this.orbit.addEventListener('change', () => {
            console.log("das")
            this.needRender = true
        })


        this.handleWindowResize(window.innerWidth, window.innerHeight)

        this.myDiv.appendChild(this.renderer.domElement)
        this.start()

        //Don't do it Again!!
        // @ts-ignore
        window.children = this.scene.children; window.camera = this.camera; window.scene = this.scene; window.orbit = this.orbit; window.renderScene = this.renderScene; window.setNeedRender = this.setNeedRender
        // @ts-ignore
        window.THREE = THREE

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


        // Controllers settings
        // this.orbit.enableRotate = false
        // this.orbit.enablePan = false

        this.camera.position.set(-400, 500, 1100)
        this.camera.lookAt(0, 0, 0)

        this.plane.name = 'Plane'
        this.plane.rotateX(-Math.PI / 2)
        this.scene.add(this.plane)


        // this.scene.add(new Mesh(new SphereBufferGeometry(5, 32, 32), new MeshBasicMaterial({ color: 'red' })))


        // this.visualizeItems(this.props.itemsPropsList)
        // this.outlinePass.selectedObjects = this.scene.children.filter(child => this.props.openItemsName.includes(child.name))

        // this.initOutline()
        this.renderScene()
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

        this.renderScene()
    }


    start = () => {
        this.init()
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
            this.renderScene()
            this.needRender = false
        }

        this.frameId = window.requestAnimationFrame(this.animate)
    }

    renderScene = () => {
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