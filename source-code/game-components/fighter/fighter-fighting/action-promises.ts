
import { InstantActionName, InterruptAction, InterruptibleActionName, MainActionName, moveActions } from "../../../types/fighter/action-name";
import FighterModelState from "../../../types/fighter/fighter-model-states";
import FighterFighting from "./fighter-fighting";

export type ActionChain = (InterruptibleAction | InstantAction)[]

export type MainAction = {
  name: MainActionName,
  promise: Promise<void | MainAction>
}
export type MainActionProps = {
  name: MainActionName,
  actionChain: ActionChain
}

export type InterruptibleAction = {
  name: InterruptibleActionName,
  start: () => Promise<void>
}
export type InterruptibleActionProps = {
  name: InterruptibleActionName,
  duration: number,
  model?: FighterModelState
}

export type InstantAction = {
  name: InstantActionName,
  start: () => void
}
export type InstantActionProps = {
  name: InstantActionName
  action: () => Promise<void>
}

export type Interrupt = {
  name: InterruptAction
  interruptAction: () => MainAction
}




export class ActionPromises{
  constructor(
    public fighting: FighterFighting
  ){
    this.mainAction = this.mainAction.bind(this)
    this.interruptibleAction = this.interruptibleAction.bind(this)
    this.instantAction = this.instantAction.bind(this)
  }
  /**
   * @description made up of 1 or more sequential promises, if any one of these promises is rejected, then all subsequent promises will not be done. the rejection should provide and interrupt function that should bubble up (or be caught and re thrown) to here. then the catch will return the execution of that interrupt function. things after this promise should always continue, even if its replaced by the interrupt function
   * 
   * @description the decided action should always start 1 interruptible action and have nothing before or after it. only things within the interruptible
   * 
  */
  mainAction({name, actionChain}: MainActionProps): MainAction{
    const {fighter, movement} = this.fighting

    const promise = new Promise<void>(async (res, rej) => {
      console.log(`++O ${name} started (${fighter.name})`);
      try{
        for (const interruptibleAction of actionChain){
          await interruptibleAction.start()
        }
        console.log(`++X ${name} finished (${fighter.name})`)
        res()
      }catch(e: unknown){rej(e)}
    })
    .catch((interrupt?: Interrupt) => {
      if(!(interrupt?.name)){
        console.log(`no interrupt action (main)`);
        return
      }
      console.log(`${name} (main) interrupted by ${interrupt.name} (${fighter.name})`);

      
      if(moveActions.some(x => x == name)){
        console.log(`main move action interrupted, stopping move loop ${fighter.name}`);
        movement.stopMoveLoop(`interrupted by ${interrupt.name}`)
      }

      return interrupt.interruptAction().promise
    })

    return {name, promise}
  }

  interruptibleAction({name, duration, model}: InterruptibleActionProps): InterruptibleAction{
    const {fighter, actions, movement} = this.fighting

    return {
      name,
      start: () => {
        actions.currentInterruptibleAction = name
        if(model){
          this.fighting.modelState = model
        }    
        console.log(`--O ${name} started (${fighter.name})`);

        return new Promise<void>(async (res, rej) => {
          actions.rejectCurrentAction = rej
          setTimeout(res, duration)            
        })
        .then(() => {
          console.log(`--X ${name} finished (${fighter.name})`)
          return
        })
        .catch((interrupt?: Interrupt) => {
          if(!(interrupt?.name)){
            console.log(`no interrupt action (interruptible)`);
            throw 'no interrupt action'
          }
          console.log(`interruptible action ${name} interrupted by ${interrupt.name} (${fighter.name})`);

          throw interrupt
        })
      }
    }
  }


  instantAction({name, action}: InstantActionProps): InstantAction{
    const {fighter} = this.fighting
    return {
      name,
      start(){
        action()
        console.log(`|| ${name} done (${fighter.name})`)
      }
    }
  }
}