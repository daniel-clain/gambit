import FighterFighting from "./fighter-fighting";
import DecideActionProbability from "./decide-action-probability";
import Fighter from "../fighter";
import { CombatAction, MoveAction, ActionName, AttackResponseAction } from "../../../types/fighter/action-name";
import { wait } from "../../../helper-functions/helper-functions";
import { selectRandomResponseBasedOnProbability } from "./random-based-on-probability";


export default class FighterActions {

  decideActionProbability: DecideActionProbability
  
  constructor(public fighting: FighterFighting){
    this.decideActionProbability = new DecideActionProbability(fighting)
  }

  async decideAction(){  
    
    const { proximity, combat, movement, fighter, logistics, stopFighting, knockedOut} = this.fighting
    const {fight, hallucinating} = fighter.state    

    if(!fight || knockedOut || stopFighting) return
    if(fight.paused) await fight.waitForUnpause()
    
    
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

      
    if(!decidedAction){
      /* console.log(`${fighter.name} had no decided action, wait half a sec then decide again`); */
      wait(500).then(() => this.decideAction())
    }
    else {

      this.fighting.actionLog.unshift(decidedAction)
    
      /* console.log(`${fighter.name}'s decided action was to ${decidedAction}, closestEnemy: ${closestEnemy ? closestEnemy.name : 'none'}`); */

      /* if(decidedAction == 'retreat from flanked'){
        console.log(`${fighter.name} retreat from flanked`, responseProbabilities);
      }*/

      
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
        await wait(5)
        if(logistics.allOtherFightersAreKnockedOut())
          this.fighting.modelState = 'Victory'

        if(!this.fighting.animation.inProgress){
          this.fighting.actions.decideAction()
        }
        else{        
          //console.log(`${this.fighting.fighter.name} did not start a new action after ${decidedAction} because ${this.fighting.animation.inProgress} is in progress`);

        }
      }
      
      catch(reason){
        //console.log(`${fighter.name}' ${decidedAction} was interrupted because ${reason}`);      
      }

      
    }           
  }

  
  
  

  startRecovering(): Promise<void>{
    const {animation, fighter, stats} = this.fighting
    const {sick, injured} = fighter.state
    if(this.fighting.stamina >= stats.maxStamina){
      debugger
    }
    return animation.start({
      name: 'recovering',
      duration: 2500 - stats.fitness * 150 + (sick || injured ? 1000 : 0),
      model: 'Recovering',
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
  }

  doNothing(): Promise<void>{
    const {animation, fighter} = this.fighting
    const {hallucinating} = fighter.state
    return animation.start({
      name: 'doing nothing',
      duration: 1000 + (hallucinating ? 1000 : 0)
    })
  }


};