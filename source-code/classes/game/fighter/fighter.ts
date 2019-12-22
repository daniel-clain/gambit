import {Contract} from './../../../interfaces/game/contract.interface';
import IFighterStrategy, { RunAwayAndRecover } from "./fighter-strategies";
import Direction360 from "../../../types/figher/direction-360";
import FighterState from "./fighter-state";
import FighterAttributes from './fighter-attributes';
import { FighterInfo } from '../../../interfaces/game-ui-state.interface';
import FighterFightStateInfo from '../../../interfaces/game/fighter-fight-state-info';
import { AbilityTarget } from '../abilities/abilities';
import Fight from '../fight/fight';

interface FighterFighterInterface{
  //getAttacked(attack: FighterAttack, enemyFighterName: FighterName ): AttackResults
}

interface FightFighterInterface{
  getOtherFighters(): FighterFighterInterface
}

type FighterName = string


export default class Fighter implements AbilityTarget{
  type: 'Fighter'
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
  get name(){
    return this._name
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
      type: 'Fighter',
      strength: this.attributes.strength,
      speed: this.attributes.speed,
      intelligence: this.attributes.intelligence,
      aggression: this.attributes.aggression,
      endurance: this.attributes.endurance,
      numberOfFights: this.attributes.numberOfFights,
      numberOfWins: this.attributes.numberOfWins,
      inNextFight: !!this.state.inFight,
      manager: this.state.manager && this.state.manager.name,
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
      modelState: this.state.fighterModelState
    }
  }

  reset(){
    this.state.reset()
  }


  
  get numberOfWins(): number{
    return this.attributes.numberOfWins
  }
  
  get numberOfFights(): number{
    return this.attributes.numberOfFights
  }

  /* 
  moveTowardFighter(fighter: Fighter){
    this.movingDirection = this.getDirectionOfFighter(fighter)
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
  getFighterSkeleton(): FighterSkeleton{
    return {
      name: this.name,
      facingDirection: this.facingDirection,
      modelState: this.modelState,
      position: this.position
    }
  }
 */
  startFighting(){
    console.log(`${this.name} started fighting`);
  }

  getPutInFight(fight: Fight){
    this.state.inFight = fight

  }



}