import FighterFighting from "./fighter-fighting";
import DecideActionProbability from "./decide-action-probability";
import Fighter from "../fighter";
import { CombatAction, MoveAction, ActionName, AttackResponseAction } from "../../../types/fighter/action-name";
import { wait } from "../../../helper-functions/helper-functions";
import { selectRandomResponseBasedOnProbability } from "./random-based-on-probability";
import { Interrupt } from "../../../types/game/interrupt";


export default class FighterActions {

  decideActionProbability: DecideActionProbability
  currentActionName: string
  rejectCurrentAction: (interrupt: Interrupt) => void
  
  constructor(public fighting: FighterFighting){
    this.decideActionProbability = new DecideActionProbability(fighting)
  }

  
  actionPromise({isMain, promise, name}: {
    isMain?: boolean, 
    promise: Promise<void>,
    name?: string
  }): Promise<void>{
    const {fighter} = this.fighting
    return new Promise<void>((res, rej) => {
      this.rejectCurrentAction = rej
      //name && console.log(`~~ ${name} started (${fighter.name})`);
      promise.then(res).catch(rej)
    })
    .then(() => {
      //name && console.log(`-- ${name} finished (${fighter.name})`)
    })
    .catch((interrupt: Interrupt) => {
      //name && interrupt.name && console.log(`${name} interrupted by ${interrupt.name} (${fighter.name})`);
      if(!interrupt.promiseFunc){
        console.log(`${this.fighting.fighter.name} action catch no func`);
      }
      if(isMain) return interrupt.promiseFunc()
      else throw interrupt
    })
  }

  decideAction(){  
    
    const { proximity, combat, movement, fighter, logistics, stopFighting, knockedOut, actions} = this.fighting
    const {fight, hallucinating} = fighter.state  
    
    if(!proximity){
      debugger
    }

    if(!fight || knockedOut || stopFighting){
      throw('should not be trying to decide action')
    }
    
    
    let closestEnemy: Fighter = proximity.getClosestRememberedEnemy()


    let enemyWithinStrikingRange = closestEnemy && proximity.enemyWithinStrikingRange(closestEnemy)
    

    const combatActions: CombatAction[] = ['punch', 'critical strike', 'defend']
    const moveActions: MoveAction[] = ['move to attack', 'retreat', 'retreat from flanked', 'fast retreat', 'cautious retreat', 'retreat around edge', 'reposition']
    const otherActions: ActionName[] = ['turn around', 'recover', 'do nothing']


    let decidedAction: ActionName

    const responseProbabilities: [ActionName, number][] = []
    

    if(enemyWithinStrikingRange || (hallucinating && closestEnemy))
      responseProbabilities.push(
        ...combatActions.map(action => 
          this.decideActionProbability.getProbabilityTo(action)
        )
      )

    if(closestEnemy)
      responseProbabilities.push(
        ...moveActions.map(action =>   
          this.decideActionProbability.getProbabilityTo(action)
        )
      )

    responseProbabilities.push(
      ...otherActions.map(action =>   
        this.decideActionProbability.getProbabilityTo(action)
      )
    )
    const totalNum = responseProbabilities.reduce((count, rp) => count + rp[1], 0)
    

    /* console.log(`${fighter.name}'s action probabilities are: ${responseProbabilities.map((rp: [ActionName, number]) => 
      `\n ${rp[0]}: ${Math.round(rp[1]/totalNum*100)}%`
    )}`,responseProbabilities); */

    decidedAction = selectRandomResponseBasedOnProbability(responseProbabilities)    

    if(!proximity){
      debugger
    }

    const {rememberedEnemyBehind} = this.fighting
    const enemyKO = rememberedEnemyBehind?.fighting.knockedOut
      
    if(!decidedAction && (rememberedEnemyBehind && !enemyKO)){
      console.log(proximity);
      console.log(closestEnemy);
      console.log(`${fighter.name} had no decided action, wait half a sec then decide again`, responseProbabilities); 
      debugger
      wait(500).then(() => this.decideAction())
    }
    else {

      this.fighting.actionLog.unshift(decidedAction)
    
      /* console.log(`${fighter.name} decided action  ${decidedAction}`, responseProbabilities); */

      if(decidedAction == 'reposition'){
        //console.log(`${fighter.name} reposition`, responseProbabilities);
      }
      
      const currentAction = (() => {
        switch (decidedAction) {
          case 'punch': 
          case 'critical strike':
            return combat.attackEnemy(closestEnemy, decidedAction)
          case 'defend':
            return combat.startDefending(closestEnemy)
          case 'move to attack': 
          case 'cautious retreat': 
          case 'fast retreat': 
          case 'retreat': 
          case 'retreat from flanked': 
          case 'retreat around edge': 
          case 'reposition': 
            return movement.doMoveAction(closestEnemy, decidedAction)
          case 'recover': 
            return this.startRecovering()
          case 'turn around': 
            return this.actionPromise({
              isMain: true,
              promise: movement.turnAround()
            })        
          case 'do nothing': 
            return this.doNothing()
        }
      })()
      
      currentAction
      .then(() => {
        if(this.fighting.animation.inProgress){            
          console.error(`${fighter.name} completed ${this.currentActionName} while animation is in progress`, this.fighting.animation.inProgress);  
        }

        if(logistics.allOtherFightersAreKnockedOut()){
          this.fighting.modelState = 'Victory'
        }
        else if(fighter.fighting.knockedOut){          
          this.fighting.modelState = 'Knocked Out'          
        }
        else {
          this.decideAction()
        }
      })   
      .catch((reason) => {
        console.log('******* action catch should not be called ',reason);
      }) 
    }
  }

  
  
  

  startRecovering(){
    const {animation, fighter, stats} = this.fighting
    const {sick, injured} = fighter.state
    if(this.fighting.stamina >= stats.maxStamina){
      debugger
    }
    return this.actionPromise({
      isMain: true,
      name: 'recovering',
      promise: animation.start({
        name: 'recovering',
        duration: 2500 - stats.fitness * 150 + (sick || injured ? 1000 : 0),
        model: 'Recovering',
      })
    })
    .then(() => {      
      //console.log(`${fighter.name} just recovered 1 stamina & spirit`);
      this.fighting.timers.cancelTimers(['memory of enemy behind'], 'finished recovering')
      if(this.fighting.stamina < stats.maxStamina)
        this.fighting.stamina++
      else
        this.fighting.stamina = stats.maxStamina
      if(this.fighting.spirit < stats.maxSpirit)
        this.fighting.spirit++
    })
    .catch((interrupt: Interrupt) => interrupt.promiseFunc())
  }

  doNothing(){
    const {animation, fighter} = this.fighting
    const {hallucinating} = fighter.state
    return this.actionPromise({
      isMain: true,
      promise: animation.start({
        name: 'doing nothing',
        duration: 1000 + (hallucinating ? 1000 : 0)
      })
    })
  }


};