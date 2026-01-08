import { Engine } from '@babylonjs/core'

export function createEngine(canvas) {
  const engine = new Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  })

  // Setup audio engine
  if (engine.audioEngine) {
    engine.audioEngine.useCustomUnlockedButton = true
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    engine.resize()
  })

  return engine
}
