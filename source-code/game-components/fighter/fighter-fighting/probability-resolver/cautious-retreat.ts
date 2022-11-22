
import { Closeness } from "../../../../types/fighter/closeness"
import FighterFighting from "../fighter-fighting"
import { isEnemyFacingAway } from "../proximity"

export const getProbabilityToCautiousRetreat = (fighting: FighterFighting, generalRetreatProbability: number): number => {
  const { intelligence, strength, speed, aggression } = fighting.stats
  const { proximity, logistics, fighter} = fighting
  const closestEnemy = logistics.closestRememberedEnemy

  const enemyCloseness = proximity.getEnemyCombatCloseness(closestEnemy)
  const enemyStrength = closestEnemy.fighting.stats.strength
  const enemySpeed = closestEnemy.fighting.stats.speed 

  const invalid: boolean = (
    enemyCloseness >= Closeness['nearby'] ||
    isEnemyFacingAway(closestEnemy, fighter) || 
    !logistics.isEnemyAttacking(closestEnemy) ||  
    logistics.onARampage ||
    !!proximity.againstEdge
  )


  if (invalid)
    return 0

  let probability = 0
  
  probability += generalRetreatProbability



  if(!logistics.hasRetreatOpportunity(closestEnemy)){
    probability -= aggression * 2
  }

  if (enemyCloseness == Closeness['striking range']) {    
    if(logistics.hasRetreatOpportunity(closestEnemy)){
      probability -= (speed * 3 - enemySpeed * 3) * (intelligence * .5)
      probability += (strength - enemyStrength) * (intelligence * .5)
    }
    else {
      probability -= (speed - enemySpeed) * (intelligence * .5)
      probability += (strength * 3 - enemyStrength * 3) * (intelligence * .5)
    }
  }
  if (enemyCloseness == Closeness['close']) {  
    if(logistics.hasRetreatOpportunity(closestEnemy)){
      probability -= (speed * 2 - enemySpeed * 2) * (intelligence * .5)
    }
    else {
      probability += (strength * 2 - enemyStrength * 2) * (intelligence * .5)
    }  
  }


  if (probability < 0)
    probability = 0

  return probability
}