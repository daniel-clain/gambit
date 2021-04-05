import { LeftOrRight } from "../../../interfaces/game/fighter/left-or-right";
import Coords from "../../../interfaces/game/fighter/coords";
import Fighter from "../fighter";
import { octagon } from "../../fight/new-octagon";
import { getEnemiesInfront, getDirectionOfEnemyStrikingCenter,  getDistanceOfEnemyStrikingCenter, strikingRange } from "./proximity";
import { getDirectionOfPosition2FromPosition1, validateAngle, subtractAngle2FromAngle1, add2Angles } from "../../../helper-functions/helper-functions";
import { Angle } from "../../../types/game/angle";

  export function getRepositionMoveDirection(closestEnemy: Fighter, thisFighter: Fighter): Angle{
    


     const coordOfMiddlePointOfSideWithLeastEnemies: Coords = getCoordOfMiddlePointOfSideWithLeastEnemies()


     return getDirectionOfSideConsideringProximityOfNearestFighter()
     
      

    function getCoordOfMiddlePointOfSideWithLeastEnemies(): Coords{
      const enemiesStillFighting = thisFighter.fighting.logistics.otherFightersStillFighting()
      const enemiesInfront = getEnemiesInfront(enemiesStillFighting, thisFighter)
      const enemiesBehind = enemiesStillFighting.filter(enemy => !enemiesInfront.some(enemyInfront => enemyInfront.name == enemy.name))

      let sideWithTheLeastAmountOfFighters: LeftOrRight
      if(enemiesInfront.length == enemiesBehind.length){
        const enemyX = closestEnemy.fighting.movement.coords.x
        const thisX = thisFighter.fighting.movement.coords.x
        sideWithTheLeastAmountOfFighters =  thisX < enemyX ? 'left' : 'right'
      }
      else{
        sideWithTheLeastAmountOfFighters = 
        thisFighter.fighting.facingDirection == 'left' ?
        enemiesInfront.length < enemiesBehind.length ? 'left' : 'right'
        :
        enemiesInfront.length < enemiesBehind.length ? 'right' : 'left'
      }
        

      


      const side = octagon.edges[sideWithTheLeastAmountOfFighters]
      
      const middleOfSideY = 
        side.point1.y > side.point2.y ? 
          side.point1.y - (side.point1.y - side.point2.y) / 2 : 
          side.point2.y - (side.point2.y - side.point1.y) / 2
      
      const middleOfSideX = 
        side.point1.x > side.point2.x ? 
          side.point1.x - (side.point1.x - side.point2.x) / 2 : 
          side.point1.x - (side.point1.x - side.point1.x) / 2

      return {x: middleOfSideX, y: middleOfSideY}      
    }


    function getDirectionOfSideConsideringProximityOfNearestFighter(): Angle{

      
      const enemyDistanceAway: number = getDistanceOfEnemyStrikingCenter(closestEnemy, thisFighter)
      
      const directionAwayFromEnemy: Angle = getDirectionOfEnemyStrikingCenter(closestEnemy, thisFighter, true)  

      const directionTowardSide = getDirectionOfPosition2FromPosition1(thisFighter.fighting.movement.coords, coordOfMiddlePointOfSideWithLeastEnemies)

      let directionToSideRelativeToEnemy: Angle


      if(enemyDistanceAway < strikingRange + 10)
        return directionAwayFromEnemy
        
      if(enemyDistanceAway > strikingRange + 70)
        return directionTowardSide

        
      if(directionAwayFromEnemy == directionTowardSide)
        return directionTowardSide

        
      const enemyFighterClosenessInfluenceRating = (strikingRange + 70 - enemyDistanceAway)/100

      let smallestAngleBetween: Angle
      let angleCrosses0: boolean

        
      const {biggest, smallest} = directionAwayFromEnemy > directionTowardSide ? {biggest: directionAwayFromEnemy, smallest: directionTowardSide} : { biggest: directionTowardSide, smallest: directionAwayFromEnemy}
      
      if(biggest - smallest > 180){
        smallestAngleBetween = 360 - biggest + smallest
        angleCrosses0 = true
      }
      else
        smallestAngleBetween = biggest - smallest

      const diffAngleWeightedByFighterCloseness: Angle = validateAngle(Math.round(smallestAngleBetween * enemyFighterClosenessInfluenceRating))


      if(directionTowardSide > directionAwayFromEnemy){
        if(angleCrosses0){
          const addedAngleToDirectionTowardSide = add2Angles(directionTowardSide, diffAngleWeightedByFighterCloseness)
          
          directionToSideRelativeToEnemy = addedAngleToDirectionTowardSide
        }
        else{
          const subtractedAngleFromDirectionTowardSide = subtractAngle2FromAngle1(directionTowardSide, diffAngleWeightedByFighterCloseness)
          
          directionToSideRelativeToEnemy = subtractedAngleFromDirectionTowardSide
        }
      }

      
      if(directionAwayFromEnemy > directionTowardSide){
        
        if(angleCrosses0){
          const subtractedAngleFromDirectionTowardSide = subtractAngle2FromAngle1(directionTowardSide, diffAngleWeightedByFighterCloseness)
          
          directionToSideRelativeToEnemy = subtractedAngleFromDirectionTowardSide

        }
        else{
          const addedAngleToDirectionTowardSide = add2Angles(directionTowardSide, diffAngleWeightedByFighterCloseness)
          
          directionToSideRelativeToEnemy = addedAngleToDirectionTowardSide

        }
      }


      if(isNaN(directionToSideRelativeToEnemy))
        debugger


      return directionToSideRelativeToEnemy
    }

  }
