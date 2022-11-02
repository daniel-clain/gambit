import FighterFighting from "../fighter-fighting"
import { getRepositionMoveDirection, getSideRepositionSpace } from "../reposition"

  export const getProbabilityToReposition = (fighting: FighterFighting): number => {
    const { intelligence } = fighting.stats
    const { proximity, movement, logistics, fighter} = fighting
    const closestEnemy = proximity.getClosestRememberedEnemy()

    if(logistics.onARampage) return 0


    const repositionDirection = getRepositionMoveDirection(fighter, true)

    let probability = 0

    if(repositionDirection){
      if(movement.moveActionInProgress == 'reposition'){
        probability += 200
      }
      
      probability += -20 + intelligence * 6

    }

    if(!repositionDirection){
      if(movement.moveActionInProgress == 'reposition'){

        if(proximity.directionIsBlockedByEdge(movement.movingDirection))
          return 0

        probability += 100

        const enoughSpaceOnSide = getSideRepositionSpace(fighting)
        if(!enoughSpaceOnSide.leftSpace && !enoughSpaceOnSide.rightSpace){
          probability -= intelligence * 5
        } else {
          probability += intelligence * 5
        }

        if(proximity.enemyWithinStrikingRange(closestEnemy)){
          probability -= intelligence * 10
        } else {
          probability += intelligence * 10
        }
        
        const surrounded = !!proximity.getEnemyOnTheFar('left') && !!proximity.getEnemyOnTheFar('right')
        if(surrounded){
          probability += intelligence * 10
        } else {
          probability -= intelligence * 10
        }
      }
      else return 0
    }

    
    

    if (probability < 0)
      probability = 0

    return probability
  }

