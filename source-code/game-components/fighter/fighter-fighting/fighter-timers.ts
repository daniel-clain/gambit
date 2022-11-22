import FighterFighting from "./fighter-fighting";
import { Timer } from "./timer";
import { TimerName } from "../../../types/fighter/timer-name";

export default class FighterTimers {
  private timers: Timer[] = [
    new Timer('had action recently', 5000),
    new Timer('on a rampage', 5000),
    new Timer('retreat between flankers'),
    new Timer('desperate retreat'),
    new Timer('memory of enemy behind', 3000),
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
    console.log(`
      ${timerName} finished 
      ${reason ? `, reason: ${reason}`: ''}
    `);
    this.timers.find(t => t.name == timerName).cancel()
  }


};
