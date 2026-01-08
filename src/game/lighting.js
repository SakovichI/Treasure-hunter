import { DirectionalLight, Vector3, ShadowGenerator } from '@babylonjs/core'

export function createLighting(scene) {
  const light = new DirectionalLight('light1', new Vector3(1, -3.5, -2.5), scene)
  light.position = new Vector3(3, 100, 3)
  light.intensity = 2

  const shadowGenerator = new ShadowGenerator(1024, light)
  shadowGenerator.useBlurExponentialShadowMap = true
  shadowGenerator.blurScale = 2
  shadowGenerator.setDarkness(0.4)

  return { light, shadowGenerator }
}
