import { SceneLoader, Vector3, MeshBuilder, PhysicsImpostor } from '@babylonjs/core'
import '@babylonjs/loaders'
import { paths } from '../config/paths.js'

export async function createWall(scene, shadowGenerator, allTexture) {
  const result = await SceneLoader.ImportMeshAsync(
    null,
    paths.models,
    'WonderWalls_SecondAge.gltf',
    scene
  )
  const [wall] = result.meshes
  wall.position = new Vector3(50, 3.5, 0)
  wall.scaling = new Vector3(150, 30, 105)
  wall.rotation = new Vector3(0, -1.58, 0)
  shadowGenerator.addShadowCaster(result.meshes[0])

  const wallLeftBox = MeshBuilder.CreateBox('wallLeftBox', { width: 150, height: 20, depth: 40 })
  wallLeftBox.position = new Vector3(50, 8.3, 130)
  wallLeftBox.isVisible = false
  wallLeftBox.physicsImpostor = new PhysicsImpostor(wallLeftBox, PhysicsImpostor.BoxImpostor, {
    mass: 0,
    restitution: 0,
    friction: 0,
  })

  const wallRightBox = MeshBuilder.CreateBox('wallRightBox', { width: 150, height: 20, depth: 40 })
  wallRightBox.position = new Vector3(50, 8.3, -130)
  wallRightBox.isVisible = false
  wallRightBox.physicsImpostor = new PhysicsImpostor(wallRightBox, PhysicsImpostor.BoxImpostor, {
    mass: 0,
    restitution: 0,
    friction: 0,
  })

  const wallFrontBox = MeshBuilder.CreateBox('wallFrontBox', { width: 20, height: 20, depth: 220 })
  wallFrontBox.position = new Vector3(135, 8.3, 0)
  wallFrontBox.isVisible = false
  wallFrontBox.physicsImpostor = new PhysicsImpostor(wallFrontBox, PhysicsImpostor.BoxImpostor, {
    mass: 0,
    restitution: 0,
    friction: 0,
  })

  const wallBack1Box = MeshBuilder.CreateBox('wallBack1Box', { width: 32, height: 20, depth: 120 })
  wallBack1Box.position = new Vector3(-33, 8.3, 80)
  wallBack1Box.isVisible = false
  wallBack1Box.physicsImpostor = new PhysicsImpostor(wallBack1Box, PhysicsImpostor.BoxImpostor, {
    mass: 0,
    restitution: 0,
    friction: 0,
  })

  const wallBack2Box = MeshBuilder.CreateBox('wallBack2Box', { width: 32, height: 20, depth: 120 })
  wallBack2Box.position = new Vector3(-33, 8.3, -81)
  wallBack2Box.isVisible = false
  wallBack2Box.physicsImpostor = new PhysicsImpostor(wallBack2Box, PhysicsImpostor.BoxImpostor, {
    mass: 0,
    restitution: 0,
    friction: 0,
  })

  wall.physicsImpostor = new PhysicsImpostor(wall, PhysicsImpostor.NoImpostor, {
    mass: 0,
  })

  wall.addChild(wallLeftBox)
  wall.addChild(wallRightBox)
  wall.addChild(wallFrontBox)
  wall.addChild(wallBack1Box)
  wall.addChild(wallBack2Box)
  allTexture.push(wall)
}

export async function createPort(scene, _shadowGenerator) {
  const result = await SceneLoader.ImportMeshAsync(null, paths.models, 'Port.gltf', scene)
  const [port] = result.meshes
  port.position = new Vector3(-52.2, 3.2, -10)
  port.scaling = new Vector3(15, 15, 15)
  result.meshes[2].receiveShadows = true

  const boxPort1 = MeshBuilder.CreateBox('boxPort', { width: 20, height: 0.5, depth: 12 }, scene)
  boxPort1.position = new Vector3(-60.0, 3.2, 0)
  boxPort1.physicsImpostor = new PhysicsImpostor(boxPort1, PhysicsImpostor.BoxImpostor, {
    mass: 0,
    restitution: 0,
  })
  boxPort1.isVisible = false

  const wallLeftPort1 = MeshBuilder.CreateBox(
    'wallLeftPort',
    { width: 20, height: 20, depth: 1 },
    scene
  )
  wallLeftPort1.position = new Vector3(-60.0, 3.0, 6)
  wallLeftPort1.physicsImpostor = new PhysicsImpostor(wallLeftPort1, PhysicsImpostor.BoxImpostor, {
    mass: 0,
    restitution: 0,
  })
  wallLeftPort1.isVisible = false

  port.physicsImpostor = new PhysicsImpostor(port, PhysicsImpostor.NoImpostor, {
    mass: 0,
    restitution: 0,
  })
  port.addChild(boxPort1)
  port.addChild(wallLeftPort1)
}

