import { MeshBasicMaterial } from 'three'

export const wallsMaterial = new MeshBasicMaterial({
    color: 'red',
    transparent: true,
    opacity: .15
})

export const collidersMaterial = new MeshBasicMaterial({
    transparent: true,
    opacity: 0
})