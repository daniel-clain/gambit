import {Contract} from '../../interfaces/game/contract.interface';
import FighterState from "./fighter-state";
import { FighterInfo } from '../../interfaces/game-ui-state.interface';
import { AbilityTarget } from '../abilities/abilities';
import Fight from '../fight/fight';
import FighterFighting from './fighter-fighting/fighter-fighting';

export default class Fighter implements AbilityTarget{
  type: 'Fighter'
  state: FighterState
  fighting: FighterFighting

  goalContract: Contract = {
    weeklyCost: 20,
    numberOfWeeks: 24
  }

  constructor(public name: string){
    this.state = new FighterState()
    this.fighting = new FighterFighting(this)
  }


  contractOffered(offeredContract: Contract){
    if(offeredContract == this.goalContract)
      return true
  }


  getInfo(): FighterInfo{
    return {
      lastUpdated: parseInt(new Date().getTime().toString()),
      name: this.name, 
      type: 'Fighter',
      strength: this.state.strength,
      speed: this.state.speed,
      intelligence: this.state.intelligence,
      aggression: this.state.aggression,
      numberOfFights: this.state.numberOfFights,
      numberOfWins: this.state.numberOfWins,
      inNextFight: !!this.state.fight,
      manager: this.state.manager && this.state.manager.name,
      injured: this.state.injured,
      healthRating: this.state.healthRating,
      doping: this.state.doping,
      happyness: this.state.happieness,
      publicityRating: this.state.publicityRating,

    }
  }
  startFighting(){
    this.fighting.start()
  }

  
  stopFighting(){
    this.fighting.stop()
  }

  reset(){
    this.fighting.reset()
  }

  getPutInFight(fight: Fight){
    this.state.fight = fight
    this.fighting.reset()
  }


}