import { Engine } from '@babylonjs/core'

export function createEngine(canvas) {
  const engine = new Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  })

  if (engine.audioEngine) {
    engine.audioEngine.useCustomUnlockedButton = true
  }

  window.addEventListener('resize', () => {
    engine.resize()
  })

  return engine
}
