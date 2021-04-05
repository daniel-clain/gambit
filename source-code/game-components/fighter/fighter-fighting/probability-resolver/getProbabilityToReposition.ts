import FighterFighting from "../fighter-fighting"
import { getProbabilityForGeneralRetreat } from "./getProbabilityForGeneralRetreat"

  export const getProbabilityToReposition = (fighting: FighterFighting): number => {
    const { intelligence } = fighting.stats
    const { proximity, movement, logistics} = fighting
    const closestEnemy = proximity.getClosestRememberedEnemy()
    

    const invalid: boolean = logistics.onARampage
    
    if (invalid)
      return 0

    let probability = 0

    probability += intelligence * 6

    probability += proximity.getNumberOfEnemiesOnSideWithFewestNumberOfEnemies() * intelligence

    probability += Math.round(getProbabilityForGeneralRetreat(fighting) * .5)

    if(proximity.flanked)
      probability += proximity.flanked.criticality * intelligence

    if (
      movement.moveActionInProgress == 'reposition' ||
      logistics.isARetreatInProgress()
    ){
      probability += 500
    }
 
    if(proximity.flanked && proximity.flanked.criticality > 5){
      probability -= (100 + intelligence * 10)
    }

    if(proximity.allEnemiesAreOnOneSide())      
      probability -= (200 + intelligence * 5)


    if (probability < 0)
      probability = 0

    return probability
  }
