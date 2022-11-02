import FighterFighting from "./fighter-fighting";
import DecideActionProbability from "./decide-action-probability";
import Fighter from "../fighter";
import { CombatAction, MoveAction, ActionName, AttackResponseAction } from "../../../types/fighter/action-name";
import { wait } from "../../../helper-functions/helper-functions";
import { ActionProbability, selectRandomResponseBasedOnProbability } from "./random-based-on-probability";
import { Interrupt } from "../../../types/game/interrupt";


export default class FighterActions {

  decideActionProbability: DecideActionProbability
  rejectCurrentAction: (interrupt: Interrupt) => void
  decidedActionLog = []
  decidedAction: ActionName
  
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
        console.log(`${this.fighting.fighter.name} action catch no func`, interrupt);
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

    const responseProbabilities: ActionProbability[] = []
    
    const includeCombatActions = enemyWithinStrikingRange || (hallucinating && closestEnemy)

    const includeMoveActions = closestEnemy

    if(includeCombatActions && includeMoveActions){
      this.decideActionProbability.setGeneralAttackAndRetreatProbabilities()
    }

    if(includeCombatActions)
      responseProbabilities.push(
        ...combatActions.map(action => 
          this.decideActionProbability.getProbabilityTo(action)
        )
      )

    if(includeMoveActions)
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

    const decidedAction = selectRandomResponseBasedOnProbability(responseProbabilities)    


    const {rememberedEnemyBehind} = this.fighting
    const enemyKO = rememberedEnemyBehind?.fighting.knockedOut
    this.decidedActionLog.unshift([decidedAction, responseProbabilities])
    if(!decidedAction){
      console.log(`${fighter.name} had no decided action, wait half a sec then decide again`, responseProbabilities); 
      if(rememberedEnemyBehind && !enemyKO){
        console.log(proximity);
        console.log(closestEnemy);
        debugger
        wait(500).then(() => this.decideAction())
      }
    }
    else {

    
      /* console.log(`${fighter.name} decided action  ${decidedAction}`, responseProbabilities); */

      if(decidedAction == 'fast retreat'){
        console.log(`${fighter.name} Fast Retreat`, responseProbabilities);
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

      if(!currentAction){
        console.log(`${fighter.name} had no decided action, wait half a sec then decide again`, responseProbabilities); 

      }
      
      currentAction
      .then(() => {

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

      this.decidedAction = decidedAction
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

      if(this.fighting.spirit < stats.maxSpirit)
        this.fighting.spirit++

      this.fighting.regenEnergy()
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