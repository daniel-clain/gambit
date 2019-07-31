import FacingDirection from "../../../types/figher/facing-direction";
import FighterModelState from "../../../types/figher/fighter-model-states";
import { Observable, Subject } from "rxjs";
import { random } from "../../../helper-functions/helper-functions";
import OneToFive from '../../../types/game/one-to-five.type';

export interface IFighterUIState{
  position: Position
  facingDirection: FacingDirection
  modelState: FighterModelState
}

export default class FighterState implements IFighterUIState{
  private _position: Position
	private _facingDirection: FacingDirection
  private _modelState: FighterModelState = 'Idle'
  private _stamina: number
  private _spirit: number
  maxStamina: number
  maxSpirit: number
  private _injured: boolean
  private _healthRating: OneToFive
  private _doping: boolean
  private _happieness: OneToFive
  private _knockedOut: boolean 
  private _publicityRating: OneToFive

  updateSubject: Subject<IFighterUIState> = new Subject()

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

  set modelState(val: FighterModelState){
    if(val !== this._modelState){
      this._modelState = val
      this.triggerUiStateUpdate()
    }
  }
  get modelState(): FighterModelState{
    return this._modelState
  }

  private triggerUiStateUpdate(){
    this.updateSubject.next({
      position: this.position, 
      facingDirection: this.facingDirection, 
      modelState: this.modelState
    })
  }

  set spirit(val: number){
    if(val == this._spirit){
      throw 'should not have set spirit to same value'
    }
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
    if(val == this._stamina){
      throw 'should not have set stamina to same value'
    }
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