import { round } from "lodash"
import FighterFighting from "../fighter-fighting"
import { isEnemyFacingAway } from "../proximity"

export const getProbabilityToPunch = (
  fighting: FighterFighting,
  generalAttackProbability: number
): number => {
  const { intelligence, aggression } = fighting.stats
  const { logistics, proximity, fighter } = fighting
  const closestEnemy = logistics.closestRememberedEnemy
  if (!closestEnemy) return 0
  const enemyAction = closestEnemy.fighting.getCurrentAction()

  if (fighter.state.hallucinating) return 1

  let probability = 20

  probability += generalAttackProbability

  if (logistics.hasAttackOpportunity(closestEnemy)) {
    probability += 3 * intelligence
    probability += aggression

    if (enemyAction == "recover") {
      probability += intelligence * 2
      probability += aggression
    }
    if (isEnemyFacingAway(closestEnemy, fighter)) {
      probability += intelligence * 2
      probability += aggression
    }
  }

  if (!logistics.enemyHasLowStamina(closestEnemy))
    probability += 5 + intelligence

  if (
    fighter.state.hallucinating &&
    !proximity.enemyWithinStrikingRange(closestEnemy)
  ) {
    probability *= 0.1
  }

  if (probability < 0) probability = 0

  return round(probability)
}
