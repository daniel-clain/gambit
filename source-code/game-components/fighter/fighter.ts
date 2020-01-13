import {Contract} from '../../interfaces/game/contract.interface';
import FighterState from "./fighter-state";
import { FighterInfo } from '../../interfaces/game-ui-state.interface';
import { AbilityTarget } from '../abilities/abilities';
import Fight from '../fight/fight';
import FighterFighting from './fighter-fighting/fighter-fighting';
import { Skin } from '../../types/figher/skin';
import { random } from '../../helper-functions/helper-functions';
import FighterModelImage from '../../interfaces/game/fighter/fighter-model-image';
import { defaultSkinModelImages } from '../../client/images/fighter/default-skin/default-skin-model-images';
import { muscleSkinModelImages } from '../../client/images/fighter/muscle-skin/muscle-skin-model-images';
import FighterStats from './fighter-fighting/stats';
import { fastSkinModelImages } from '../../client/images/fighter/fast-skin/fast-skin-model-images';


export default class Fighter implements AbilityTarget{
  type: 'Fighter'
  state: FighterState
  fighting: FighterFighting
  skin: Skin

  goalContract: Contract = {
    weeklyCost: 20,
    numberOfWeeks: 24
  }

  constructor(public name: string){
    this.state = new FighterState()
    this.fighting = new FighterFighting(this)

    this.determineSkin()

  }

  determineSkin(){
    const {maxStamina, strength, speed, aggression} = this.fighting.stats
    if(
      maxStamina > 3 &&
      strength > 3 &&
      aggression > 1 &&
      strength >= speed
    ){
      this.skin = 'Muscle'
    }
    else if(
      speed > strength &&
      strength < 4 &&
      maxStamina < 5 &&
      speed > 3
    ){
      this.skin = 'Fast'
    }
    else{
      this.skin = 'Default'
    }
  }


  getSkinModelImages(): FighterModelImage[]{
    switch(this.skin){
      case 'Default': return defaultSkinModelImages
      case 'Muscle': return muscleSkinModelImages
      case 'Fast': return fastSkinModelImages
    }
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
      strength: this.fighting.stats.strength,
      speed: this.fighting.stats.speed,
      intelligence: this.fighting.stats.intelligence,
      aggression: this.fighting.stats.aggression,
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