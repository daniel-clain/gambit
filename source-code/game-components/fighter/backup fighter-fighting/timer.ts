import { TimerName } from "../../../types/fighter/timer-name"

export class Timer {
  private interval = 50
  private rejectActiveTimer: () => void

  private _timeElapsed: number | undefined

  get timeElapsed(): number | undefined {
    return this._timeElapsed
  }

  get name() {
    return this._name
  }

  get maxDuration() {
    return this._maxDuration
  }

  constructor(private _name: TimerName, private _maxDuration?: number) {}

  get active() {
    return (
      this.timeElapsed != undefined &&
      (!this.maxDuration || this.timeElapsed < this.maxDuration)
    )
  }

  get timeRemaining() {
    return this.maxDuration && this.timeElapsed && this.active
      ? this.maxDuration - this.timeElapsed
      : undefined
  }

  async start() {
    if (this.active) {
      this.rejectActiveTimer?.()
    }

    try {
      for (
        this._timeElapsed = 0;
        this.active;
        this._timeElapsed += await new Promise<number>((res, rej) => {
          this.rejectActiveTimer = rej
          setTimeout(res, this.interval, this.interval)
        })
      );
    } catch {}
  }

  cancel() {
    this.rejectActiveTimer?.()
    delete this._timeElapsed
  }
}
