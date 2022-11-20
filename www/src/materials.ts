import { LineBasicMaterial, MeshBasicMaterial, MeshNormalMaterial, MeshStandardMaterial } from 'three'

export const wallsMaterial = new MeshBasicMaterial({
    // color: 'red',
    color: 'grey',
    transparent: true,
    // opacity: .15
})

export const collidersMaterial = new MeshBasicMaterial({
    transparent: true,
    opacity: 0
})

export const selectionBoxMaterial = new MeshNormalMaterial({ wireframe: true })