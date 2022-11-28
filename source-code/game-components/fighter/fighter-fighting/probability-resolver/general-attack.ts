
import FighterFighting from "../fighter-fighting";
import { isEnemyFacingAway } from "../proximity";

export const getProbabilityForGeneralAttack = (fighting: FighterFighting): number => {
  const { proximity, logistics, fighter, movement, spirit, actions} = fighting
  const { intelligence, speed, aggression, strength } = fighting.stats
  const closestEnemy = logistics.closestRememberedEnemy
  
  let probability = 20
  const instanceLog = actions.decideActionProbability.logInstance('general attack')
  const log = (...args) => {
    instanceLog(...args, 'probability', probability)
  }


  probability += aggression

  if(logistics.onARampage)
    probability += 10
  
  
  if(closestEnemy.fighting.actions.currentInterruptibleAction == 'defend')
    probability -= intelligence * 2

    
  log('closestEnemy defending', closestEnemy.fighting.actions.currentInterruptibleAction == 'defend')
  
  if(logistics.flanked && !logistics.onARampage)
    probability -= intelligence * logistics.getEnemyThreatPercentage(closestEnemy)


  if(logistics.hasAttackOpportunity(closestEnemy)){
    probability += 3 * intelligence
    probability += aggression

    if(closestEnemy.fighting.actions.currentInterruptibleAction == 'recover'){
      probability += intelligence * 2
      probability += aggression
    }
    if (isEnemyFacingAway(closestEnemy, fighter)){
      probability += intelligence * 2
      probability += aggression
    }
  }

  log('hasAttackOpportunity Enemy', logistics.hasAttackOpportunity(closestEnemy))

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

  if (logistics.justBlocked || logistics.justDodged){
    if(logistics.hasLowStamina)
      probability -= intelligence
    else
      probability += intelligence * 4

      
  }
  else if(!logistics.trapped)
    probability -= intelligence * 2

    
  log('justBlocked or Dodged', logistics.justBlocked || logistics.justDodged)
    
  if(logistics.justDidAttack)
    probability += aggression

  log('justDidAttack', logistics.justDidAttack)
    
  if(logistics.justTookHit){
    probability += aggression
  }  

  log('justTookHit', logistics.justTookHit)  

  if(!logistics.flanked){
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

    if (logistics.hasLowStamina)
      probability -= intelligence * 4

    log('hasLowStamina', logistics.hasLowStamina)  

    if (logistics.hasLowSpirit)
      probability -= intelligence * 3

    log('hasLowSpirit', logistics.hasLowSpirit)  
  }



  return probability
  
}