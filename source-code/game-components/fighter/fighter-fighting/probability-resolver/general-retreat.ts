import { Closeness } from "../../../../types/fighter/closeness"

import FighterFighting from "../fighter-fighting"
import { isEnemyFacingAway } from "../proximity"

export const getProbabilityForGeneralRetreat = (
  fighting: FighterFighting
): number | null => {
  const { fighter, logistics, proximity, actions, spirit } = fighting
  const { intelligence, speed, aggression, maxSpirit } = fighting.stats
  const closestEnemy = logistics.closestRememberedEnemy

  if (!closestEnemy) return null

  const invalid: boolean = logistics.trapped || logistics.onARampage

  if (invalid) return null
  const enemyCloseness = proximity.getEnemyCombatCloseness(closestEnemy)

  let probability = 0

  const instanceLog =
    actions.decideActionProbability.logInstance("general retreat")
  const log = (...args: unknown[]) => {
    instanceLog(...args, "probability", probability)
  }

  probability -= aggression * 4

  if (logistics.timeSinceLastCombat > 6000) {
    probability -= (logistics.timeSinceLastCombat / 1000) * 10 - 6
  }

  const otherFighters = logistics.otherFightersStillFighting.length
  if (otherFighters == 1) {
    probability -= 50
  }
  log("1 otherFighter", otherFighters == 1)

  if (logistics.isEnemyAttacking(closestEnemy)) {
    probability += intelligence * 2
  }
  log("isEnemyAttacking", logistics.isEnemyAttacking(closestEnemy))

  if (logistics.lowEnergy) {
    probability += intelligence * 2
  }

  if (logistics.hasLowSpirit) {
    probability += 10
  }

  if (logistics.hasLowStamina) {
    probability += intelligence * 3

    if (
      enemyCloseness == Closeness["close"] ||
      enemyCloseness == Closeness["nearby"]
    ) {
      probability += intelligence * 4
    }
    log(
      "enemy close or nearby",
      enemyCloseness == Closeness["close"] ||
        enemyCloseness == Closeness["nearby"]
    )

    if (enemyCloseness == Closeness["striking range"]) {
      if (logistics.hasRetreatOpportunity(closestEnemy)) {
        probability += intelligence * 3

        if (logistics.hasLowSpirit) {
          probability += intelligence * 2
        }
      }
    }
    log("enemy striking range", enemyCloseness == Closeness["striking range"])
  } else {
    if (!logistics.hasFullStamina) {
      probability += intelligence
    }
    log("not FullStamina", !logistics.hasFullStamina)

    probability += (maxSpirit - spirit) * 4
    log("Spirit", spirit)

    if (proximity.getEnemyCombatCloseness(closestEnemy) >= Closeness["far"]) {
      probability -= 4 + intelligence + aggression
    }

    log(
      "enemy bigger or equal to far",
      proximity.getEnemyCombatCloseness(closestEnemy) >= Closeness["far"]
    )

    if (proximity.getEnemyCombatCloseness(closestEnemy) <= Closeness["close"]) {
      if (logistics.hasAttackOpportunity(closestEnemy)) {
        probability -= intelligence * 2
        probability -= aggression
      }
      log("hasAttackOpportunity", logistics.hasAttackOpportunity(closestEnemy))

      if (isEnemyFacingAway(closestEnemy, fighter))
        probability -= 5 + intelligence * 4

      log("isEnemyFacingAway", isEnemyFacingAway(closestEnemy, fighter))
    }
  }

  if (logistics.flanked) {
    logistics.flanked.flankers.forEach((flanker) => {
      probability +=
        intelligence *
        logistics.getEnemyThreatPercentage(flanker) *
        (logistics.isEnemyAttacking(flanker) ? 3 : 1)
    })
  }

  log("flanked", logistics.flanked)

  return probability
}
