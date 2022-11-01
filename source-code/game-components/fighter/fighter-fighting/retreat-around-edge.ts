import { getDirectionOfPosition2FromPosition1, getDistanceBetweenTwoPoints, getSmallestAngleBetween2Directions } from "../../../helper-functions/helper-functions";
import Coords from "../../../interfaces/game/fighter/coords";
import { Edge } from "../../../interfaces/game/fighter/edge";
import { Angle } from "../../../types/game/angle";
import { octagon } from "../../fight/octagon";
import Fighter from "../fighter";
import FighterFighting from "./fighter-fighting";
import { getFighterStrikingCenter, isFacingAwayFromEnemy } from "./proximity";

/* 

  - move dir is 
    - along edge is toward point that enemy is furthest from enemy striking

*/

export function getRetreatAroundEdgeDirection(enemy: Fighter, thisFighting: FighterFighting): Angle{
  const {proximity, fighter} = thisFighting

  if(!!proximity.inCornerOfEdges)
    return getRetreatFromCorneredDirection(enemy)
    
  
  const retreatingAlongEdge: Edge  = proximity.getNearestEdge().edgeName

  const directionAlongEdge = getDirectionOfEdgeCornerFurthestAwayFromEnemy(retreatingAlongEdge, enemy)

  
  return directionAlongEdge


  /* functions */

  function getRetreatFromCorneredDirection(enemy: Fighter): Angle{
    const enemyCoords: Coords = getFighterStrikingCenter(enemy, isFacingAwayFromEnemy(enemy, fighter))
    const enemyDistanceFromEdge1: number = octagon.getDistanceFromEdge(proximity.inCornerOfEdges[0], enemyCoords)
    const enemyDistanceFromEdge2: number = octagon.getDistanceFromEdge(proximity.inCornerOfEdges[1], enemyCoords)

    let retreatEdge: Edge
    if(enemyDistanceFromEdge1 > enemyDistanceFromEdge2)
      retreatEdge = proximity.inCornerOfEdges[0]
    else 
      retreatEdge = proximity.inCornerOfEdges[1]

    
    let directionAlongEdge: Angle = getDirectionOfEdgeCornerFurthestAwayFromEnemy(retreatEdge, enemy)


    const enemyDirection = proximity.getDirectionOfEnemyCenterPoint(enemy)


    const isTowardEnemy = proximity.isDirectionWithinDegreesOfDirection(directionAlongEdge, 30, enemyDirection)

    
    if(isTowardEnemy){
      const otherRetreatEdge = retreatEdge == proximity.inCornerOfEdges[0] ? proximity.inCornerOfEdges[1] : proximity.inCornerOfEdges[0]
      
      directionAlongEdge = getDirectionOfEdgeCornerFurthestAwayFromEnemy(otherRetreatEdge, enemy)
      console.log('toward enemy reverse directionAlongEdge :>> ' + otherRetreatEdge, directionAlongEdge);
    }
    console.log(`${fighter.name} cornered retreat along ${retreatEdge}`, directionAlongEdge);


    //console.log(`${proximity.fighting.fighter.name} is CORNERED by ${enemy.name}, retreating along ${retreatEdge} in direction ${directionAlongEdge}`);

    return directionAlongEdge

    
  }

  

  function getDirectionOfEdgeCornerFurthestAwayFromEnemy(edge: Edge, enemy: Fighter): Angle{

    const {point1, point2} = octagon.edges[edge]
    let pointAwayFromCorner
    let corneredPoint

    const distanceFromPoint1 = getDistanceBetweenTwoPoints(enemy.fighting.movement.coords, point1)
    const distanceFromPoint2 = getDistanceBetweenTwoPoints(enemy.fighting.movement.coords, point2)

    if(distanceFromPoint1 < distanceFromPoint2){
      corneredPoint = point1
      pointAwayFromCorner = point2
    }
    else {
      corneredPoint = point2
      pointAwayFromCorner = point1
    }
    
    const directionAlongEdge = getDirectionOfPosition2FromPosition1(corneredPoint, pointAwayFromCorner)
    return directionAlongEdge
  }
}