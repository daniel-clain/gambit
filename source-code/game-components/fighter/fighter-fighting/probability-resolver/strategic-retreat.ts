import { round } from "lodash"
import { Closeness } from "../../../../types/fighter/closeness"
import FighterFighting from "../fighter-fighting"

export function getProbabilityToStrategicRetreat(
  fighting: FighterFighting,
  generalRetreatProbability: number | null
) {
  const { intelligence } = fighting.stats
  const { logistics, proximity, timers, movement, spirit, stats } = fighting
  const { maxSpirit } = stats
  const enemy = logistics.closestRememberedEnemy
  if (!enemy || generalRetreatProbability === null) return 0
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

  if (enemyCloseness < Closeness["close"]) {
    probability -= intelligence * 2
  }
  if (enemyAttacking) {
    probability -= intelligence * 2
  }

  if (!logistics.hasFullStamina) probability += intelligence * 2

  if (logistics.hasLowStamina) probability += intelligence * 4

  if (logistics.hasLowSpirit) probability += maxSpirit - spirit * 2

  if (logistics.flanked) probability += intelligence * 8

  if (probability < 0) probability = 0

  return round(probability, 2)
}
