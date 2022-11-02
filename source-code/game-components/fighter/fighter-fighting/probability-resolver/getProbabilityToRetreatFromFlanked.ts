import FighterFighting from "../fighter-fighting"
import { getProbabilityForGeneralRetreat } from "./getProbabilityForGeneralRetreat"


  export const getProbabilityToRetreatFromFlanked = (fighting: FighterFighting): number => {
    const { proximity, logistics, movement, energy} = fighting
    const { intelligence, aggression } = fighting.stats


    const invalid: boolean =
      !proximity.flanked ||
      logistics.onARampage ||
      proximity.trapped ||
      energy == 0

    if (invalid)
      return 0

    let probability = 0

    if (movement.moveActionInProgress == 'retreat from flanked'){
      probability +=  200
    }
    else if(!logistics.hasFullEnergy){
      return 0
    }

    
    probability += getProbabilityForGeneralRetreat(fighting)

    probability += -40 + intelligence * 6

    probability -= aggression * 2

    if (movement.moveActionInProgress == 'retreat from flanked')
      probability += 300

    probability += proximity.flanked.severityRating * intelligence * 4
    

    if (probability < 0)
      probability = 0

    return probability
  }