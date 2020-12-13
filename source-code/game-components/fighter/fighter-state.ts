
import { ActiveContract, GoalContract } from '../../interfaces/game/contract.interface';
import Manager from '../manager';
import Fight from "../fight/fight";
import { Employee, KnownFighterStat } from '../../interfaces/server-game-ui-state.interface';
import Fighter from './fighter';



export default class FighterState{
  private _doping: boolean = false
  private _injured: boolean = false
  private _poisoned: boolean = false
  dead: boolean = false
  activeContract: ActiveContract = null
  goalContract: GoalContract = null
  guards: Employee[] = []
  
  trainingProgress = 0
  manager: Manager
  fight: Fight
  
  publicityRating = 0

  numberOfFights: number = 0
  numberOfWins: number = 0

  constructor(private fighter: Fighter){}

  set injured(value){
    if(value == true){      
      this.fighter.fighting.stats.speed *= .5
      this.fighter.fighting.stats.maxStamina *= .5
      this.fighter.fighting.stats.aggression *=.5
    }
    this._injured = value
  }
  get injured(){
    return this._injured
  }
  set poisoned(value){
    if(value == true){      
      this.fighter.fighting.stats.strength *= .5
      this.fighter.fighting.stats.maxSpirit *= .1
      this.fighter.fighting.stats.aggression + 5
      this.fighter.fighting.stats.intelligence *= .1
    }
    this._poisoned = value
  }
  get poisoned(){
    return this._poisoned
  }
  
  set doping(value){
    if(value == true){      
      this.fighter.fighting.stats.speed += 2
      this.fighter.fighting.stats.strength += 2
      this.fighter.fighting.stats.aggression += 2
    }
    this._doping = value
  }
  get doping(){
    return this._doping
  }



}


