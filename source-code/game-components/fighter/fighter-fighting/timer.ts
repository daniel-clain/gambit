import { TimerName } from "../../../types/fighter/timer-name";

export class Timer{

  private interval = 50
  private rejectActiveTimer: () => void

  timeElapsed: number

  constructor(
    public name: TimerName, 
    public maxDuration?: number
  ){}

  get active(){
    return (
      this.timeElapsed &&
      !this.maxDuration || 
      this.timeElapsed < this.maxDuration
    )
  }

  get timeRemaining(){
    return (
      (this.maxDuration && this.active) ?
        this.maxDuration - this.timeElapsed : undefined
    )
  }

  async start(){
    this.rejectActiveTimer?.()
    try{
      for(
        this.timeElapsed = 0; 
        this.active;
        this.timeElapsed += await (
          new Promise<number>((res, rej) => {
            this.rejectActiveTimer = rej
            setTimeout(res, this.interval, this.interval)
          })
        )
      );
    }catch{}
  }
  
  cancel(){
    this.rejectActiveTimer?.()
    delete this.timeElapsed
  }
}

