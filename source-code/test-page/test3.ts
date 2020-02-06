interface ActiveTimer{
  name: string, 
  timeoutRef: number
  timeLeftIntervalRef: number
  timeLeft: number
}

export default class TestTimer {
  
  activeTimers: ActiveTimer[] = []

  startTimer(name, effect: () => void, duration){
    const alreadyRunning = this.activeTimers.find(timer => timer.name == name)
    if(alreadyRunning){
      console.log('replaced');
      this.removeActiveTimer(alreadyRunning.timeoutRef)
    }
    
    const timeLeftIntervalRef = setInterval((testTimer: TestTimer) => testTimer.getTimerByTimeoutRef(timeoutRef).timeLeft -= 20, 20, this)

    const timeoutRef = setTimeout(() => {
      effect()      
      this.removeActiveTimer(timeoutRef)
    }, duration) 
    this.activeTimers.push({name, timeoutRef, timeLeftIntervalRef, timeLeft: duration})
  }

  private removeActiveTimer(timeoutRef){
    clearTimeout(timeoutRef)
    const timerIndex = this.getTimerIndexByTimeoutRef(timeoutRef)
    const timer = this.activeTimers[timerIndex]
    console.log(`timer '${timer.name}' had ${timer.timeLeft} timer left when it was removed`);
    clearInterval(timer.timeLeftIntervalRef)
    this.activeTimers.splice(timerIndex, 1)
  }
  
  private getTimerByTimeoutRef(timeoutRef){
    return this.activeTimers.find(x => x.timeoutRef == timeoutRef)
  }

  private getTimerIndexByTimeoutRef(timeoutRef){
    return this.activeTimers.findIndex(x => x.timeoutRef == timeoutRef)
  }
}

const testTimer = new TestTimer()
let memoryOfBehind = undefined

const forgetMemoryOfBehind = () => {
  memoryOfBehind = undefined
  console.log('forgotten');
}


const rememberBehind = name => {
  memoryOfBehind = name  
  testTimer.startTimer('forget memory of behind', forgetMemoryOfBehind, 6000)
}

rememberBehind('Fred')
//setTimeout(() => console.log(memoryOfBehind), 1000)
setTimeout(() => rememberBehind('Joe'), 4000)

//setTimeout(() => console.log(memoryOfBehind), 4000)
setTimeout(() => {
  console.log(testTimer.activeTimers)
}, 6000)
