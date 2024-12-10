import { round } from "lodash"
import FighterFighting from "../fighter-fighting"
import { isEnemyFacingAway } from "../proximity"

export const getProbabilityToPunch = (
  fighting: FighterFighting,
  generalAttackProbability: number | null
): number => {
  const { intelligence } = fighting.stats
  const { logistics, fighter } = fighting
  const closestEnemy = logistics.closestRememberedEnemy
  if (!closestEnemy || generalAttackProbability === null) return 0

  let probability = 20
  probability += generalAttackProbability

  if (logistics.hasAttackOpportunity(closestEnemy)) {
    if (!logistics.enemyHasLowStamina(closestEnemy)) {
      probability += intelligence * 4
    }

    if (!isEnemyFacingAway(closestEnemy, fighter)) {
      probability += intelligence * 4
    }
  }

  if (probability < 0) probability = 0

  return round(probability, 2)
}
