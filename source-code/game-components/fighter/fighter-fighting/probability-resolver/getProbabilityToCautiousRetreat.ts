
import { Closeness } from "../../../../types/fighter/closeness"
import FighterFighting from "../fighter-fighting"
import { isEnemyFacingAway } from "../proximity"
import { getProbabilityForGeneralRetreat } from "./getProbabilityForGeneralRetreat"

export const getProbabilityToCautiousRetreat = (fighting: FighterFighting): number => {
  const { intelligence, strength, speed, aggression } = fighting.stats
  const { movement, proximity, logistics, fighter} = fighting
  const closestEnemy = proximity.getClosestRememberedEnemy()

  const invalid: boolean =
    proximity.getEnemyCombatCloseness(closestEnemy) >= Closeness['nearby'] ||
    isEnemyFacingAway(closestEnemy, fighter) || 
    !logistics.isEnemyTargetingThisFighter(closestEnemy) ||
    !!proximity.getNearestEdge() ||       
    logistics.onARampage ||
    logistics.hasFullStamina() ||
    movement.moveActionInProgress == 'reposition'

  if (invalid)
    return 0

  let probability = 0
  
  probability += getProbabilityForGeneralRetreat(fighting)


  const closeness = proximity.getEnemyCombatCloseness(closestEnemy)
  if (closeness == Closeness['striking range']) {
    if (
      logistics.justTookHit ||
      logistics.justBlocked ||
      logistics.justDodged || closestEnemy.fighting.animation.inProgress == 'defending' || closestEnemy.fighting.animation.inProgress == 'recovering'
    ) {
      probability += intelligence
    }
    else
      probability -= intelligence * 2
  }
  
  probability -= speed * 3 - closestEnemy.fighting.stats.speed * 3
  probability += strength * 3 - closestEnemy.fighting.stats.strength * 3
  probability -= aggression * 2

  if (movement.moveActionInProgress == 'cautious retreat')
    probability += 500


  if (proximity.flanked)
    probability -= intelligence * 4

  if (probability < 0)
    probability = 0

  return probability
}