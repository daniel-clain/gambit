import FighterFighting from "../fighter-fighting"
import { getProbabilityForGeneralRetreat } from "./getProbabilityForGeneralRetreat"


  export const getProbabilityToRetreatAroundEdge = (fighting: FighterFighting): number => {

    const { intelligence } = fighting.stats
    const { proximity, logistics, movement} = fighting


    const invalid: boolean =      
      logistics.onARampage || 
      !proximity.getNearestEdge() ||
      proximity.trapped

    if (invalid)
      return 0

    let probability = 0

    probability += getProbabilityForGeneralRetreat(fighting)


    if (movement.moveActionInProgress == 'retreat around edge')
      probability += 500

    if (probability < 0)
      probability = 0

    return probability
  
  }