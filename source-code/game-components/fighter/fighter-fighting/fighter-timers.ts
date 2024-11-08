import { Subscription } from "rxjs"
import { TimerName } from "../../../types/fighter/timer-name"
import FighterFighting from "./fighter-fighting"

export default class FighterTimers {
  activeTimers: Record<TimerName, Timer>

  constructor(private fighting: FighterFighting) {
    this.activeTimers = {
      "memory of enemy behind": this.createTimer({
        timerName: "memory of enemy behind",
      }),
      "last combat action": this.createTimer({
        timerName: "last combat action",
      }),
      "move action": this.createTimer({
        timerName: "move action",
        duration: 3000,
      }),
      "on a rampage": this.createTimer({
        timerName: "on a rampage",
        duration: 5000,
      }),
      "persist direction": this.createTimer({
        timerName: "persist direction",
        duration: 20000,
      }),
      "passive recover": this.createTimer({
        timerName: "passive recover",
        duration: 4000,
      }),
    }
  }

  start(timerName: TimerName) {
    this.activeTimers[timerName].start()
  }
  cancel(timerName: TimerName) {
    this.activeTimers[timerName].cancel()
  }
  isActive(timerName: TimerName) {
    return this.activeTimers[timerName].active
  }
  get(timerName: TimerName) {
    return this.activeTimers[timerName]
  }

  cancelAllTimers() {
    for (let timer in this.activeTimers) {
      this.activeTimers[timer as TimerName].cancel()
    }
  }

  private createTimer(props: { timerName: TimerName; duration?: number }) {
    return new Timer({
      fighting: this.fighting,
      timerName: props.timerName,
      duration: props.duration,
    })
  }
}

class Timer implements Timer {
  timerName: TimerName
  elapsedTime: number | undefined
  active: boolean
  duration: number | undefined
  private expireTimeStep: number | undefined
  private timeStepSubscription: Subscription
  private fighting: FighterFighting
  private startTimeStep: number | undefined

  constructor(props: {
    fighting: FighterFighting
    timerName: TimerName
    duration?: number
  }) {
    this.timerName = props.timerName
    this.fighting = props.fighting
    this.duration = props.duration
  }
  start() {
    const { fightGenTimeStep, fightGenTimeStepSubject } = this.fighting.fight!
    this.startTimeStep = fightGenTimeStep
    this.timeStepSubscription?.unsubscribe()

    this.active = true
    if (this.duration) {
      this.expireTimeStep = fightGenTimeStep + this.duration
    }
    this.timeStepSubscription = fightGenTimeStepSubject.subscribe(
      (fightGenTimeStep) => {
        this.elapsedTime = fightGenTimeStep - this.startTimeStep!
        if (this.duration && fightGenTimeStep > this.expireTimeStep!) {
          console.log(`${this.timerName} has expired`)
          this.cancel()
        }
      }
    )
  }
  cancel() {
    this.active = false
    this.expireTimeStep = undefined
    this.startTimeStep = undefined
    this.elapsedTime = undefined
    this.timeStepSubscription?.unsubscribe()
  }
}
