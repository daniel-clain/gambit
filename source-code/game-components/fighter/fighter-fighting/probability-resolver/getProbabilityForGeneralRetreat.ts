
import { Closeness } from "../../../../types/fighter/closeness"
import FighterFighting from "../fighter-fighting"
import { isEnemyFacingAway } from "../proximity"

export const getProbabilityForGeneralRetreat = (fighting: FighterFighting): number => {
  const { fighter, logistics, proximity} = fighting
  const { intelligence, speed, aggression } = fighting.stats
  const closestEnemy = proximity.getClosestRememberedEnemy()


  const invalid: boolean =  logistics.onARampage 

  if (invalid)
    return 0

  
  const enemyCloseness = proximity.getEnemyCombatCloseness(closestEnemy)

  let probability = 0

  if (logistics.isARetreatInProgress())
    probability += 100
    
  probability -= aggression    


  if(logistics.enemyIsOnARampage(closestEnemy)){
    probability += 5
    if(closestEnemy.fighting.stats.speed < speed)
      probability += intelligence
    else
      probability -= intelligence
  }


  if (logistics.hasLowStamina() || logistics.hasLowSpirit())  {
    if(enemyCloseness <= Closeness['nearby'] && enemyCloseness > Closeness['striking range']){

      if (logistics.hasLowStamina()) {
        probability += intelligence * 2
      }
        
      if (logistics.hasLowSpirit()) {
        probability += intelligence * 2
      }
    }
    
    if(
      closestEnemy.fighting.animation.inProgress == 'recovering' ||
      closestEnemy.fighting.animation.inProgress == 'doing cooldown'
    ){
      probability += intelligence
      probability -= aggression * 2
    }

    
    if (logistics.isEnemyTargetingThisFighter(closestEnemy))
      probability += intelligence * 2

    if (logistics.hasLowStamina()) {
      probability += speed
      probability -= aggression
      probability += (5 + intelligence * 4)
    }

    if (logistics.hasLowSpirit()) {
      probability += speed
      probability += (5 + intelligence *4)
    }
    
    if (isEnemyFacingAway(closestEnemy, fighter))
      probability += intelligence * 2

  }
  else {
    probability -= aggression
    probability -= 5
    
  
    if(proximity.getEnemyCombatCloseness(closestEnemy) >= Closeness['nearby'])
      probability -= intelligence * 4

    if(
      closestEnemy.fighting.animation.inProgress == 'recovering' ||
      closestEnemy.fighting.animation.inProgress == 'doing cooldown'
    ){
      probability -= intelligence
      probability -= aggression
    }

    if (isEnemyFacingAway(closestEnemy, fighter))
      probability -= (5 + intelligence * 4)

  }


  return probability
}