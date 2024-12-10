import { round } from "lodash"
import { Closeness } from "../../../../types/fighter/closeness"
import FighterFighting from "../fighter-fighting"

export const getProbabilityToDoNothing = (
  fighting: FighterFighting
): number => {
  const { logistics, proximity, fighter } = fighting
  const { aggression, intelligence } = fighting.stats
  const { takingADive, hallucinating } = fighter.state

  const enemyInFront = logistics.closestEnemyInFront
  const inFrontCloseness = enemyInFront
    ? proximity.getEnemyCombatCloseness(enemyInFront)
    : undefined

  const enemyBehind = fighting.logistics.rememberedEnemyBehind

  const enemiesStillFighting: number =
    logistics.otherFightersStillFighting.length

  if (logistics.onARampage) return 0

  let probability = 20

  probability -= aggression * 3

  if (takingADive) {
    probability += 20
  } else {
    if (
      enemyBehind === null &&
      enemiesStillFighting > 1 &&
      logistics.hasFullStamina &&
      enemyInFront &&
      inFrontCloseness
    ) {
      if (inFrontCloseness > Closeness["close"]) {
        probability += intelligence * 3
      } else if (logistics.hasAttackOpportunity(enemyInFront)) {
        probability -= intelligence * 3
      }
    } else {
      probability -= intelligence * 3
    }
  }

  if (probability < 0) probability = 0

  return round(probability, 2)
}
