import { Fighter } from "../../fighter/fighter";
import Player from "../../../../interfaces/player";
import { Subscription, Subject } from 'rxjs'
import FightUpdateLoop from "./fight-update-loop";

export default class Fight {
  fightUpdateLoop: FightUpdateLoop
  fighters: Fighter[]
  
  constructor(fighters: Fighter[]) {
    this.fighters = fighters
    this.fighters.forEach((fighter: Fighter) => fighter.joinFight(this))
    this.fightUpdateLoop = new FightUpdateLoop(this)
  }

  getOtherFightersInFight(thisFighter: Fighter){
    return this.fighters.filter((fighter: Fighter) => fighter.name != thisFighter.name)
  }
  
  

  start(){
    this.fightUpdateLoop.startLoop()
  }


}