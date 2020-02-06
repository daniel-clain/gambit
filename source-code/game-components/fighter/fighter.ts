
import FighterState from "./fighter-state";
import { FighterInfo } from '../../interfaces/game-ui-state.interface';
import Fight from '../fight/fight';
import FighterFighting from './fighter-fighting/fighter-fighting';
import { Skin } from '../../types/figher/skin';


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
      activeContract: this.state.activeContract
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