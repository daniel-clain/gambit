import { round } from "lodash"
import FighterFighting from "../fighter-fighting"
import { isEnemyFacingAway, isFacingAwayFromEnemy } from "../proximity"

export const getProbabilityToDefend = (fighting: FighterFighting): number => {
  const { proximity, logistics, fighter, spirit } = fighting
  const { intelligence, speed, strength, aggression, maxSpirit } =
    fighting.stats
  const closestEnemy = logistics.closestRememberedEnemy
  if (!closestEnemy) return 0
  const enemyCloseness = proximity.getEnemyCombatCloseness(closestEnemy)

  const enemyAction = closestEnemy.fighting.getCurrentAction()

  const invalid: boolean =
    isFacingAwayFromEnemy(closestEnemy, fighter) || logistics.onARampage
  if (invalid) return 0

  let probability = 10

  probability -= aggression * 3

  if (logistics.justBlocked || logistics.justDodged) {
    if (logistics.highEnergy) {
      probability -= intelligence * 2
    }
  } else {
    probability += intelligence * 5
  }

  if (logistics.trapped) {
    probability += 10 + intelligence * 2
  } else {
    if (logistics.hasLowStamina) {
      probability -= intelligence * 4
    }

    if (logistics.hasLowSpirit) {
      probability -= (maxSpirit - spirit) * 4
    } else {
      probability += spirit * 2
    }

    if (closestEnemy.fighting.stats.speed < speed) {
      probability -= intelligence * 2

      if (logistics.hasLowStamina) {
        probability -= intelligence * 2

        if (closestEnemy.fighting.stats.speed < speed - 3) {
          probability -= intelligence * 2
        }
      }
    } else {
      probability += intelligence * 2
      if (closestEnemy.fighting.stats.speed > speed + 3) {
        probability += intelligence * 3
      }
    }
  }

  if (logistics.enemyJustAttacked(closestEnemy)) {
    probability -= intelligence * 4
    if (closestEnemy.fighting.logistics.lowEnergy) {
      probability -= intelligence * 4
    }
  }

  if (isEnemyFacingAway(closestEnemy, fighter)) probability -= intelligence * 8

  if (logistics.isEnemyAttacking(closestEnemy)) probability += intelligence * 4

  if (logistics.hasFullStamina) probability -= intelligence * 4

  if (logistics.enemyIsOnARampage(closestEnemy)) probability + intelligence * 6

  if (logistics.lowEnergy) {
    probability += 5 + intelligence * 6
  }
  if (logistics.highEnergy) {
    probability -= 5 + aggression * 2 + intelligence * 4
  }

  if (closestEnemy.fighting.stats.aggression > 5) {
    if (logistics.justBlocked || logistics.justDodged) {
      probability -= intelligence
      if (closestEnemy.fighting.logistics.lowEnergy) {
        probability -= intelligence * 2
      }
    } else {
      probability += intelligence * 4
    }
  }

  if (closestEnemy.fighting.stats.strength > strength) {
    if (!logistics.hasAttackOpportunity(closestEnemy)) {
      probability += intelligence * 4
    }
  }

  if (logistics.rememberedEnemyBehind === null) {
    probability += intelligence * 2
  } else {
    probability -= intelligence * 4
  }

  if (enemyAction != "punch" && enemyAction != "kick") {
    probability -= intelligence * 2
    if (enemyAction == "recover") probability -= intelligence * 6
  } else probability += intelligence * 4

  if (logistics.flanked) probability -= intelligence * 4

  if (logistics.rememberedEnemyBehind === undefined)
    probability -= intelligence * 4

  if (probability < 0) probability = 0

  return round(probability, 2)
}
