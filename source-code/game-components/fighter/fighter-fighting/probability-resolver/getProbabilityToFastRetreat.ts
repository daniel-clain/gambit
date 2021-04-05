import { Closeness } from "../../../../types/figher/closeness"
import FighterFighting from "../fighter-fighting"
import { getProbabilityForGeneralRetreat } from "./getProbabilityForGeneralRetreat"


  export const getProbabilityToFastRetreat = (fighting: FighterFighting): number => {
    const { proximity, logistics, movement} = fighting
    const { intelligence, speed, aggression } = fighting.stats
    const closestEnemy = proximity.getClosestRememberedEnemy()

    const invalid: boolean =
      proximity.getEnemyCombatCloseness(closestEnemy) > Closeness['nearby'] ||
      logistics.onARampage ||
      logistics.hasFullStamina() ||
      proximity.trapped

    if (invalid)
      return 0

    let probability = 0

    
    probability += getProbabilityForGeneralRetreat(fighting)

    if (movement.moveActionInProgress == 'fast retreat')
      probability += 500

    const closeness = proximity.getEnemyCombatCloseness(closestEnemy)
    if (closeness == Closeness['striking range']) {
      if (
        logistics.justTookHit ||
        logistics.justBlocked ||
        logistics.justDodged || closestEnemy.fighting.animation.inProgress == 'defending' || closestEnemy.fighting.animation.inProgress == 'recovering'
      ) {
        probability += speed * 2
        probability += intelligence * 2
      }
      else
        probability -= intelligence * 4
    }
    

    probability += speed * 3 - closestEnemy.fighting.stats.speed * 3

    if (proximity.flanked)
      probability -= intelligence * 3


    if (probability < 0)
      probability = 0

    return probability
  }
