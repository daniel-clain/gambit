
import { Closeness } from "../../../../types/fighter/closeness"
import FighterFighting from "../fighter-fighting"
import { getProbabilityForGeneralRetreat } from "./getProbabilityForGeneralRetreat"


  export const getProbabilityToFastRetreat = (fighting: FighterFighting): number => {
    const { proximity, logistics, movement, fighter} = fighting
    const { intelligence, speed, aggression } = fighting.stats
    const {hallucinating} = fighter.state
    const closestEnemy = proximity.getClosestRememberedEnemy()
    const closestEnemySpeed = closestEnemy.fighting.stats.speed
    const closestEnemyAnimation = closestEnemy.fighting.animation.inProgress
    
    const invalid: boolean =
      proximity.getEnemyCombatCloseness(closestEnemy) > Closeness['nearby'] ||
      logistics.onARampage ||
      logistics.hasFullStamina() ||
      proximity.trapped

    if (invalid)
      return 0

    let probability = 0

    if(hallucinating){
      probability += 10
    }
    
    probability += getProbabilityForGeneralRetreat(fighting)

    if (movement.moveActionInProgress == 'fast retreat')
      probability += 500

    

    probability += speed * 3 - closestEnemySpeed * 3

    if (proximity.flanked)
      probability -= intelligence * 3


    if (probability < 0)
      probability = 0

    return probability
  }
