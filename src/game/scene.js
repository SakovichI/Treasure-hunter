import { Scene, Vector3, CannonJSPlugin } from '@babylonjs/core'
import '@babylonjs/loaders'
import * as CANNON from 'cannon-es'

if (typeof window !== 'undefined') {
  window.CANNON = CANNON
}

export function createScene(engine) {
  const scene = new Scene(engine)
  const physicsPlugin = new CannonJSPlugin(true, 10, CANNON)
  scene.enablePhysics(new Vector3(0, -9.81, 0), physicsPlugin)
  return scene
}
