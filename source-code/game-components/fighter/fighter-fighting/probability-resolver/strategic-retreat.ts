import { round } from "lodash"
import { Closeness } from "../../../../types/fighter/closeness"
import FighterFighting from "../fighter-fighting"

export function getProbabilityToStrategicRetreat(
  fighting: FighterFighting,
  generalRetreatProbability: number
) {
  const { intelligence } = fighting.stats
  const { logistics, proximity, timers, movement } = fighting
  const enemy = logistics.closestRememberedEnemy
  if (!enemy) return 0
  const enemyCloseness = proximity.getEnemyCombatCloseness(enemy)
  const enemyAttacking = logistics.isEnemyAttacking(enemy)

  const invalid: boolean =
    generalRetreatProbability == null ||
    enemyCloseness == Closeness["striking range"] ||
    (!logistics.flanked && logistics.hasFullStamina)

  if (invalid) return 0

  let probability = generalRetreatProbability

  if (
    timers.isActive("move action") &&
    movement.moveAction == "strategic retreat"
  ) {
    probability += movement.getExponentialMoveFactor(500)
  }

  if (!logistics.hasFullStamina) probability += intelligence * 2

  if (logistics.hasLowStamina) probability += intelligence * 4

  if (enemyAttacking) probability += intelligence * 4

  if (logistics.flanked) probability += intelligence * 4

  if (probability < 0) probability = 0

  return round(probability)
}
