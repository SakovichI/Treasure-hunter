import { createScene } from './scene.js'
import { createCamera } from './camera.js'
import { createLighting } from './lighting.js'
import { createAudioManager } from './audio.js'
import { createSkybox, createSand, createWater, createGround } from './environment.js'
import {
  createWall,
  createPort,
  createBarrel,
  createHouse,
  createFarm,
  createCenter,
  createMarket,
  createTemple,
  createArchery,
  createBarracks,
  createTowerHouse,
} from './buildings.js'
import { createTreasure } from './treasure.js'
import { createGuard } from './guard.js'
import { createPlayer } from './player.js'
import { startTimer } from './timer.js'

export async function initializeGame(engine, canvas, time, countTreasure, domElements) {
  const { timer, countAll, gameOverScreen, countProgress } = domElements

  const scene = createScene(engine)
  const camera = createCamera(scene, canvas)
  const { shadowGenerator } = createLighting(scene)
  const audio = createAudioManager(scene)

  if (engine.audioEngine) {
    engine.audioEngine.useCustomUnlockedButton = true
  }

  const skybox = createSkybox(scene)
  const sand = createSand(scene)
  createWater(scene, skybox, sand)

  createGround(scene, -0.3, 3.5, -100)
  createGround(scene, -0.3, 3.5, 0)
  createGround(scene, -0.3, 3.5, 100)
  createGround(scene, 99.7, 3.5, -100)
  createGround(scene, 99.7, 3.5, 0)
  createGround(scene, 99.7, 3.5, 100)

  const allTexture = []
  await createWall(scene, shadowGenerator, allTexture)
  await createPort(scene, shadowGenerator)
  await createBarrel(scene, shadowGenerator, -50, 0)

  for (let i = 0; i < 5; i++) {
    await createHouse(scene, shadowGenerator, allTexture, i * 25, 98)
  }
  for (let i = 0; i < 5; i++) {
    await createHouse(scene, shadowGenerator, allTexture, i * 25, 38)
  }

  for (let i = 0; i < 5; i++) {
    await createFarm(scene, shadowGenerator, allTexture, i * 25, 70)
  }

  await createCenter(scene, shadowGenerator, allTexture)

  for (let i = 0; i < 2; i++) {
    await createMarket(scene, shadowGenerator, allTexture, i * 80 + 10, 5, 1.55)
  }
  for (let i = 0; i < 2; i++) {
    await createMarket(scene, shadowGenerator, allTexture, i * 80 + 10, -32, 1.55)
  }

  await createTemple(scene, shadowGenerator, allTexture)
  await createArchery(scene, shadowGenerator, allTexture)
  await createBarracks(scene, shadowGenerator, allTexture)
  await createTowerHouse(scene, shadowGenerator, allTexture, 65, -95)
  await createTowerHouse(scene, shadowGenerator, allTexture, 32, -95)

  const treasureArray = []
  for (let i = 0; i < countTreasure; i++) {
    if (i >= countTreasure / 2) {
      const treasure = await createTreasure(
        scene,
        shadowGenerator,
        Math.floor(Math.random() * 100) + 1,
        Math.floor(Math.random() * 100) + 1
      )
      treasureArray.push(treasure)
      countAll.innerHTML = countTreasure
    } else {
      const treasure = await createTreasure(
        scene,
        shadowGenerator,
        Math.floor(Math.random() * 100) + 1,
        Math.floor(Math.random() * -100) - 1
      )
      treasureArray.push(treasure)
      countAll.innerHTML = countTreasure
    }
  }

  const guardArray = []
  const guardArea = await createGuard(scene, shadowGenerator)
  guardArray.push(guardArea)

  await createPlayer(
    scene,
    shadowGenerator,
    camera,
    audio.runAudio,
    audio.fastRunAudio,
    treasureArray,
    guardArray,
    audio.treasureAudio,
    audio.victoryAudio,
    audio.gameOverAudio,
    gameOverScreen,
    countProgress
  )

  gameOverScreen.addEventListener('click', () => {
    window.location.reload()
  })

  startTimer(time, timer, audio.fonAudio, audio.timeOutAudio, audio.gameOverAudio, gameOverScreen)

  engine.runRenderLoop(() => {
    if (scene) {
      scene.render()
      window.addEventListener('keydown', () => {
        if (engine.audioEngine && !engine.audioEngine.unlocked) {
          engine.audioEngine.unlock()
          engine.audioEngine.setGlobalVolume(1)
        }
      })
    }
  })

  return scene
}
