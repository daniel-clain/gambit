import FacingDirection from "../../../types/figher/facing-direction";
import FighterModelState from "../../../types/figher/fighter-model-states";
import { Observable, Subject } from "rxjs";
import { random } from "../../../helper-functions/helper-functions";

export interface IFighterUIState{
  position: Position
  facingDirection: FacingDirection
  modelState: FighterModelState
}

export default class FighterStateManager implements IFighterUIState{
  private _position: Position
	private _facingDirection: FacingDirection
  private _modelState: FighterModelState = 'Idle'
  private _stamina: number
  private _spirit: number
  private _maxStamina: number
  private _maxSpirit: number
  knockedOut = false 

  updateSubject: Subject<IFighterUIState> = new Subject()

  constructor(){    
    this._facingDirection = !!random(2) ? 'left' : 'right'
  }

  set position(v: Position){
    if(v !== this._position){
      this._position = v
      this.triggerUiStateUpdate()
    }
  }
  get position(): Position{
    return this._position
  }

  set facingDirection(v: FacingDirection){
    if(v !== this._facingDirection){
      this._facingDirection = v
      this.triggerUiStateUpdate()
    }
  }
  get facingDirection(): FacingDirection{
    return this._facingDirection
  }

  set modelState(v: FighterModelState){
    if(v !== this._modelState){
      this._modelState = v
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

  set spirit(v: number){
    if(v == this._spirit){
      throw 'should not have set spirit to same value'
    }
    if(v > 10){
      throw 'should not have set spirit to larger than max spirit: ' + this.maxSpirit
    }
    if(v < 0){
      throw 'should not have set spirit to less than 0'
    }
    this._spirit = v
  }
  get spirit(): number{
    return this._spirit
  }
  
  set stamina(v: number){
    if(v == this._stamina){
      throw 'should not have set stamina to same value'
    }
    if(v > this.maxStamina){
      throw 'should not have set stamina to larger than max stamina: ' + this.maxStamina
    }
    if(v < 0){
      throw 'should not have set stamina to less than 0'
    }
    this._stamina = v
  }
  get stamina(): number{
    return this._stamina
  }


  set maxStamina(v: number){
    this._maxStamina = v
  }
  get maxStamina(): number{
    return this._maxStamina
  }
  
  set maxSpirit(v: number){
    this._maxSpirit = v
  }
  get maxSpirit(): number{
    return this._maxSpirit
  }


}