export async function createBarrel(scene, shadowGenerator, x, z) {
  const result = await SceneLoader.ImportMeshAsync(null, paths.models, 'Barrel.gltf', scene)
  const [barrel] = result.meshes
  shadowGenerator.addShadowCaster(barrel)
  barrel.position = new Vector3(x, 3.5, z)
  barrel.scaling = new Vector3(15, 15, 15)

  const barrelBox = MeshBuilder.CreateCylinder('barrelBox', { diameter: 1.5, height: 1.7 }, scene)
  barrelBox.position = new Vector3(x, 4.5, z)
  barrelBox.isVisible = false
  barrel.addChild(barrelBox)
  barrelBox.physicsImpostor = new PhysicsImpostor(barrelBox, PhysicsImpostor.CylinderImpostor, {
    mass: 0,
  })
  barrel.physicsImpostor = new PhysicsImpostor(barrel, PhysicsImpostor.NoImpostor, {
    mass: 40,
    restitution: 1,
  })

  return barrel
}

export async function createHouse(scene, shadowGenerator, allTexture, x, z) {
  const result = await SceneLoader.ImportMeshAsync(null, paths.models, 'Houses.gltf', scene)
  const [house] = result.meshes
  shadowGenerator.addShadowCaster(house)
  house.position = new Vector3(x, 3.5, z)
  house.scaling = new Vector3(15, 15, 15)
  house.rotation = new Vector3(0, 1.58, 0)

  const house1Box = MeshBuilder.CreateBox('house1Box', { width: 10, height: 6, depth: 15 }, scene)
  house1Box.position = new Vector3(x - 7, 5.5, z - 1.5)
  house1Box.isVisible = false
  house1Box.physicsImpostor = new PhysicsImpostor(house1Box, PhysicsImpostor.BoxImpostor, {
    mass: 0,
  })

  const house2Box = MeshBuilder.CreateBox('house2Box', { width: 8, height: 6, depth: 16 }, scene)
  house2Box.position = new Vector3(x + 5, 5.5, z + 2.5)
  house2Box.isVisible = false
  house2Box.physicsImpostor = new PhysicsImpostor(house2Box, PhysicsImpostor.BoxImpostor, {
    mass: 0,
  })

  house.physicsImpostor = new PhysicsImpostor(house, PhysicsImpostor.NoImpostor, {
    mass: 0,
  })
  house.addChild(house1Box)
  house.addChild(house2Box)
  allTexture.push(house)
}

export async function createFarm(scene, shadowGenerator, allTexture, x, z) {
  const result = await SceneLoader.ImportMeshAsync(null, paths.models, 'Farm.gltf', scene)
  const [farm] = result.meshes
  shadowGenerator.addShadowCaster(farm)
  farm.position = new Vector3(x, 3.5, z)
  farm.scaling = new Vector3(12, 12, 12)
  farm.rotation = new Vector3(0, 0, 0)

  const farmBox = MeshBuilder.CreateBox('farmBox', { width: 8, height: 6, depth: 8 }, scene)
  farmBox.position = new Vector3(x - 6, 5.5, z - 7)
  farmBox.isVisible = false
  farmBox.physicsImpostor = new PhysicsImpostor(farmBox, PhysicsImpostor.BoxImpostor, {
    mass: 0,
  })

  farm.physicsImpostor = new PhysicsImpostor(farm, PhysicsImpostor.NoImpostor, {
    mass: 0,
  })
  farm.addChild(farmBox)
  allTexture.push(farm)
}

