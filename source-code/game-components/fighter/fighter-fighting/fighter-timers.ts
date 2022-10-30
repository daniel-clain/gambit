import FighterFighting from "./fighter-fighting";
import { ActiveTimer } from "../../../interfaces/game/fighter/active-timer";
import { TimerName } from "../../../types/fighter/timer-name";

export default class FighterTimers {
  constructor(public fighting: FighterFighting){}
  
  activeTimers: ActiveTimer[] = []

  showTimerLogs = false

 
  private startTimeRemainingInterval(timeoutRef){
    return setInterval((fighterTimer: FighterTimers) => {      
      const timer = fighterTimer.getTimerByTimeoutRef(timeoutRef)
      timer.timeRemaining -= 50
    }, 50, this)
  }
 
  private removeActiveTimer(timeoutRef, reason?){
    clearTimeout(timeoutRef)
    const timerIndex = this.getTimerIndexByTimeoutRef(timeoutRef)
    const timer = this.getTimerByTimeoutRef(timeoutRef)
    const {name} = this.fighting.fighter
    this.showTimerLogs && console.log(`${name}'s timer '${timer.name}' was removed because ${reason}, it had  ${timer.timeRemaining} timer remaining (${timeoutRef})`);
    if(timer.timeRemaining > 100 && reason == 'it finished'){
      //console.log(`error : ${name}' ${timer.name} timer finished even though it had ${timer.timeRemaining} time remaining`);
    }
    clearInterval(timer.timeRemainingIntervalRef)
    this.activeTimers.splice(timerIndex, 1)
  }
  
  private getTimerByTimeoutRef(timeoutRef){
    return this.activeTimers.find(x => x.timeoutRef == timeoutRef)
  }

  private getTimerIndexByTimeoutRef(timeoutRef){
    return this.activeTimers.findIndex(x => x.timeoutRef == timeoutRef)
  }

  cancelTimers(timerNames: TimerName[], reason){
    this.activeTimers.forEach(
      (timer: ActiveTimer) => 
        timerNames.some(timerName => timerName == timer.name) && 
        this.removeActiveTimer(timer.timeoutRef, reason)
    )
  }

  start(name: TimerName){
    const {logistics, fighter, movement, proximity} = this.fighting

    let duration: number
    let afterEffect: () => void

    switch(name){
      case 'just turned around': { 
        logistics.justTurnedAround = true
        duration = 3000 
        afterEffect = () => logistics.justTurnedAround = false
      } break;
      case 'just blocked': {
        logistics.justBlocked = true
        duration = 1500 
        afterEffect = () => logistics.justBlocked = false
      }; break
      case 'just dodged': {
        logistics.justDodged = true
        duration = 1500 
        afterEffect = () => logistics.justDodged = false
      }; break
      case 'just did attack': {
        logistics.justDidAttack = true
        duration = 1500 
        afterEffect = () => logistics.justDidAttack = false
      }; break
      case 'just took a hit': {
        logistics.justTookHit = true
        duration = 1000 
        afterEffect = () => logistics.justTookHit = false
      }; break
      case 'on a rampage': {
        fighter.fighting.energy = 0
        logistics.onARampage = true

        duration = 5000 
        afterEffect = () => {
          logistics.onARampage = false
          proximity.trapped = false
        }
      }; break
      case 'had action recently': {
        logistics.hadActionRecently = true
        duration = 5000 
        afterEffect = () => logistics.hadActionRecently = false
      }; break
      case 'move action in progress': {
        duration = 2000 
        afterEffect = () => movement.moveActionInProgress = undefined
      }; break
      case 'retreat between flankers': {        
        duration = 1000 
        afterEffect = () => {
          logistics.retreatBetweenFlankersDirection = undefined
        }
      }; break
      
      case 'memory of enemy behind': {
        duration = 3000
        afterEffect = () => {
          this.fighting.rememberedEnemyBehind = undefined          
          proximity.flanked = undefined
        }
      }; break
    }

    
    const timeoutRef = setTimeout((fighterTimers: FighterTimers) => {
      afterEffect && afterEffect()      
      fighterTimers.removeActiveTimer(timeoutRef, 'it finished')
    }, duration, this) 
    
    const alreadyRunning = this.activeTimers.find(timer => timer.name == name)
    if(alreadyRunning)
      this.removeActiveTimer(alreadyRunning.timeoutRef, `it was replaced with a new one (${timeoutRef})`)

    this.showTimerLogs && console.log(`${fighter.name}'s timer '${name}' started (${timeoutRef})`);

    const timeRemainingIntervalRef = this.startTimeRemainingInterval(timeoutRef)

    this.activeTimers.push({name, timeoutRef, timeRemainingIntervalRef, timeRemaining: duration})
  }

};
