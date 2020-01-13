import FighterFighting from "../fighter-fighting"
import Actions from "./actions"
import DecideAction from "./decide-action"
import StartAction from "./start-action"
import DecideActionProbability from "./decide-action-probability"
import Action from "../../../../interfaces/game/fighter/action"
import { ActionName } from "../../../../types/figher/action-name"

export default class FighterActions{

  private _actions: Actions
  private _decideAction: DecideAction
  private _startAction: StartAction
  decideActionProbability: DecideActionProbability

  constructor(fighting: FighterFighting){
    this._actions = new Actions(fighting)
    this._decideAction = new DecideAction(fighting)
    this._startAction = new StartAction(fighting)
    this.decideActionProbability = new DecideActionProbability(fighting)
  }

  decideAction(){
    this._decideAction.decideAction()
  }

  startAction(action: Action): Promise<void>{
    return this._startAction.startAction(action)
  }

  cancelAction(reason){
    this._startAction.cancelAction(reason)
  }

  startCooldown(duration){
    return this.startAction({
      name: 'doing cooldown',
      model: 'Idle',
      getDuration: () => duration
    })
    .catch(reason => reason)
  }


  get actionInProgress(): ActionName{
    return this._startAction.actionInProgress
  }


  get turnAround(){
    return this._actions.turnAround
  }
  
  get moveABit(): Action{
    return this._actions.moveABit
  }
  get recover(): Action{
    return this._actions.recover
  }
  
  get tryToCriticalStrike(): Action{
    return this._actions.tryToCriticalStrike
  }

  get criticalStrike(): Action{
    return this._actions.criticalStrike
  }
  
  get missedCriticalStrike(): Action{
    return this._actions.missedCriticalStrike
  }

  get tryToPunch(): Action{
    return this._actions.tryToPunch
  }
  get punch(): Action{
    return this._actions.punch
  }
  
  get missedPunch(): Action{
    return this._actions.missedPunch
  }

  get defend(): Action{
    return this._actions.defend
  }
  
  get block(): Action{
    return this._actions.block
  }
  
  get dodge(): Action{
    return this._actions.dodge
  }

  get takeAHit(): Action{
    return this._actions.takeAHit
  }


  
  
  

}
