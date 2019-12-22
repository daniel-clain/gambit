import FacingDirection from "../../../types/figher/facing-direction";
import FighterModelState from "../../../types/figher/fighter-model-states";
import { Observable, Subject } from "rxjs";
import { random } from "../../../helper-functions/helper-functions";
import OneToFive from '../../../types/game/one-to-five.type';
import Position from '../../../interfaces/game/fighter/position';
import { ActiveContract } from '../../../interfaces/game/contract.interface';
import Manager from '../manager/manager';
import Fight from "../fight/fight";


export interface IFighterUIState{
  position: Position
  facingDirection: FacingDirection
  fighterModelState: FighterModelState
}

export default class FighterState implements IFighterUIState{
  private _position: Position = {x: 0, y: 0}
	private _facingDirection: FacingDirection
  private _fighterModelState: FighterModelState = 'Idle'
  private _stamina: number
  private _spirit: number
  maxStamina: number
  maxSpirit: number
  private _doping: boolean = false
  private _happieness: OneToFive = 4
  private _knockedOut: boolean = false
  
  private _injured: boolean = false
  private _healthRating: OneToFive = 5
  private _publicityRating: OneToFive = 1
  activeContract: ActiveContract = null
  manager: Manager
  inFight: Fight



  fighterStateUpdatedSubject: Subject<void> = new Subject()
  knockedOutSubject: Subject<boolean> = new Subject()

  constructor(){    
    this._facingDirection = !!random(2) ? 'left' : 'right'
  }

  set position(val: Position){
    if(val !== this._position){
      this._position = val
      this.triggerUiStateUpdate()
    }
  }
  get position(): Position{
    return this._position
  }

  set facingDirection(val: FacingDirection){
    if(val !== this._facingDirection){
      this._facingDirection = val
      this.triggerUiStateUpdate()
    }
  }
  get facingDirection(): FacingDirection{
    return this._facingDirection
  }

  set fighterModelState(val: FighterModelState){
    if(val !== this._fighterModelState){
      this._fighterModelState = val
      this.triggerUiStateUpdate()
    }
  }
  get fighterModelState(): FighterModelState{
    return this._fighterModelState
  }

  private triggerUiStateUpdate(){
    this.fighterStateUpdatedSubject.next()
  }

  reset(){
    this.knockedOut = false
    this.stamina = this.maxStamina
    this.spirit = this.maxSpirit
  }

  set spirit(val: number){
    if(val > 10){
      throw 'should not have set spirit to larger than max spirit: ' + this.maxSpirit
    }
    if(val < 0){
      throw 'should not have set spirit to less than 0'
    }
    this._spirit = val
  }
  get spirit(): number{
    return this._spirit
  }
  
  set stamina(val: number){
    if(val > this.maxStamina){
      throw 'should not have set stamina to larger than max stamina: ' + this.maxStamina
    }
    if(val < 0){
      throw 'should not have set stamina to less than 0'
    }
    this._stamina = val
  }
  get stamina(): number{
    return this._stamina
  }


  get healthRating(){
    return this._healthRating
  }

  get injured(){
    return this._injured
  }
  set doping(val){
    this._doping = val
  }
  set happieness(val){
    this._happieness = val
  }
  set knockedOut(val){
    this._knockedOut = val
    this.knockedOutSubject.next(this._knockedOut)
    this.triggerUiStateUpdate()
  }
  set publicityRating(val){
    this._publicityRating = val
  }
  get doping(){
    return this._doping
  }
  get happieness(){
    return this._happieness
  }
  get knockedOut(){
    return this._knockedOut
  }
  get publicityRating(){
    return this._publicityRating
  }
}


