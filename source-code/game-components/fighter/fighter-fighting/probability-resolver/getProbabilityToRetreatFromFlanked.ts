import FighterFighting from "../fighter-fighting"
import { getProbabilityForGeneralRetreat } from "./getProbabilityForGeneralRetreat"


  export const getProbabilityToRetreatFromFlanked = (fighting: FighterFighting): number => {
    const { proximity, logistics, movement} = fighting
    const { intelligence, speed } = fighting.stats


    const invalid: boolean =
      !proximity.flanked ||
      logistics.onARampage ||
      proximity.trapped

    if (invalid)
      return 0

    let probability = 0

    
    probability += getProbabilityForGeneralRetreat(fighting)

    if (movement.moveActionInProgress == 'retreat from flanked')
      probability += 300

    probability += proximity.flanked.severityRating * intelligence * 4
    

    if (probability < 0)
      probability = 0

    return probability
  }