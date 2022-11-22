import { Closeness } from "../../../../types/fighter/closeness";
import FighterFighting from "../fighter-fighting";

export function getProbabilityToStrategicRetreat(fighting: FighterFighting, generalAttackProbability: number){
  const { intelligence } = fighting.stats
  const { logistics, proximity, stamina } = fighting
  const enemy = logistics.closestRememberedEnemy
  const enemyCloseness = proximity.getEnemyCombatCloseness(enemy)
  const enemyAttacking = logistics.isEnemyAttacking(enemy)

  const invalid: boolean = (
    logistics.onARampage ||
    (!logistics.flanked && logistics.hasFullStamina)
  )

  if (invalid) return

  let probability = generalAttackProbability
  
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