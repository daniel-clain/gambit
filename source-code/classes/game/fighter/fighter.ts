import {Contract} from './../../../interfaces/game/contract.interface';

import IFighterStrategy, { RunAwayAndRecover } from "./fighter-strategies";
import Direction360 from "../../../types/figher/direction-360";

import FighterSkeleton from "../../../interfaces/game/fighter/fighter-skeleton";

import FighterState from "./fighter-state";

import ArenaDimensions from "../../../interfaces/game/fighter/arena-dimensions";
import FighterAttributes from './fighter-attributes';
import { FighterInfo } from '../../../interfaces/game-ui-state.interface';
import Manager from '../manager/manager';
import FighterFightStateInfo from '../../../interfaces/game/fighter-fight-state-info';
import { of } from 'rxjs';

interface FighterFighterInterface{
  //getAttacked(attack: FighterAttack, enemyFighterName: FighterName ): AttackResults
}

interface FightFighterInterface{
  getOtherFighters(): FighterFighterInterface
}

type FighterName = string


export default class Fighter {

  state: FighterState
  attributes: FighterAttributes
  private strategies: IFighterStrategy[] = [
    new RunAwayAndRecover(this)
  ]
  goalContract: Contract = {
    weeklyCost: 20,
    numberOfWeeks: 24
  }


  movingDirection: Direction360

  constructor(private _name: string){
    this.attributes = new FighterAttributes()
    this.state = new FighterState()
  }

  stopFighting(){
    console.log(`${this.name} was told to stop fighting`);
  }

  contractOffered(offeredContract: Contract){
    if(offeredContract == this.goalContract)
      return true
  }

  getInfo(): FighterInfo{
    return {
      lastUpdated: parseInt(new Date().getTime().toString()),
      name: this.name, 

      strength: this.attributes.strength,
      speed: this.attributes.speed,
      intelligence: this.attributes.intelligence,
      aggression: this.attributes.aggression,
      endurance: this.attributes.endurance,
      numberOfFights: this.attributes.numberOfFights,
      numberOfWins: this.attributes.numberOfWins,

      manager: this.manager && this.manager.name,

      injured: this.state.injured,
      healthRating: this.state.healthRating,
      doping: this.state.doping,
      happyness: this.state.happieness,
      publicityRating: this.state.publicityRating,

    }
  }

  getFighterFightStateInfo(): FighterFightStateInfo{
    return {
      name: this._name,
      position: this.state.position,
      facingDirection: this.state.facingDirection,
      fighterModelState: this.state.fighterModelState
    }
  }


  moveTowardFighter(fighter: Fighter){
    this.movingDirection = this.getDirectionOfFighter(fighter)
  }

  get name(): FighterName{
    return this._name
  }

  get numberOfWins(): number{
    return this._numberOfWins
  }

  get numberOfFights(): number{
    return this._numberOfFights
  }

  tryToHitFighter(targetFighter: Fighter) {
    console.log(`${this.name} is trying to hit ${targetFighter.name}`);
    this.takeHit()
  }

  getAttackedByFighter(attackingFighter: Fighter, attack: Attack): AttackResults{
    this.takeHit(attack)
  }

  private takeHit(attack: Attack){
    this.status.stamina -= attack.damage
    this.stateManager.modelState = 'Taking Hit'
  }

  recieveFightInterface(fightInterface: FightFighterInterface){

  }

  startFighting(){
    console.log(`${this.name} started fighting`);
  }

  getPutInFight(x: ArenaDimensions){

  }

  leaveFight(){
    this.fight = null
  }

  getFighterSkeleton(): FighterSkeleton{
    return {
      name: this.name,
      facingDirection: this.facingDirection,
      modelState: this.modelState,
      position: this.position
    }
  }

}