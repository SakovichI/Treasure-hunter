import {
  Mesh,
  MeshBuilder,
  StandardMaterial,
  CubeTexture,
  Texture,
  Color3,
  Vector2,
  PhysicsImpostor,
} from '@babylonjs/core'
import { WaterMaterial } from '@babylonjs/materials'
import { paths } from '../config/paths.js'

export function createSkybox(scene) {
  const skybox = Mesh.CreateBox('skyBox', 2000.0, scene)
  const skyboxMaterial = new StandardMaterial('skyBox', scene)
  skyboxMaterial.backFaceCulling = false
  skyboxMaterial.reflectionTexture = new CubeTexture(`${paths.img}TropicalSunnyDay`, scene)
  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE
  skyboxMaterial.diffuseColor = new Color3(0, 0, 0)
  skyboxMaterial.specularColor = new Color3(0, 0, 0)
  skyboxMaterial.disableLighting = true
  skybox.material = skyboxMaterial

  return skybox
}

export function createSand(scene) {
  const sandTexture = new Texture(`${paths.img}sand.jpg`, scene)
  sandTexture.vScale = sandTexture.uScale = 16

  const sandMaterial = new StandardMaterial('sandMaterial', scene)
  sandMaterial.diffuseTexture = sandTexture

  const sand = Mesh.CreateGround('sand', 1024, 1024, 32, scene, false)
  sand.position.y = -1
  sand.material = sandMaterial

  return sand
}

export function createWater(scene, skybox, sand) {
  const waterMesh = Mesh.CreateGround('waterMesh', 1024, 1024, 32, scene, false)
  const water = new WaterMaterial('water', scene, new Vector2(1024, 1024))
  water.backFaceCulling = true
  water.bumpTexture = new Texture(`${paths.img}waterbump.png`, scene)
  water.windForce = -5
  water.waveHeight = 0.5
  water.bumpHeight = 0.5
  water.waveLength = 0.1
  water.colorBlendFactor = 0
  water.addToRenderList(skybox)
  water.addToRenderList(sand)
  waterMesh.material = water

  return waterMesh
}

export function createGround(scene, x, y, z) {
  const ground = MeshBuilder.CreateBox(
    'ground',
    {
      width: 100,
      height: 0.1,
      depth: 100,
    },
    scene
  )

  ground.position.x = x
  ground.position.z = z
  ground.position.y = y
  ground.receiveShadows = true
  ground.isPickable = true

  const material = new StandardMaterial('groundMaterial', scene)
  const groundTexture = new Texture('https://playground.babylonjs.com/textures/floor.png')
  groundTexture.uScale = groundTexture.vScale = 15
  material.diffuseTexture = groundTexture

  const groundBumpTexture = new Texture('https://playground.babylonjs.com/textures/floor_bump.png')
  groundBumpTexture.uScale = groundBumpTexture.vScale = 50 / 2.5
  material.bumpTexture = groundBumpTexture

  material.specularColor = Color3.White().scale(0.3)
  ground.material = material

  ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, {
    mass: 0,
    restitution: 0,
    friction: 0.5,
  })

  return ground
}
