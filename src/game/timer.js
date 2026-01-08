export function startTimer(time, timer, fonAudio, timeOutAudio, gameOverAudio, gameOverScreen) {
  let nowDate = new Date().getMinutes()
  let countDownTime = new Date().setMinutes(nowDate + time)
  let updateTimer = setInterval(() => {
    let now = new Date().getTime()
    let difference = countDownTime - now

    let minutesDif = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    let secondsDif = Math.floor((difference % (1000 * 60)) / 1000)
    timer.innerHTML = `${minutesDif}:${secondsDif}`

    if (minutesDif === 0 && secondsDif > 0) {
      timer.classList.add('active')
      timer.style.animation = 'timeOutAnim 1.0s ease-in infinite'
      fonAudio.stop()
      if (!timeOutAudio.isPlaying) {
        timeOutAudio.play()
      }
    } else {
      timeOutAudio.stop()
      if (!fonAudio.isPlaying) {
        fonAudio.play()
      }
    }

    if (difference < 0) {
      clearInterval(updateTimer)
      timer.style.animation = 'none'
      timer.innerHTML = '0:0'
      gameOverScreen.style.display = 'flex'
      gameOverAudio.play()
    }
  }, 100)
}
