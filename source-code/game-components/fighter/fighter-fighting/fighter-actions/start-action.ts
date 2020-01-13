import FighterFighting from "../fighter-fighting";
import { ActionName } from "../../../../types/figher/action-name";
import Action from "../../../../interfaces/game/fighter/action";
import { wait, random } from "../../../../helper-functions/helper-functions";

export default class StartAction{
  constructor(private fighting: FighterFighting){}
  
  actionTimeout
  cancelAction: (reason: string) => void
  actionInProgress: ActionName
  
  async startAction(action: Action){
    if(this.fighting.knockedOut)
      throw('knocked out')
    const {name, getDuration, model, sound, cooldown} = action
    const duration = getDuration ? getDuration() : null
    let timeoutRef

    const randomNum = random(100)

    const logSupressedActions: ActionName[] = [
      'moving a bit', 
      //'turning around', 
      'doing cooldown'
    ]

    if(this.actionInProgress){
      this.cancelAction(`${name} started (${randomNum})`)      
      await wait(5)
    }
    
    if(!logSupressedActions.some(name => name == action.name))
      console.log(`${this.fighting.fighter.name} started ${name} (${randomNum})`);

    this.actionInProgress = name  

    if(action.effect)
      action.effect()
    if(sound)
      this.fighting.soundsMade.push({soundName: sound, time: Date.now()})
    if(model)
      this.fighting.modelState = model

    
    return new Promise((resolve, reject) => {
      timeoutRef = setTimeout(resolve, duration)
      this.cancelAction = reject    
    })
    .then(() => {      
      this.actionInProgress = null
      action.afterEffect && action.afterEffect()
      if(!logSupressedActions.some(name => name == action.name))
        console.log(`${this.fighting.fighter.name} finished ${name} (${randomNum})`);
      
      if(cooldown)
        return this.startAction({
          name: 'doing cooldown',
          model: 'Idle',
          getDuration: () => cooldown
        })      
      else       
        setTimeout(() => {
          if(!this.actionInProgress){
            if(!this.fighting.knockedOut && !this.fighting.stopFighting){
              this.fighting.actions.decideAction()
            }
          }
          else{
            if(!logSupressedActions.some(name => name == action.name)){
              console.log(`${this.fighting.fighter.name} did not start a new action after ${name} because ${this.actionInProgress} is in progress (${randomNum})`);
            }
          }          
          this.fighting.checkIfVictorious()
        }, 5)
    })
    .catch(reason => {
      this.actionInProgress = null
      clearTimeout(timeoutRef)

      if(!logSupressedActions.some(name => name == action.name)){
        console.log(`${this.fighting.fighter.name}'s ${name} was cancled because ${reason} (${randomNum})`);
      }
      throw(reason)
    })
  }


}