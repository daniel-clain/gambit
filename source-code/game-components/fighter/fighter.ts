
import FighterState from "./fighter-state";
import Fight from '../fight/fight';
import FighterFighting from './fighter-fighting/fighter-fighting';
import { random } from "../../helper-functions/helper-functions";
import FighterStats from "./fighter-fighting/stats";
import { FighterInfo } from "../../interfaces/front-end-state-interface";
import { Skin } from "../../types/fighter/skin";


export default class Fighter{
  state: FighterState = new FighterState()
  fighting: FighterFighting
  skin: Skin


  constructor(public name: string){
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
    const {numberOfFights, numberOfWins, activeContract, goalContract, manager} = this.state
    return {
      name: this.name, 
      ...getStats(this.fighting.stats),
      numberOfFights: {roundsSinceUpdated: 0, lastKnownValue: numberOfFights},
      numberOfWins: {roundsSinceUpdated: 0, lastKnownValue: numberOfWins},
      manager: {roundsSinceUpdated: 0, lastKnownValue: manager?.has.name},
      activeContract,
      goalContract
    }


    function getStats({strength, fitness, intelligence, aggression}: FighterStats){
      return {
        strength: {roundsSinceUpdated: 0, lastKnownValue: strength}, 
        fitness: {roundsSinceUpdated: 0, lastKnownValue: fitness}, 
        intelligence: {roundsSinceUpdated: 0, lastKnownValue: intelligence}, 
        aggression: {roundsSinceUpdated: 0, lastKnownValue: aggression}, 
      }
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