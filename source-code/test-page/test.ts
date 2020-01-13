import { ActiveTimer } from "../interfaces/game/fighter/active-timer"
import { Timer } from "../interfaces/game/fighter/timer"
import { random, wait } from "../helper-functions/helper-functions"
import { TimerName } from "../types/figher/timer-name"
import Timers from "../game-components/fighter/fighter-fighting/timers"

class TestTimer {

  name = 'Bob'


  activeTimers: ActiveTimer[] = []
  async startTimer(timer: Timer) {
    const { name, duration } = timer
    let timeoutRef
    let countdownRef

    const randomNum = random(100)

    const logSupressedTimers: TimerName[] = [
      //'memory of enemy behind'
    ]
    const timerAlreadyRunning = this.activeTimers.find(timer => timer.name == name)
    if (timerAlreadyRunning) {
      timerAlreadyRunning.cancel(`it was reset with a new timer (${randomNum})`)
      await wait(5)
    }

    return new Promise((resolve, reject) => {
      if (!logSupressedTimers.some(name => name == timer.name))
        console.log(`${name}'s ${name} timer (${randomNum}) started `);
      if (timeoutRef)
        debugger
      timeoutRef = setTimeout(() => resolve(randomNum), duration);
      this.activeTimers.push({
        name,
        cancel: reject,
        timeRemaining: duration
      })
      countdownRef = setInterval(() => this.activeTimers.find(timer => timer.name == name).timeRemaining -= 50, 50)
    })
      .then((passedRandomNumber) => {
        const timeRemaining = this.activeTimers.find(timer => timer.name == name).timeRemaining
        if (name == 'memory of enemy behind' && timeRemaining > 50)
          console.log(`${name}'s ${name} timedout has ${timeRemaining} time remaining localNum(${randomNum}) passedRandomNumber(${passedRandomNumber})`);

        console.log(`${name}'s ${name} timer (${randomNum}) has timed out`);
      })
      .catch(reason => {
        const timeRemaining = this.activeTimers.find(timer => timer.name == name).timeRemaining
        if (name == 'memory of enemy behind' && timeRemaining > 50)
          console.log(`${name}'s ${name} canceled timer has ${timeRemaining} time remaining`);
        if (!logSupressedTimers.some(name => name == timer.name))
          console.log(`${name}'s ${name} timer (${randomNum}) was cancled because ${reason}`);
        clearTimeout(timeoutRef)
      })
      .finally(() => {
        clearInterval(countdownRef)
        this.activeTimers.splice(this.activeTimers.findIndex(timer => timer.name === name), 1)
      })
  }

  cancelTimers(timerNames: TimerName[], reason) {
    this.activeTimers.forEach(
      (timer: ActiveTimer) =>
        timerNames.some(timerName => timerName == timer.name) &&
        timer.cancel(reason)
    )
  }
}

const timers = new Timers(null)
const testTimer = new TestTimer()

testTimer.startTimer(timers.memoryOfEnemyBehind)

setTimeout(() => {
  
  testTimer.startTimer(timers.memoryOfEnemyBehind)
}, 1000);