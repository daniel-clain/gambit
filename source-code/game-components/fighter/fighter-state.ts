
import OneToFive from '../../types/game/one-to-five.type';
import { ActiveContract, Contract } from '../../interfaces/game/contract.interface';
import Manager from '../manager/manager';
import Fight from "../fight/fight";
import { Employee } from '../../interfaces/game-ui-state.interface';
import Fighter from './fighter';



export default class FighterState{
  private _doping: boolean = false
  private _injured: boolean = false
  private _poisoned: boolean = false
  dead: boolean = false
  activeContract: ActiveContract = null
  guards: Employee[] = []
  
  trainingProgress = 0
  manager: Manager
  fight: Fight
  
  publicityRating = 0

  numberOfFights: number = 0
  numberOfWins: number = 0

  private maxVal: 5
  private minVal: 1

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
      this.fighter.fighting.stats.aggression += 3
    }
    this._doping = value
  }
  get doping(){
    return this._doping
  }



}


