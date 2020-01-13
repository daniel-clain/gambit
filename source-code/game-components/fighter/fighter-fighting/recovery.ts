import FighterFighting from "./fighter-fighting";
import Fighter from "../fighter";
import { random } from "../../../helper-functions/helper-functions";
import Direction360 from "../../../types/figher/direction-360";

export default class Recovery {
  constructor(private fighting: FighterFighting){}
  
  
  retreatFromFlanked(){
    const {actions, timers, proximity, movement, activeTimers, combat, flanking} = this.fighting
    
    this.fighting.cancelTimers(['moving to attack', 'doing cautious retreat', 'retreating', 'doing fast retreat'], 'started doing retreat from flanked')
    
    delete combat.enemyTargetedForAttack
    
    if(!activeTimers.some(timer => timer.name =='retreating from flanked'))
      this.fighting.startTimer(timers.doingRetreatFromFlanked)

    movement.movingDirection = flanking.getRetreatFromFlankedDirection()
    
    if(this.fighting.actions.actionInProgress != 'turning around')
    this.fighting.actions.startAction(actions.moveABit)
    .catch(reason => reason)
  }
  

  doCautiousRetreat(enemy: Fighter){
    const {actions, timers, proximity, movement, activeTimers, combat} = this.fighting
    
    
    this.fighting.cancelTimers(['moving to attack', 'doing fast retreat', 'retreating', 'retreating from flanked'], 'started doing cautious retreat')
    
    delete combat.enemyTargetedForAttack

    if(!activeTimers.some(timer => timer.name =='doing cautious retreat'))
      this.fighting.startTimer(timers.doingCautiousRetreat)
      

    movement.movingDirection = proximity.getDirectionOfFighter(enemy, true)
    
    if(this.fighting.actions.actionInProgress != 'turning around')
      this.fighting.actions.startAction(actions.moveABit)
      .catch(reason => reason)
  }

  doFastRetreat(enemy: Fighter){
    const {actions, timers, proximity, movement, activeTimers, combat} = this.fighting

    this.fighting.cancelTimers(['moving to attack', 'doing cautious retreat', 'retreating', 'retreating from flanked'], 'started doing fast retreat')

    delete combat.enemyTargetedForAttack

    if(!activeTimers.some(timer => timer.name == 'doing fast retreat'))
      this.fighting.startTimer(timers.doingFastRetreat)

    movement.movingDirection = proximity.getDirectionOfFighter(enemy, true)
    if(this.fighting.actions.actionInProgress != 'turning around')
      this.fighting.actions.startAction(actions.moveABit)
      .catch(reason => reason)
  }

  retreatFromEnemy(enemy: Fighter){
    const {actions, timers, proximity, movement, activeTimers, combat} = this.fighting
    
    this.fighting.cancelTimers(['moving to attack', 'doing cautious retreat', 'doing fast retreat', 'retreating from flanked'], 'started retreating')

    delete combat.enemyTargetedForAttack

    if(!activeTimers.some(timer => timer.name == 'retreating'))
      this.fighting.startTimer(timers.retreating)

    movement.movingDirection = proximity.getDirectionOfFighter(enemy, true)
    if(this.fighting.actions.actionInProgress != 'turning around')
      this.fighting.actions.startAction(actions.moveABit)
      .catch(reason => reason)
  }  

  

  checkFlank(){
    const {turnAround} = this.fighting.actions
    this.fighting.actions.startAction(turnAround)
    .catch(reason => reason)
  }
  
  wanderAround(){
    const {activeTimers, movement, timers, actions} = this.fighting
    
    this.fighting.cancelTimers(['moving to attack', 'doing cautious retreat', 'doing fast retreat', 'retreating from flanked', 'retreating'], 'started wandering direction')
      if(!activeTimers.find(timer => timer.name == 'wandering direction')){  
        if (movement.nearEdge) {
          movement.movingDirection = movement.getDirectionAwayFromEdge()
        }
        else {
          movement.movingDirection = random(359) as Direction360
        }
        this.fighting.startTimer(timers.wanderingDirection)
      }
      
      if(this.fighting.actions.actionInProgress != 'turning around')
        this.fighting.actions.startAction(actions.moveABit)
        .catch(reason => reason)
  }

  startRecovering(){
    const {recover} = this.fighting.actions
    
    if(this.fighting.stamina >= this.fighting.stats.maxStamina)
      debugger
    this.fighting.actions.startAction(recover)
    .catch(reason => reason)
  }

  
};
