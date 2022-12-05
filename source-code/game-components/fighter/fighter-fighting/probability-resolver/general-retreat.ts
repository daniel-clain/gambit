
import { timer } from "rxjs"
import { Closeness } from "../../../../types/fighter/closeness"

import FighterFighting from "../fighter-fighting"
import { isEnemyFacingAway } from "../proximity"

export const getProbabilityForGeneralRetreat = (fighting: FighterFighting): number => {
  const { fighter, logistics, proximity, actions, movement, timers} = fighting
  const { intelligence, speed, aggression } = fighting.stats
  const closestEnemy = logistics.closestRememberedEnemy


  const invalid: boolean =  (
    logistics.onARampage
  )

  if (invalid)
    return null
  const enemyCloseness = proximity.getEnemyCombatCloseness(closestEnemy)


  let probability = 0


  const instanceLog = actions.decideActionProbability.logInstance('general retreat')
  const log = (...args: unknown[]) => {
    instanceLog(...args, 'probability', probability)
  }

    
  probability -= aggression    

  
  const otherFighters = logistics.otherFightersStillFighting.length
  if (otherFighters == 1){
    probability -= (5 + intelligence)
  }
  log('1 otherFighter', otherFighters == 1)

  if(logistics.isEnemyAttacking(closestEnemy)){
    probability += intelligence * 4
  }
  log('isEnemyAttacking', logistics.isEnemyAttacking(closestEnemy))


  if (logistics.hasLowStamina || logistics.hasLowSpirit)  {
    if(enemyCloseness == Closeness['close'] || enemyCloseness == Closeness['nearby']){

      if (logistics.hasLowStamina) {
        probability += intelligence * 3
        probability -= aggression
      }
        
      if (logistics.hasLowSpirit) {
        probability += intelligence * 2
        probability += aggression
      }
    }
    log('enemy close or nearby', enemyCloseness == Closeness['close'] || enemyCloseness == Closeness['nearby'])


    if(enemyCloseness == Closeness['striking range']){
      probability += 5
      probability -= aggression * 2
      
      if(logistics.hasRetreatOpportunity(closestEnemy)){
        probability += 4 + intelligence
        if (logistics.hasLowStamina) {
          probability += intelligence
          probability -= aggression
        }
        if (logistics.hasLowSpirit) {
          probability += intelligence
          probability += aggression
        }
      }
    }
    log('enemy striking range', enemyCloseness == Closeness['striking range'])

    if(enemyCloseness <= Closeness['close']){
    
      if (logistics.isEnemyAttacking(closestEnemy))
        probability += intelligence * 2

      if (logistics.hasLowStamina) {
        probability -= aggression
        probability += (5 + intelligence * 4)
      }

      if (logistics.hasLowSpirit) {
        probability += (5 + intelligence *4)
      }

      if(logistics.hasRetreatOpportunity(closestEnemy)){
        probability += 10 - aggression * 2
        probability += intelligence * 2
      }
      else {
        if(closestEnemy.fighting.stats.speed > speed)
          probability -= intelligence * 2
        else
          probability += intelligence * 2
        
      }

    }
    if(enemyCloseness >= Closeness['far']){
      if (logistics.hasLowStamina) {
        probability -= (5 + intelligence * 4)
      }

      if (logistics.hasLowSpirit) {
        probability -= (5 + intelligence *4)
      }
    }
    
    log('hasLowStamina || hasLowSpirit', logistics.hasLowStamina || logistics.hasLowSpirit)

  }
  else {
    probability -= aggression
    probability -= 5

    if(!logistics.hasFullStamina){
      probability += intelligence
      probability += 6 - aggression * 2
    }
    log('not FullStamina', !logistics.hasFullStamina)

    if(!logistics.hasFullSpirit){
      probability += intelligence
      probability += 8 - aggression * 3
      log('not Full Spirit', !logistics.hasFullSpirit)
    }
    else{
      probability -= aggression * 3
      log('Full Spirit', logistics.hasFullSpirit)

    }
    
  
    if(proximity.getEnemyCombatCloseness(closestEnemy) >= Closeness['far']){
      probability -= 4 + intelligence + aggression
    }

      
    log('enemy bigger or equal to far', proximity.getEnemyCombatCloseness(closestEnemy) >= Closeness['far'])

    if(proximity.getEnemyCombatCloseness(closestEnemy) <= Closeness['close']){
      if(logistics.hasAttackOpportunity(closestEnemy)){
        probability -= intelligence * 2
        probability -= aggression
      }
    } else {
      if(logistics.hasAttackOpportunity(closestEnemy)){
        probability -= aggression * 2
      }
      else{

      }

    }
    log('hasAttackOpportunity', logistics.hasAttackOpportunity(closestEnemy))

    if (isEnemyFacingAway(closestEnemy, fighter))
      probability -= (5 + intelligence * 4)

    log('isEnemyFacingAway', isEnemyFacingAway(closestEnemy, fighter))
  }

  
  if (logistics.flanked)
    probability -= 4 + intelligence * logistics.getEnemyThreatPercentage(closestEnemy)


  log('flanked', logistics.flanked)


  return probability
}