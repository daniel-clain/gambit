import { Subject } from "rxjs";
import { Fight } from "./fight";
import { Fighter } from "../../fighter/fighter";
import FightSkeleton from "../../../../interfaces/game/fight-skeleton";

export default class FightUpdateLoop{

  updateSubject: Subject<FightSkeleton> = new Subject()
  private updateIntervalTime: 100
  private updateInterval: any

  constructor(private fight: Fight){}


  startLoop(){
    this.updateInterval = setInterval(() => {
      const fightSkeleton: FightSkeleton = {
        countDown: null,
        timeRemaining: null,
        fighters: this.fight.fighters.map((fighter: Fighter) => fighter.getFighterSkeleton())
      }
      this.updateSubject.next(fightSkeleton)      
    }, this.updateIntervalTime)
  }

  stopLoop(){
    clearInterval(this.updateInterval)
  }
}
