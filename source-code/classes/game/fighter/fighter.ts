import defaultFighterAttributes, { IFighterAttribute, IFighterAttributes } from "./fighter-attributes";
import IFighterStrategy, { RunAwayAndRecover } from "./fighter-strategies";
import Direction360 from "../../../types/figher/direction-360";
import { getDistanceBetweenTwoPositions, getDirectionOfPosition2FromPosition1, random } from "../../../helper-functions/helper-functions";
import ClosenessRating from "../../../types/figher/closeness-rating";
import Position from '../../../interfaces/game/fighter/position'
import FighterSkeleton from "../../../interfaces/game/fighter/fighter-skeleton";
import FacingDirection from "../../../types/figher/facing-direction";
import FighterModelState from "../../../types/figher/fighter-model-states";
import Fight from "../fight/fight";
import { Subject, Observable } from "rxjs";
import FighterState, { IFighterState } from "./fighter-state-manager";
import FighterStateManager from "./fighter-state-manager";
import FighterStatus from "./fighter-status";
import ArenaDimensions from "../../../interfaces/game/fighter/arena-dimensions";

interface FighterFighterInterface{
  getAttacked(attack: FighterAttack, enemyFighterName: FighterName ): AttackResults
}

interface FightFighterInterface{
  getOtherFighters(): FighterFighterInterface
}

type FighterName = string


export default class Fighter {

  private _name: FighterName
  private stateManager: FighterStateManager
  private attributes: IFighterAttributes
  private strategies: IFighterStrategy[] = [
    new RunAwayAndRecover(this)
  ]

  stateUpdateSubject: Subject<IFighterState> = new Subject()

  movingDirection: Direction360

  constructor(name: string){
    this._name = name
    this.attributes = defaultFighterAttributes
    this.setupInitialState()
  }

  private setupInitialState(){
    this.stateManager = new FighterStateManager()
    this.stateUpdateSubject = this.stateManager.updateSubject
    this.stateManager.maxStamina = this.attributes.endurance.value
    this.stateManager.maxSpirit = this.attributes.passion.value
  }
  

  moveTowardFighter(fighter: Fighter){
    this.movingDirection = this.getDirectionOfFighter(fighter)
  }

  get name(): FighterName{
    return this._name
  }

  tryToHitFighter(targetFighter: Fighter) {
    targetFighter.
    console.log(`${this.name} is trying to hit ${fighter.name}`);
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