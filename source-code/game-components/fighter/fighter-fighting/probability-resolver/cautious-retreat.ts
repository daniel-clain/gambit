import { Closeness } from "../../../../types/fighter/closeness"
import FighterFighting from "../fighter-fighting"
import { isEnemyFacingAway, isFacingAwayFromEnemy } from "../proximity"

export const getProbabilityToCautiousRetreat = (
  fighting: FighterFighting,
  generalRetreatProbability: number | null
): number => {
  const { intelligence, strength, speed, aggression } = fighting.stats
  const { proximity, logistics, fighter, movement, timers } = fighting
  const closestEnemy = logistics.closestRememberedEnemy

  if (!closestEnemy || generalRetreatProbability === null) return 0

  const enemyCloseness = proximity.getEnemyCombatCloseness(closestEnemy)
  const enemyStrength = closestEnemy.fighting.stats.strength
  const enemySpeed = closestEnemy.fighting.stats.speed

  const invalid: boolean =
    generalRetreatProbability == null ||
    enemyCloseness >= Closeness["nearby"] ||
    isFacingAwayFromEnemy(closestEnemy, fighter) ||
    isEnemyFacingAway(closestEnemy, fighter) ||
    !logistics.isEnemyAttacking(closestEnemy)

  if (invalid) return 0

  let probability = 0

  probability += generalRetreatProbability

  if (logistics.lowEnergy) {
    probability += 4 + intelligence * 6
  }
  if (logistics.hasLowSpirit) {
    probability += 4 + intelligence * 6
  }
  if (logistics.hasLowStamina) {
    probability += 4 + intelligence * 6
  }

  if (
    timers.isActive("move action") &&
    movement.moveAction == "cautious retreat"
  ) {
    probability += movement.getExponentialMoveFactor(2000)
  }

  if (!logistics.hasRetreatOpportunity(closestEnemy)) {
    probability -= aggression * 2
  }
  if (logistics.enemyJustAttacked(closestEnemy)) {
    probability -= intelligence * 4
    if (closestEnemy.fighting.logistics.lowEnergy) {
      probability -= intelligence * 4
    }
  }

  if (enemyCloseness == Closeness["striking range"]) {
    if (logistics.hasRetreatOpportunity(closestEnemy)) {
      probability -= (speed * 3 - enemySpeed * 3) * (intelligence * 0.5)
      probability += (strength - enemyStrength) * (intelligence * 0.5)
    } else {
      probability -= (speed - enemySpeed) * (intelligence * 0.5)
      probability += (strength * 3 - enemyStrength * 3) * (intelligence * 0.5)
    }
  }
  if (enemyCloseness == Closeness["close"]) {
    if (logistics.hasRetreatOpportunity(closestEnemy)) {
      probability -= (speed * 2 - enemySpeed * 2) * (intelligence * 0.5)
    } else {
      probability += (strength * 2 - enemyStrength * 2) * (intelligence * 0.5)
    }
  }

  if (probability < 0) probability = 0

  return Math.round(probability)
}
