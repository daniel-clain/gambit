import IMessageService from "../../interfaces/message-service.interface";
import { Subject } from "rxjs";
import FightUpdates from "../../interfaces/game/fighter/fight-updates";
import { Fight } from "../../classes/game/round/fight/fight";
import FightSkeleton from "../../interfaces/game/fight-skeleton";

export default class LocalMessageService implements IMessageService{
  fightUpdatesSubject: Subject<FightUpdates> = new Subject()

  constructor(private fight: Fight){
    this.fight.fightUpdateLoop.updateSubject.subscribe(
      (fightSkeleton: FightSkeleton) => this.fightUpdatesSubject.next(fightSkeleton)
    )
  }

  
  onReceiveFightUpdates(callback: (value: FightUpdates) => void): void{
    this.fightUpdatesSubject.subscribe(callback)  
  }
}