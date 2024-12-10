import { Closeness } from "../../../../types/fighter/closeness"
import FighterFighting from "../fighter-fighting"

export const getProbabilityForGeneralAttack = (
  fighting: FighterFighting
): number | null => {
  const { logistics, movement, actions, stamina, proximity, spirit, timers } =
    fighting
  const { intelligence, speed, aggression, strength, maxStamina, maxSpirit } =
    fighting.stats
  const targetedEnemy =
    fighting.enemyTargetedForAttack ?? logistics.closestRememberedEnemy
  if (!targetedEnemy) return null
  const enemyCloseness = proximity.getEnemyCombatCloseness(targetedEnemy)
  const enemyAction = targetedEnemy.fighting.getCurrentAction()

  let probability = 10
  const instanceLog =
    actions.decideActionProbability.logInstance("general attack")
  const log = (...args: any[]) => {
    instanceLog(...args, "probability", probability)
  }

  probability += aggression * 6
  probability += spirit * 4

  if (!!fighting.enemyTargetedForAttack) {
    probability = +10 + aggression * 2
    if (logistics.onARampage) {
      probability += 10
    }
  }
  if (logistics.onARampage) {
    probability += 10
  } else {
    if (
      timers.isActive("move action") &&
      movement.moveAction == "desperate retreat"
    ) {
      probability -= 200
    }
    if (enemyCloseness == Closeness["striking range"]) {
      if (logistics.justTookHit) {
        probability += aggression * 2
      }
      if (enemyAction == "defend") probability -= intelligence * 6

      log("closestEnemy defending", enemyAction == "defend")

      if (logistics.hasAttackOpportunity(targetedEnemy)) {
        if (logistics.highEnergy) {
          probability += aggression * 2
          if (logistics.hasLowStamina) {
            probability -= intelligence * 4
          } else {
            probability += intelligence * 4
          }
        }
      } else {
        probability -= intelligence * 4
      }

      if (logistics.justBlocked || logistics.justDodged) {
        if (logistics.hasLowStamina) probability -= intelligence * 4
        else probability += intelligence * 4
      }
    }
  }

  if (logistics.timeSinceLastCombat > 5000) {
    probability += (logistics.timeSinceLastCombat / 1000) * 10 - 5
  }
  log("timeSinceLastCombat", logistics.timeSinceLastCombat)

  if (logistics.trapped) {
    probability += 20 + aggression * 2
  } else {
    probability -= (maxStamina - stamina) * 0.5 * intelligence * 4

    if (logistics.hasLowStamina) probability -= intelligence * 4
  }

  if (logistics.lowEnergy) probability -= intelligence * 4

  if (logistics.flanked) {
    logistics.flanked.flankers.forEach((flanker) => {
      probability -=
        intelligence *
        logistics.getEnemyThreatPercentage(flanker) *
        (logistics.isEnemyAttacking(flanker) ? 3 : 1)
    })
  } else if (!logistics.flanked) {
    if (targetedEnemy.fighting.stats.speed > speed)
      probability -= intelligence * 2
    else {
      probability += intelligence * 2
    }
    log("closestEnemy speed bigger", targetedEnemy.fighting.stats.speed > speed)

    if (targetedEnemy.fighting.stats.strength > strength)
      probability -= (maxSpirit - spirit) * 4
    log(
      "closestEnemy strength bigger",
      targetedEnemy.fighting.stats.strength > strength
    )
  }

  log("hasLowStamina", logistics.hasLowStamina)

  if (logistics.hasLowSpirit) {
    probability -= 10
  }

  log("hasLowSpirit", logistics.hasLowSpirit)

  if (logistics.enemyHasLowStamina(targetedEnemy)) {
    probability += intelligence * 2
    probability += aggression * 2
  }
  log("enemyHasLowStamina", logistics.enemyHasLowStamina(targetedEnemy))

  if (logistics.enemyHasLowSpirit(targetedEnemy)) {
    probability += 2 + intelligence
    probability += aggression * 2
  }
  log("enemyHasLowSpirit", logistics.enemyHasLowSpirit(targetedEnemy))

  if (!logistics.hadActionRecently) probability += 5 + aggression * 2

  if (logistics.hasFullStamina) {
    probability += 10
    probability += aggression
  }
  log("hasFullStamina", logistics.hasFullStamina)

  return probability
}