export async function createCenter(scene, shadowGenerator, allTexture) {
  const result = await SceneLoader.ImportMeshAsync(null, paths.models, 'Center.gltf', scene)
  const [center] = result.meshes
  center.scaling = new Vector3(15, 10, 15)
  center.position = new Vector3(50, 3.5, 0)
  center.rotation = new Vector3(0, -3.14, 0)
  shadowGenerator.addShadowCaster(center)

  const centerBox = MeshBuilder.CreateBox('centerBox', { width: 26, height: 3, depth: 26 }, scene)
  centerBox.position = new Vector3(50, 3.5, 0)
  centerBox.isVisible = false
  centerBox.physicsImpostor = new PhysicsImpostor(centerBox, PhysicsImpostor.BoxImpostor, {
    mass: 0,
  })

  center.physicsImpostor = new PhysicsImpostor(center, PhysicsImpostor.NoImpostor, {
    mass: 0,
  })
  center.addChild(centerBox)
  allTexture.push(centerBox)
}

export async function createMarket(scene, shadowGenerator, allTexture, x, z, rotate) {
  const result = await SceneLoader.ImportMeshAsync(null, paths.models, 'Market.gltf', scene)
  const [market] = result.meshes
  shadowGenerator.addShadowCaster(market)
  market.position = new Vector3(x, 3.5, z)
  market.scaling = new Vector3(15, 15, 15)
  market.rotation = new Vector3(0, rotate, 0)

  const market1Box = MeshBuilder.CreateBox('market1Box', { width: 28, height: 6, depth: 10 }, scene)
  market1Box.position = new Vector3(x + 0, 5.5, z - 8)
  market1Box.isVisible = false
  market1Box.physicsImpostor = new PhysicsImpostor(market1Box, PhysicsImpostor.BoxImpostor, {
    mass: 0,
  })

  const market2Box = MeshBuilder.CreateBox('market2Box', { width: 28, height: 6, depth: 14 }, scene)
  market2Box.position = new Vector3(x + 0, 5.5, z + 8)
  market2Box.isVisible = false
  market2Box.physicsImpostor = new PhysicsImpostor(market2Box, PhysicsImpostor.BoxImpostor, {
    mass: 0,
  })

  market.physicsImpostor = new PhysicsImpostor(market, PhysicsImpostor.NoImpostor, {
    mass: 0,
  })
  market.addChild(market1Box)
  market.addChild(market2Box)
  allTexture.push(market1Box)
  allTexture.push(market2Box)
}

export async function createTemple(scene, shadowGenerator, allTexture) {
  const result = await SceneLoader.ImportMeshAsync(null, paths.models, 'Temple.gltf', scene)
  const [temple] = result.meshes
  temple.scaling = new Vector3(18, 18, 18)
  temple.position = new Vector3(50, 3.5, -45)
  temple.rotation = new Vector3(0, -3.14, 0)
  shadowGenerator.addShadowCaster(temple)

  const templeBox = MeshBuilder.CreateBox('templeBox', { width: 38, height: 10, depth: 38 }, scene)
  templeBox.position = new Vector3(50, 5.5, -45)
  templeBox.isVisible = false
  templeBox.physicsImpostor = new PhysicsImpostor(templeBox, PhysicsImpostor.BoxImpostor, {
    mass: 0,
  })

  temple.physicsImpostor = new PhysicsImpostor(temple, PhysicsImpostor.NoImpostor, {
    mass: 0,
  })
  temple.addChild(templeBox)
  allTexture.push(templeBox)
}

