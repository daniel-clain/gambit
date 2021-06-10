
import { Closeness } from "../../../../types/fighter/closeness"
import FighterFighting from "../fighter-fighting"
import { getEnemiesInfront } from "../proximity"

export const getProbabilityToCheckFlank = (fighting: FighterFighting): number => {

  const { intelligence } = fighting.stats
  const { proximity, logistics, rememberedEnemyBehind, fighter, otherFightersInFight} = fighting
  const closestEnemy = proximity.getClosestRememberedEnemy()

  const enemiesInfront: number = getEnemiesInfront(otherFightersInFight, fighter).length
  const enemiesStillFighting: number = logistics.otherFightersStillFighting().length


  const invalid: boolean =
    logistics.hasJustTurnedAround() || (logistics.otherFightersStillFighting().length == 1 && !!proximity.getClosestEnemyInfront())

  if (invalid)
    return 0

  let probability = 1

  if (enemiesInfront == enemiesStillFighting)
    probability -= intelligence * 3
  else if (rememberedEnemyBehind === undefined)
    probability += intelligence * 5


  if (closestEnemy) {

    const closeness = proximity.getEnemyCombatCloseness(closestEnemy)
    if (closeness == Closeness['striking range']) {
      if (logistics.hasRetreatOpportunity(closestEnemy))
        probability += intelligence * 2
      else
        probability -= intelligence * 2
    }
  }


  if (probability < 0)
    probability = 0

  return probability
}