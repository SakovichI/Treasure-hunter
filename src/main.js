import './style.css'
import { createEngine } from './game/engine.js'
import { initializeGame } from './game/game.js'
import { getDOMElements } from './ui/dom.js'
import { DEFAULT_TIME, DEFAULT_TREASURE_COUNT } from './config/constants.js'

function startGame(time = DEFAULT_TIME, countTreasure = DEFAULT_TREASURE_COUNT) {
  const domElements = getDOMElements()
  const engine = createEngine(domElements.canvas)

  initializeGame(engine, domElements.canvas, time, countTreasure, domElements).catch(error => {
    console.error('Error initializing game:', error)
  })
}

window.addEventListener('load', () => {
  startGame(DEFAULT_TIME, DEFAULT_TREASURE_COUNT)
})
