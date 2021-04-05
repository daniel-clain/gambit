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
      probability += 500

    probability += proximity.flanked.criticality * intelligence * 4

    probability += Math.round(proximity.flanked.criticality * (speed * .5))

    if (probability < 0)
      probability = 0

    return probability
  }