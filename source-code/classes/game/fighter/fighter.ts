
import IFighterStrategy, { RunAwayAndRecover } from "./fighter-strategies";
import Direction360 from "../../../types/figher/direction-360";

import FighterSkeleton from "../../../interfaces/game/fighter/fighter-skeleton";

import FighterState from "./fighter-state";

import ArenaDimensions from "../../../interfaces/game/fighter/arena-dimensions";
import FighterAttributes from './fighter-attributes';
import { FighterInfo } from '../../../interfaces/game-ui-state.interface';
import Manager from '../manager/manager';

interface FighterFighterInterface{
  //getAttacked(attack: FighterAttack, enemyFighterName: FighterName ): AttackResults
}

interface FightFighterInterface{
  getOtherFighters(): FighterFighterInterface
}

type FighterName = string


export default class Fighter {

  private _name: FighterName
  private _numberOfFights: number
  private _numberOfWins: number
  manager: Manager
  state: FighterState
  attributes: FighterAttributes
  private strategies: IFighterStrategy[] = [
    new RunAwayAndRecover(this)
  ]


  movingDirection: Direction360

  constructor(name: string){
    this._name = name
    this.attributes = new FighterAttributes()
    this.state = new FighterState()
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