
import { randomNumber } from "../../../../helper-functions/helper-functions"
import { Closeness } from "../../../../types/fighter/closeness"
import FighterFighting from "../fighter-fighting"
import { getProbabilityForGeneralRetreat } from "./getProbabilityForGeneralRetreat"


  export const getProbabilityToFastRetreat = (fighting: FighterFighting): number => {
    const { proximity, logistics, movement, fighter, energy} = fighting
    const { intelligence} = fighting.stats
    const {hallucinating} = fighter.state
    const closestEnemy = proximity.getClosestRememberedEnemy()
    
    const invalid: boolean =
      logistics.onARampage ||
      !logistics.hasLowStamina() ||
      proximity.trapped ||
      !!proximity.againstEdge ||
      energy == 0

    if (invalid)
      return 0

    let probability = 0

    if (movement.moveActionInProgress == 'fast retreat'){
      probability +=  200
    }
    else if(!logistics.hasFullEnergy){
      return 0
    }
    


    if(hallucinating && randomNumber({to: 3}) == 3)
      probability += 40

    probability += getProbabilityForGeneralRetreat(fighting)

    if(logistics.hasLowSpirit())
      probability += 10

    if(logistics.enemyIsOnARampage(closestEnemy))
      probability += 10

    if(logistics.isEnemyTargetingThisFighter(closestEnemy)){
      probability += 10

    if(proximity.getEnemyCombatCloseness(closestEnemy) == Closeness['striking range']){      
      if(logistics.hasRetreatOpportunity(closestEnemy))
        probability += intelligence * 6
      } else {        
        probability -= intelligence * 2
      }
    }
    else if(logistics.hasRetreatOpportunity(closestEnemy))
      probability += intelligence * 2

      
    if(proximity.getEnemyCombatCloseness(closestEnemy) >= Closeness['near'])
      probability -= 40

      
      
    if(proximity.getEnemyCombatCloseness(closestEnemy) >= Closeness['near'])
    probability -= 40



    

    if (proximity.flanked)
      probability -= 6 + (intelligence * proximity.flanked.severityRating)


    if (probability < 0)
      probability = 0

    return probability
  }
