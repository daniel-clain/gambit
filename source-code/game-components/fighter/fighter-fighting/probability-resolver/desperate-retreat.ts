import { round } from "lodash"
import gameConfiguration from "../../../../game-settings/game-configuration"
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
  generalRetreatProbability: number | null
) {
  const { intelligence, aggression } = fighting.stats
  const { logistics, proximity, timers, spirit, movement, stats } = fighting
  const { increasedProbabilityToDesperateRetreat } =
    gameConfiguration.afflictions.hallucinating
  const enemy = logistics.closestRememberedEnemy
  if (!enemy || generalRetreatProbability === null) return 0
  const enemyCloseness = proximity.getEnemyCombatCloseness(enemy)

  const invalid: boolean =
    generalRetreatProbability == null || logistics.lowEnergy

  if (invalid) return 0

  let probability = generalRetreatProbability

  if (logistics.enemyIsOnARampage(enemy)) {
    probability += (stats.maxSpirit - spirit) * 10
  }
  if (logistics.isHallucinating) {
    probability += increasedProbabilityToDesperateRetreat
  }

  if (
    timers.isActive("move action") &&
    movement.moveAction == "desperate retreat"
  ) {
    probability += movement.getExponentialMoveFactor(2000)
  }

  probability += 60 - spirit * 20

  probability -= aggression * 2

  if (logistics.highEnergy) {
    probability += 6
  }

  if (logistics.hasLowStamina) {
    probability += 6 + intelligence * 4

    if (logistics.highEnergy) {
      probability += intelligence * 4
    }

    if (enemyCloseness == Closeness["striking range"]) {
      if (logistics.hasRetreatOpportunity(enemy)) {
        probability += intelligence * 4
      } else {
        probability -= intelligence * 4
      }
    }
    if (enemyCloseness == Closeness["close"]) {
      if (logistics.hasRetreatOpportunity(enemy)) {
        probability += intelligence * 4
      }
    }
  }

  if (probability < 0) probability = 0

  return round(probability, 2)
}
