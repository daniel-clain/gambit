import { round } from "lodash"
import { Closeness } from "../../../../types/fighter/closeness"
import FighterFighting from "../fighter-fighting"

/* 
  once starts, should continue until specific things influence it
    - should not end prematurely because other probability outweighs it
    - should not persist when its not relevant anymore
    - main goal is to use a burst of energy to get away, then when far enough away recover
      ~ when far enough away, recover probability should be higher than normal
    - runs out of energy, should keep trying to get away, but no longer be fast
    - becareful of loop, if the desperate 
*/

export function getProbabilityToDesperateRetreat(
  fighting: FighterFighting,
  generalRetreatProbability: number
) {
  const { intelligence } = fighting.stats
  const { logistics, proximity, timers, spirit, movement } = fighting
  const enemy = logistics.closestRememberedEnemy
  if (!enemy) return 0
  const enemyCloseness = proximity.getEnemyCombatCloseness(enemy)

  const invalid: boolean =
    generalRetreatProbability == null ||
    enemyCloseness >= Closeness["nearby"] ||
    logistics.lowEnergy ||
    spirit >= 2

  if (invalid) return 0

  let probability = generalRetreatProbability

  if (
    timers.isActive("move action") &&
    movement.moveAction == "desperate retreat"
  ) {
    probability += movement.getExponentialMoveFactor(500)
  }

  probability += 60 - spirit * 20

  if (logistics.hasLowStamina) probability += 6 + intelligence * 4

  if (enemyCloseness == Closeness["striking range"]) {
    if (logistics.hasRetreatOpportunity(enemy)) {
      probability += intelligence
    } else {
      probability -= intelligence * 4
    }
  }
  if (enemyCloseness == Closeness["close"]) {
    if (logistics.hasRetreatOpportunity(enemy)) {
      probability += intelligence * 4
    }
  }

  if (probability < 0) probability = 0

  return round(probability)
}
