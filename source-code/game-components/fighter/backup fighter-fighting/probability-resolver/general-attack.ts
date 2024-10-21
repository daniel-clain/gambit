
import { Closeness } from "../../../../types/fighter/closeness";
import FighterFighting from "../fighter-fighting";
import { isEnemyFacingAway } from "../proximity";

export const getProbabilityForGeneralAttack = (fighting: FighterFighting): number => {
  const { logistics, movement, actions, stamina, proximity, spirit, timers} = fighting
  const { intelligence, speed, aggression, strength, maxStamina, maxSpirit } = fighting.stats
  const closestEnemy = logistics.closestRememberedEnemy
  const enemyCloseness = proximity.getEnemyCombatCloseness(closestEnemy)
  
  let probability = 20
  const instanceLog = actions.decideActionProbability.logInstance('general attack')
  const log = (...args) => {
    instanceLog(...args, 'probability', probability)
  }


  probability += aggression * 4

  if(logistics.onARampage){
    probability += 10
  } 
  else {
    const moveTimer = timers.get('move action')
    if(moveTimer.active && movement.moveAction == 'desperate retreat'){
      probability -= 200
    }
    if(enemyCloseness == Closeness['striking range']){
      if(logistics.justTookHit){
        probability -= intelligence * 2
        probability += aggression * 2
      }
      if(logistics.justDidAttack){
        probability -= intelligence * 2
        probability += aggression * 2
      }

      if(closestEnemy.fighting.actions.currentInterruptibleAction == 'defend')
        probability -= intelligence * 6

      log('closestEnemy defending', closestEnemy.fighting.actions.currentInterruptibleAction == 'defend')


      if(closestEnemy.fighting.logistics.justDidAttack){
        probability += intelligence * 4
      }
      
      if (logistics.justBlocked || logistics.justDodged){
        if(logistics.hasLowStamina)
          probability -= intelligence * 4
        else
          probability += intelligence * 4
          
      }
    }
  }
  Array()

  if(logistics.timeSinceLastCombat > 5000){
    probability += ((logistics.timeSinceLastCombat / 1000) * 10) - 5
  }
  log('timeSinceLastCombat', logistics.timeSinceLastCombat)
  
  if(logistics.trapped){
    probability += 12 + aggression * 2
  }

  if(logistics.lowEnergy)
    probability -= 4 + intelligence



  if(logistics.flanked){
    logistics.flanked.flankers.forEach(flanker => {
      probability -= intelligence * logistics.getEnemyThreatPercentage(flanker) * (logistics.isEnemyAttacking(flanker) ? 3 : 1)
    })
  }
  else if(!logistics.flanked){
    if (closestEnemy.fighting.stats.speed > speed)
      probability -= intelligence
    else{
      probability += 6 + intelligence
      probability += aggression
    }
    log('closestEnemy speed bigger', closestEnemy.fighting.stats.speed > speed)  


    if (closestEnemy.fighting.stats.strength > strength)
      probability -= intelligence
    else{
      probability += 6 + intelligence
      probability += aggression
    }
    log('closestEnemy strength bigger', closestEnemy.fighting.stats.strength > strength)  

  }


  probability -= ((maxStamina - stamina) * .5) * intelligence
  probability -= ((maxSpirit - spirit) * .5) * intelligence


  if (logistics.hasLowStamina)
    probability -= 2 + intelligence * 4

  log('hasLowStamina', logistics.hasLowStamina)  

  if (logistics.hasLowSpirit)
    probability -= 2 + intelligence * 3

  log('hasLowSpirit', logistics.hasLowSpirit)  



  if (logistics.enemyHasLowStamina(closestEnemy)){
    probability += 2 + intelligence * 2
    probability += aggression * 2
  }
  log('enemyHasLowStamina', logistics.enemyHasLowStamina(closestEnemy))

  if (logistics.enemyHasLowSpirit(closestEnemy)){
    probability += 2 + intelligence
    probability += aggression * 2
  }
  log('enemyHasLowSpirit', logistics.enemyHasLowSpirit(closestEnemy))
    
  if (!logistics.hadActionRecently)
    probability += 5 + aggression * 2

  if (logistics.hasFullStamina){
    probability += 4 + intelligence * 2
    probability += aggression
  }
  log('hasFullStamina', logistics.hasFullStamina)




  return probability
  
}