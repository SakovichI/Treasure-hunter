import { ArcRotateCamera, Vector3 } from '@babylonjs/core'
import { CAMERA_HEIGHT, CAMERA_RADIUS, CAMERA_ALPHA, CAMERA_BETA } from '../config/constants.js'

export function createCamera(scene, canvas) {
  const camera = new ArcRotateCamera(
    'camera1',
    CAMERA_ALPHA,
    CAMERA_BETA,
    CAMERA_RADIUS,
    new Vector3(-55, CAMERA_HEIGHT, 5),
    scene
  )

  camera.upperBetaLimit = Math.PI / 2.2
  camera.attachControl(canvas, true)
  camera.minZ = 0.01

  return camera
}
