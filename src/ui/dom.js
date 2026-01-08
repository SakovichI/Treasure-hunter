export function getDOMElements() {
  return {
    canvas: document.querySelector('#render-canvas'),
    timer: document.querySelector('.header__timer'),
    countProgress: document.querySelector('.count__progress'),
    countAll: document.querySelector('.count__need'),
    gameOverScreen: document.querySelector('.game-over'),
  }
}
