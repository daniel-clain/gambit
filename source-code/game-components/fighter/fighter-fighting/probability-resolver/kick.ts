import { round } from "lodash"
import FighterFighting from "../fighter-fighting"
import { isEnemyFacingAway } from "../proximity"

export const getProbabilityToKick = (
  fighting: FighterFighting,
  generalAttackProbability: number | null
): number => {
  const { aggression, intelligence } = fighting.stats
  const { logistics, fighter, proximity } = fighting
  const closestEnemy = logistics.closestRememberedEnemy
  if (!closestEnemy || generalAttackProbability === null) return 0

  const enemyRecovering = closestEnemy.fighting.getCurrentAction() == "recover"

  let probability = 0

  probability += generalAttackProbability

  if (logistics.hasAttackOpportunity(closestEnemy)) {
    if (enemyRecovering) {
      probability += intelligence * 2
    }
    if (isEnemyFacingAway(closestEnemy, fighter)) {
      probability += intelligence * 4
    }

    if (logistics.enemyHasLowStamina(closestEnemy)) {
      probability += intelligence * 4
    }

    if (logistics.enemyHasLowSpirit(closestEnemy)) {
      probability += intelligence * 2
    }
  }

  if (enemyRecovering) {
    probability += 4 + aggression * 2
  }

  if (logistics.enemyHasLowSpirit(closestEnemy)) {
    probability += aggression * 2
  }

  if (probability < 0) probability = 0

  return round(probability, 2)
}
