import { Sound } from '@babylonjs/core'
import { paths } from '../config/paths.js'

export function createAudioManager(scene) {
  const fonAudio = new Sound('Music', `${paths.audio}main-menu.mp3`, scene, null, {
    loop: true,
    autoplay: true,
    volume: 0.05,
  })

  const runAudio = new Sound('run', `${paths.audio}run.mp3`, scene, null, {
    loop: true,
    volume: 0.25,
  })

  const fastRunAudio = new Sound('fastRun', `${paths.audio}fast-run.mp3`, scene, null, {
    loop: true,
    volume: 0.25,
  })

  const treasureAudio = new Sound('treasure', `${paths.audio}treasure.mp3`, scene, null, {
    volume: 0.2,
    length: 1.2,
  })

  const gameOverAudio = new Sound('gameOver', `${paths.audio}gameover.mp3`, scene, null, {
    volume: 0.3,
  })

  const victoryAudio = new Sound('victory', `${paths.audio}victory.mp3`, scene, null, {
    volume: 0.3,
  })

  const timeOutAudio = new Sound('timeOut', `${paths.audio}time-out.mp3`, scene, null, {
    loop: true,
    volume: 0.4,
  })

  return {
    fonAudio,
    runAudio,
    fastRunAudio,
    treasureAudio,
    gameOverAudio,
    victoryAudio,
    timeOutAudio,
  }
}
