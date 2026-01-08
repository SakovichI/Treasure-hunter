import { SceneLoader, Vector3 } from '@babylonjs/core'
import '@babylonjs/loaders'
import { paths } from '../config/paths.js'

export async function createTreasure(scene, shadowGenerator, x, z) {
  const result = await SceneLoader.ImportMeshAsync(null, paths.models, 'Chest.gltf', scene)
  const [treasure] = result.meshes
  shadowGenerator.addShadowCaster(treasure)
  treasure.position = new Vector3(x, 3.5, z)
  treasure.scaling = new Vector3(2, 2, 2)
  return result.meshes[2]
}
