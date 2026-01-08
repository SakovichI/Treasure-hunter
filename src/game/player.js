import {
  SceneLoader,
  Vector3,
  MeshBuilder,
  PhysicsImpostor,
  Quaternion,
  KeyboardEventTypes,
} from '@babylonjs/core'
import '@babylonjs/loaders'
import {
  PLAYER_SPEED,
  PLAYER_FAST_SPEED,
  PLAYER_ROT_LERP_SPEED,
  PLAYER_ROT_AMOUNT,
  CAMERA_HEIGHT,
} from '../config/constants.js'
import { paths } from '../config/paths.js'

export async function createPlayer(
  scene,
  shadowGenerator,
  camera,
  runAudio,
  fastRunAudio,
  treasureArray,
  guardArray,
  treasureAudio,
  victoryAudio,
  gameOverAudio,
  gameOverScreen,
  countProgress
) {
  const result = await SceneLoader.ImportMeshAsync(null, paths.models, 'Pirate_Male.gltf', scene)
  const [playerRoot] = result.meshes
  playerRoot.position = new Vector3(-56, 3.5, 0)
  shadowGenerator.addShadowCaster(playerRoot)

  const playerBox = MeshBuilder.CreateBox('playerBox', { width: 1.5, height: 3, depth: 1.5 }, scene)
  playerBox.position = new Vector3(-56, 5, 0)
  playerBox.isVisible = false
  playerRoot.addChild(playerBox)
  runAudio.attachToMesh(playerBox)
  fastRunAudio.attachToMesh(playerBox)

  playerBox.physicsImpostor = new PhysicsImpostor(playerBox, PhysicsImpostor.BoxImpostor, {
    mass: 0,
    restitution: 0,
  })

  playerRoot.physicsImpostor = new PhysicsImpostor(playerRoot, PhysicsImpostor.NoImpostor, {
    mass: 120,
    restitution: 1,
    friction: 5,
  })

  const playIdle = () => {
    result.animationGroups.forEach(ag => {
      if (ag.name === 'Idle') {
        ag.start(true)
      } else {
        ag.stop()
      }
    })
  }

  const playRun = () => {
    result.animationGroups.forEach(ag => {
      if (ag.name === 'Run') {
        ag.start(true)
      } else {
        ag.stop()
      }
    })
  }

  playIdle()
  playerRoot.rotationQuaternion = Quaternion.Identity()

  const targetPoint = playerRoot.position.clone()
  const targetRotation = playerRoot.rotationQuaternion.clone()

  let speed = PLAYER_SPEED
  const rotLerpSpeed = PLAYER_ROT_LERP_SPEED
  const rotAmount = PLAYER_ROT_AMOUNT
  const maxDelta = speed * 0.015

  const axis = {
    f: 0,
    r: 0,
  }

  const keys = {
    KeyW: 1,
    KeyS: -1,
    KeyA: -1,
    KeyD: 1,
  }

  const pressedKeys = {}

  scene.onKeyboardObservable.add(eventData => {
    const code = eventData.event.code

    if (code === 'ShiftLeft' && eventData.type === KeyboardEventTypes.KEYDOWN) {
      speed = PLAYER_FAST_SPEED
    } else if (code === 'ShiftLeft' && eventData.type === KeyboardEventTypes.KEYUP) {
      speed = PLAYER_SPEED
    }

    const getKey = c => {
      return pressedKeys[c] ? keys[c] : 0
    }

    if (eventData.type === KeyboardEventTypes.KEYDOWN) {
      pressedKeys[code] = 1
    } else if (eventData.type === KeyboardEventTypes.KEYUP) {
      pressedKeys[code] = 0
    }

    axis.f = getKey('KeyW') + getKey('KeyS')
    axis.r = getKey('KeyA') + getKey('KeyD')
  })

  scene.onBeforeRenderObservable.add(() => {
    for (let i = 0; i < treasureArray.length; i++) {
      if (playerBox.intersectsMesh(treasureArray[i])) {
        if (treasureArray[i].parent) {
          treasureArray[i].parent.dispose()
          countProgress.innerHTML = parseInt(++countProgress.innerHTML)
          treasureAudio.play()
          if (countProgress.innerHTML == treasureArray.length) {
            victoryAudio.play()
          }
        }
      }
    }

    for (let i = 0; i < guardArray.length; i++) {
      if (playerBox.intersectsMesh(guardArray[i])) {
        gameOverScreen.style.display = 'flex'
        gameOverAudio.play()
      }
    }

    const deltaTime = (scene.deltaTime ?? 1) / 1000

    if (Math.abs(axis.f) > 0.001) {
      const nextPoint = playerRoot.position.add(playerRoot.forward.scale(axis.f * 0.3))
      targetPoint.copyFrom(nextPoint)
    }

    if (Math.abs(axis.r) > 0.001) {
      targetRotation.multiplyInPlace(
        Quaternion.RotationAxis(Vector3.UpReadOnly, axis.r * rotAmount * deltaTime)
      )
    }

    Quaternion.SlerpToRef(
      playerRoot.rotationQuaternion,
      targetRotation,
      rotLerpSpeed * deltaTime,
      playerRoot.rotationQuaternion
    )

    const diff = targetPoint.subtract(playerRoot.position)
    if (diff.length() < maxDelta) {
      playIdle()
      runAudio.stop()
      fastRunAudio.stop()
      return
    }

    if (!runAudio.isPlaying) {
      runAudio.play()
      if (!fastRunAudio.isPlaying && speed === PLAYER_FAST_SPEED) {
        fastRunAudio.play()
      }
    }

    playRun()
    const dir = diff.normalize()
    const velocity = dir.scale(speed * deltaTime)
    playerRoot.position.addInPlace(velocity)

    camera.target.copyFrom(playerRoot.position)
    camera.target.y += CAMERA_HEIGHT
  })
}
