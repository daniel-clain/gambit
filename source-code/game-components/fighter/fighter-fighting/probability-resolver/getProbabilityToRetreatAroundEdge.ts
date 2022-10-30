import { Closeness } from "../../../../types/fighter/closeness"
import FighterFighting from "../fighter-fighting"
import { getProbabilityForGeneralRetreat } from "./getProbabilityForGeneralRetreat"


  export const getProbabilityToRetreatAroundEdge = (fighting: FighterFighting): number => {

    const { intelligence } = fighting.stats
    const { proximity, logistics, movement} = fighting

    const enemy = proximity.getClosestRememberedEnemy()
    const enemyCloseness = proximity.getEnemyCombatCloseness(enemy)



    const invalid: boolean =      
      logistics.onARampage || 
      !movement.againstEdge ||
      proximity.trapped
      
    
    if (invalid)
      return 0


    let probability = 0

    if(enemyCloseness > Closeness['close']){
      probability -= 20
    }

    probability += getProbabilityForGeneralRetreat(fighting)


    if (movement.moveActionInProgress == 'retreat around edge')
      probability += 400
      if(enemyCloseness > Closeness['close']){
        probability -= 300
      }

    if (probability < 0)
      probability = 0

    return probability
  
  }