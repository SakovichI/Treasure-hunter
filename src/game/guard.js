import {
  SceneLoader,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Axis,
  Tools,
  Space,
} from '@babylonjs/core'
import '@babylonjs/loaders'
import { paths } from '../config/paths.js'

export async function createGuard(scene, shadowGenerator) {
  const result = await SceneLoader.ImportMeshAsync(null, paths.models, 'guard.gltf', scene)
  const [guardRoot] = result.meshes
  result.meshes[0].rotation.y = -2
  guardRoot.position = new Vector3(80, 3.5, -12)
  guardRoot.scaling = new Vector3(1.2, 1.2, 1.2)
  shadowGenerator.addShadowCaster(guardRoot)
  guardRoot.rotate(Axis.Y, Tools.ToRadians(90), Space.LOCAL)

  const startRotation = guardRoot.rotationQuaternion.clone()

  const playWalk = () => {
    result.animationGroups.forEach(ag => {
      if (ag.name === 'Walk') {
        ag.start(true)
      } else {
        ag.stop()
      }
    })
  }
  playWalk()

  const guardArea = MeshBuilder.CreateDisc('guardArea', { radius: 10, arc: 0 }, scene)
  guardArea.position = new Vector3(80, 3.8, -12)
  guardArea.rotation = new Vector3(1.55, 0, 0)
  const redMat = new StandardMaterial('redMat', scene)
  redMat.diffuseColor = new Color3(1, 0, 0)
  redMat.alpha = 0.1
  guardArea.material = redMat
  guardRoot.addChild(guardArea)

  let distance = 0
  const step = 0.04
  let p = 0

  const walk = function (turn, dist) {
    this.turn = turn
    this.dist = dist
  }

  const track = []
  track.push(new walk(90, 10))
  track.push(new walk(90, 45))
  track.push(new walk(-90, 90))
  track.push(new walk(-90, 120))
  track.push(new walk(90, 248))
  track.push(new walk(90, 278))
  track.push(new walk(-90, 406))
  track.push(new walk(90, 434))
  track.push(new walk(90, 435))
  track.push(new walk(90, 557))
  track.push(new walk(0, 592))

  scene.onBeforeRenderObservable.add(() => {
    guardRoot.movePOV(0, 0, -step)
    distance += step
    if (distance > track[p].dist) {
      guardRoot.rotate(Axis.Y, Tools.ToRadians(track[p].turn), Space.LOCAL)
      p += 1
      p %= track.length
      if (p === 0) {
        distance = 0
        guardRoot.position = new Vector3(80, 3.5, -12)
        guardRoot.rotationQuaternion = startRotation.clone()
      }
    }
  })

  return guardArea
}
