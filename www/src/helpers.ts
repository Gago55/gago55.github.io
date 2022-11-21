import { Scene, Group, PointLight, PointLightHelper } from "three"

export class LightGroup {
    scene: Scene
    group = new Group()
    dist: number
    height: number
    intensity: number = 0.8

    constructor(scene: Scene, dist: number, height: number, intensity: number = 0.8) {
        this.scene = scene
        this.dist = dist
        this.height = height
        this.intensity = intensity

        this.addLights()
        // this.addLightHelper()
    }

    addLights = () => {
        const light1 = new PointLight(0xffffff, this.intensity)
        this.group.add(light1)
        light1.position.set(this.dist, this.height, this.dist)
        const light2 = new PointLight(0xffffff, this.intensity)
        this.group.add(light2)
        light2.position.set(this.dist, this.height, -this.dist)
        const light3 = new PointLight(0xffffff, this.intensity)
        this.group.add(light3)
        light3.position.set(-this.dist, this.height, this.dist)
        const light4 = new PointLight(0xffffff, this.intensity)
        this.group.add(light4)
        light4.position.set(-this.dist, this.height, -this.dist)
        const light5 = new PointLight(0xffffff, this.intensity / 2)
        this.group.add(light5)
        light5.position.set(0, -this.height, 0)

        this.group.name = 'Light Group'

        this.scene.add(this.group)
    }

    addLightHelper = () => {
        var sphereSize = 10;

        for (const light of this.group.children) {
            var pointLightHelper = new PointLightHelper(light as PointLight, sphereSize, 0xff0000)
            this.scene.add(pointLightHelper)
        }
    }

    changeLightOptions = (intensity?: number, dist?: number) => {
        const lights = this.group.children as PointLight[]

        intensity = intensity ? intensity : lights[0].intensity
        dist = dist ? dist : lights[0].distance

        for (const light of lights) {
            light.intensity = intensity
            light.distance = dist
        }
    }

}

export const changeHintMessage = (document: Document, message: string) => {
    const hintDiv = document.getElementById('hint')

    if (!hintDiv) return

    hintDiv.innerHTML = message
}

export const showHintMessage = (document: Document) => {
    const hintDiv = document.getElementById('hint')

    if (!hintDiv) return

    hintDiv.style.left = '20px'
    // hintDiv.classList.remove('hideHint')
    // hintDiv.classList.add('showHint')
}

export const hideHintMessage = (document: Document) => {
    const hintDiv = document.getElementById('hint')

    if (!hintDiv) return

    hintDiv.style.left = `-${hintDiv.clientWidth + 10}px`

    // hintDiv.classList.add('hideHint')
    // hintDiv.classList.remove('showHint')
}