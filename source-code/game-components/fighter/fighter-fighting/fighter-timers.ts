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
        duration: 2000,
      }),
      "just recovered": this.createTimer({
        timerName: "just recovered",
        duration: 1000,
      }),
      "just landed attack": this.createTimer({
        timerName: "just landed attack",
        duration: 1000,
      }),
      "just took hit": this.createTimer({
        timerName: "just took hit",
        duration: 1000,
      }),
      "was just sick": this.createTimer({
        timerName: "was just sick",
        duration: 5000,
      }),

      "targeted for attack": this.createTimer({
        timerName: "targeted for attack",
        duration: 3000,
        onFinish: () => {
          const { enemyTargetedForAttack, fighter } = this.fighting
          console.log(
            `${fighter.name} removing ${enemyTargetedForAttack?.name} from targeted for attack after  3 sec timer expired `
          )
          this.fighting.enemyTargetedForAttack = null
        },
      }),

      hallucinations: this.createTimer({
        timerName: "hallucinations",
        duration: 5000,
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

  private createTimer(props: {
    timerName: TimerName
    duration?: number
    onFinish?: () => void
  }) {
    return new Timer({
      fighting: this.fighting,
      timerName: props.timerName,
      duration: props.duration,
      onFinish: props.onFinish,
    })
  }
}

class Timer {
  timerName: TimerName
  elapsedTime: number | undefined /* milliseconds */
  active: boolean
  duration: number | undefined
  onFinish: (() => void) | undefined
  private expireTimeStep: number | undefined
  private timeStepSubscription: Subscription
  private fighting: FighterFighting
  private startTimeStep: number | undefined

  constructor(props: {
    fighting: FighterFighting
    timerName: TimerName
    onFinish?: () => void
    duration?: number
  }) {
    this.timerName = props.timerName
    this.fighting = props.fighting
    this.duration = props.duration
    this.onFinish = props.onFinish
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
          if (this.onFinish) {
            console.log(`running on finish for timer ${this.timerName}`)
            this.onFinish()
          }
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
