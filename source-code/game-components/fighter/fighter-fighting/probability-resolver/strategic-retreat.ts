import { Closeness } from "../../../../types/fighter/closeness";
import FighterFighting from "../fighter-fighting";

export function getProbabilityToStrategicRetreat(fighting: FighterFighting, generalRetreatProbability: number){
  const { intelligence } = fighting.stats
  const { logistics, proximity, timers, movement } = fighting
  const enemy = logistics.closestRememberedEnemy
  const enemyCloseness = proximity.getEnemyCombatCloseness(enemy)
  const enemyAttacking = logistics.isEnemyAttacking(enemy)

  const invalid: boolean = (
    generalRetreatProbability == null ||
    logistics.onARampage ||
    enemyCloseness <= Closeness['close'] ||
    (!logistics.flanked && logistics.hasFullStamina)
  )

  if (invalid) return

  let probability = generalRetreatProbability

  
  const moveTimer = timers.get('move action')
  if(moveTimer.active && movement.moveAction == 'strategic retreat'){
    moveTimer.timeElapsed
    probability += movement.getExponentialMoveFactor(500) 
  }
  
  if(!logistics.hasFullStamina)
    probability += intelligence * 2

  if(logistics.hasLowStamina)
    probability += intelligence * 4

  if(enemyAttacking)
    probability += intelligence * 4

  if(logistics.flanked)
    probability += intelligence * 4



  if (probability < 0)
    probability = 0

  return probability
}