export async function createArchery(scene, shadowGenerator, allTexture) {
  const result = await SceneLoader.ImportMeshAsync(null, paths.models, 'Archery.gltf', scene)
  const [archery] = result.meshes
  archery.scaling = new Vector3(18, 18, 18)
  archery.position = new Vector3(100, 3.5, -90)
  archery.rotation = new Vector3(0, 0, 0)
  shadowGenerator.addShadowCaster(archery)

  const archeryBox = MeshBuilder.CreateBox(
    'archeryBox',
    { width: 28, height: 10, depth: 10 },
    scene
  )
  archeryBox.position = new Vector3(97, 5.5, -100)
  archeryBox.isVisible = false
  archeryBox.physicsImpostor = new PhysicsImpostor(archeryBox, PhysicsImpostor.BoxImpostor, {
    mass: 0,
  })

  const archery1Box = MeshBuilder.CreateBox(
    'archery1Box',
    { width: 12, height: 10, depth: 25 },
    scene
  )
  archery1Box.position = new Vector3(112, 5.5, -93)
  archery1Box.isVisible = false
  archery1Box.physicsImpostor = new PhysicsImpostor(archery1Box, PhysicsImpostor.BoxImpostor, {
    mass: 0,
  })

  const fenceBox = MeshBuilder.CreateBox('fenceBox', { width: 0.5, height: 3, depth: 27 }, scene)
  fenceBox.position = new Vector3(85, 3.5, -92)
  fenceBox.isVisible = false
  fenceBox.physicsImpostor = new PhysicsImpostor(fenceBox, PhysicsImpostor.BoxImpostor, {
    mass: 0,
  })

  archery.physicsImpostor = new PhysicsImpostor(archery, PhysicsImpostor.NoImpostor, {
    mass: 0,
  })
  archery.addChild(archeryBox)
  archery.addChild(archery1Box)
  archery.addChild(fenceBox)
  allTexture.push(archeryBox)
  allTexture.push(archery1Box)
  allTexture.push(fenceBox)
}

export async function createBarracks(scene, shadowGenerator, allTexture) {
  const result = await SceneLoader.ImportMeshAsync(null, paths.models, 'Barracks.gltf', scene)
  const [barrack] = result.meshes
  barrack.scaling = new Vector3(18, 18, 18)
  barrack.position = new Vector3(0, 3.5, -90)
  barrack.rotation = new Vector3(0, 0, 0)
  shadowGenerator.addShadowCaster(barrack)

  const barrackBox = MeshBuilder.CreateBox('barrackBox', { width: 30, height: 10, depth: 8 }, scene)
  barrackBox.position = new Vector3(0, 5.5, -89.5)
  barrackBox.isVisible = false
  barrackBox.physicsImpostor = new PhysicsImpostor(barrackBox, PhysicsImpostor.BoxImpostor, {
    mass: 0,
  })

  const barrack1Box = MeshBuilder.CreateBox(
    'barrack1Box',
    { width: 13, height: 10, depth: 30 },
    scene
  )
  barrack1Box.position = new Vector3(0, 5.5, -89.5)
  barrack1Box.isVisible = false
  barrack1Box.physicsImpostor = new PhysicsImpostor(barrack1Box, PhysicsImpostor.BoxImpostor, {
    mass: 0,
  })

  barrack.physicsImpostor = new PhysicsImpostor(barrack, PhysicsImpostor.NoImpostor, {
    mass: 0,
  })
  barrack.addChild(barrackBox)
  barrack.addChild(barrack1Box)
  allTexture.push(barrackBox)
  allTexture.push(barrack1Box)
}

export async function createTowerHouse(scene, shadowGenerator, allTexture, x, z) {
  const result = await SceneLoader.ImportMeshAsync(null, paths.models, 'TowerHouse.gltf', scene)
  const [towerHouse] = result.meshes
  towerHouse.scaling = new Vector3(18, 18, 18)
  towerHouse.position = new Vector3(x, 3.5, z)
  towerHouse.rotation = new Vector3(0, -3.14, 0)
  shadowGenerator.addShadowCaster(towerHouse)

  const towerHouseBox = MeshBuilder.CreateBox('towerHouseBox', {
    width: 20,
    height: 10,
    depth: 20,
  })
  towerHouseBox.position = new Vector3(x, 5.5, z)
  towerHouseBox.isVisible = false
  towerHouseBox.physicsImpostor = new PhysicsImpostor(towerHouseBox, PhysicsImpostor.BoxImpostor, {
    mass: 0,
  })

  towerHouse.physicsImpostor = new PhysicsImpostor(towerHouse, PhysicsImpostor.NoImpostor, {
    mass: 0,
  })
  towerHouse.addChild(towerHouseBox)
  allTexture.push(towerHouseBox)
}
