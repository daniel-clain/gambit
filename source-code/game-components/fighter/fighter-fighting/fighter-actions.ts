import FighterFighting from "./fighter-fighting";
import DecideActionProbability from "./decide-action-probability";
import Fighter from "../fighter";
import { CombatAction, MoveAction, ActionName, AttackResponseAction } from "../../../types/fighter/action-name";
import { wait } from "../../../helper-functions/helper-functions";
import { selectRandomResponseBasedOnProbability } from "./random-based-on-probability";

/* const globalWindow: any = window
globalWindow.debugFighterName = 'doink' */

export default class FighterActions {

  decideActionProbability: DecideActionProbability
  
  constructor(public fighting: FighterFighting){
    this.decideActionProbability = new DecideActionProbability(fighting)
  }

  async decideAction(){  
    
    const { proximity, combat, movement, fighter, logistics, stopFighting, knockedOut} = this.fighting
    const {fight} = fighter.state

    if(fight.paused)
      await fight.waitForUnpause()

    if(knockedOut || stopFighting){
      //console.log(`${fighter.name} did not decide an action`);
      return
    }
    
    /* if(globalWindow && globalWindow.debugFighterName == fighter.name){
      if(this.fighting.stamina < 2)
        console.log(`debug break point for ${fighter.name}`);
      
    } */
    
    
    let closestEnemy: Fighter = proximity.getClosestRememberedEnemy()


    let enemyWithinStrikingRange = closestEnemy && proximity.enemyWithinStrikingRange(closestEnemy)
    

    const combatActions: CombatAction[] = ['punch', 'critical strike', 'defend']
    const moveActions: MoveAction[] = ['move to attack', 'retreat', 'retreat from flanked', 'fast retreat', 'cautious retreat', 'retreat around edge', 'reposition']
    const otherActions: ActionName[] = ['turn around', 'recover', 'do nothing']


    let decidedAction: ActionName

    const responseProbabilities: [ActionName, number][] = []
    

    if(enemyWithinStrikingRange)
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

    
    /* if(this.fighting.proximity.flanked)
      console.log(fighter.name + ' flanked'); */
      
    if(!decidedAction){
      //console.log(`${fighter.name} had no decided action, wait half a sec then decide again`);
      wait(500).then(() => this.decideAction())
    }
    else {
    
      //console.log(`${fighter.name}'s decided action was to ${decidedAction}, closestEnemy: ${closestEnemy ? closestEnemy.name : 'none'}`);

      try{
        switch (decidedAction) {
          case 'punch':
          case 'critical strike':
            await  combat.attackEnemy(closestEnemy, decidedAction); break
          case 'defend':
            await combat.startDefending(closestEnemy); break
          case 'move to attack':
          case 'cautious retreat':
          case 'fast retreat':
          case 'retreat':        
          case 'retreat from flanked':
          case 'retreat around edge':
          case 'reposition': 
            await  movement.doMoveAction(closestEnemy, decidedAction); break
          case 'recover':
            await this.startRecovering(); break
          case 'turn around':
            await movement.turnAround(); break
          case 'do nothing':
            await this.doNothing(); break
        }
      }
      catch(reason){
        if(reason == "TypeError: Cannot read property 'fighting' of undefined")
          debugger
        //console.log(`${fighter.name}' ${decidedAction} was interrupted because ${reason}`);      
      }

      await wait(5)
      if(logistics.allOtherFightersAreKnockedOut())
        this.fighting.modelState = 'Victory'

      if(!this.fighting.animation.inProgress){
        this.fighting.actions.decideAction()
      }
      else{        
        if(this.fighting.animation.inProgress == null)
          debugger
        if(!this.fighting.fighter.name)
          debugger
        //console.log(`${this.fighting.fighter.name} did not start a new action after ${decidedAction} because ${this.fighting.animation.inProgress} is in progress`);

      }
    }           
  }

  
  
  

  startRecovering(): Promise<void>{
    const {animation, fighter, stats} = this.fighting
    return animation.start({
      name: 'recovering',
      duration: 2500 - stats.fitness * 50,
      model: 'Recovering',
    })
    .then(() => {      
      //console.log(`${fighter.name} just recovered 1 stamina & spirit`);
      if(this.fighting.stamina < stats.maxStamina)
        this.fighting.stamina++
      else
        this.fighting.stamina = stats.maxStamina
      if(this.fighting.spirit < stats.maxSpirit)
        this.fighting.spirit++
    })
  }

  doNothing(): Promise<void>{
    const {animation, fighter} = this.fighting
    return animation.start({
      name: 'doing nothing',
      duration: 1000
    })
  }


};