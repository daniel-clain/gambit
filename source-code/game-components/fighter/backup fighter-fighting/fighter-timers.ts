import FighterFighting from "./fighter-fighting";
import { Timer } from "./timer";
import { TimerName } from "../../../types/fighter/timer-name";

export default class FighterTimers {
  private timers: Timer[] = [
    new Timer('last combat action'),
    new Timer('on a rampage', 5000),
    new Timer('move action', 3000),
    new Timer('memory of enemy behind'),
    new Timer('persist direction', 2000),
  ]
  
  constructor(public fighting: FighterFighting){}
  
  get activeTimers(){
    return this.timers.filter(t => t.active)
  }

  get(timerName: TimerName){
    return this.timers.find(t => t.name == timerName)
  }

  start(timerName: TimerName){
    this.timers.find(t => t.name == timerName).start()
  }
  
  cancel(timerName: TimerName, reason?: string){
    console.log(`${timerName} finished ${reason ? `, reason: ${reason}`: ''}(${this.fighting.fighter.name})`);
    this.timers.find(t => t.name == timerName).cancel()
  }


};
