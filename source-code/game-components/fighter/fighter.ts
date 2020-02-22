
import FighterState from "./fighter-state";
import { FighterInfo } from '../../interfaces/game-ui-state.interface';
import Fight from '../fight/fight';
import FighterFighting from './fighter-fighting/fighter-fighting';
import { Skin } from '../../types/figher/skin';
import { GoalContract } from "../../interfaces/game/contract.interface";
import { random } from "../../helper-functions/helper-functions";


export default class Fighter{
  state: FighterState
  fighting: FighterFighting
  skin: Skin


  constructor(public name: string){
    this.state = new FighterState(this)
    this.fighting = new FighterFighting(this)

    this.determineSkin()

  }

  determineSkin(){
    const {strength, fitness} = this.fighting.stats
    if(
      strength >= fitness &&
      strength > 5
    ){
      this.skin = 'Muscle'
    }
    else if(
      fitness > strength &&
      fitness > 5
    ){
      this.skin = 'Fast'
    }
    else{
      this.skin = 'Default'

    }
  }

  determineGoalContract(){
    const {intelligence, fitness, strength, aggression } = this.fighting.stats
    const mainStatsCombined = intelligence + fitness + strength + aggression

    const halfOfMainStats = Math.round(mainStatsCombined * .5)

    const randomRange = random(halfOfMainStats) + halfOfMainStats

    const weeklyCost = randomRange

    this.state.goalContract = {
      numberOfWeeks: 6,
      weeklyCost
    }
  }




  getInfo(): FighterInfo{
    return {
      name: this.name, 
      strength: this.fighting.stats.strength,
      fitness: this.fighting.stats.fitness,
      intelligence: this.fighting.stats.intelligence,
      aggression: this.fighting.stats.aggression,
      numberOfFights: this.state.numberOfFights,
      numberOfWins: this.state.numberOfWins,
      manager: this.state.manager && this.state.manager.name,
      activeContract: this.state.activeContract,
      goalContract: this.state.goalContract,
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
  }


}