import Coords from "../../../interfaces/game/fighter/coords";
import { Closeness } from "../../../types/fighter/closeness";
import { EdgeDistance, Edge } from "../../../types/fighter/edge";
import { Angle } from "../../../types/game/angle";
import { Percent, toPercent } from "../../../types/game/percent";
import { octagon } from "../../fight/octagon";
import Fighter from "../fighter";
import FighterFighting from "./fighter-fighting";
import { getSmallestAngleBetween2Directions, add2Angles, toAngle, directionWithinDegreesOfDirection, getDirectionOfPosition2FromPosition1, getDistanceFromEdge, getDistanceBetweenTwoPoints, subtractAngle2FromAngle1, closeRange, strikingRange, getOppositeDirection } from "./proximity";

export const maxNearEdgeDistance = closeRange
export const maxAgainstEdgeDistance = strikingRange

export const fighterRetreatImplementation = (fighting: FighterFighting) => {
  const {logistics, proximity, movement} = fighting


  function getIsAgainstEdge(): boolean{
    return !!proximity.getClosestEdge(maxAgainstEdgeDistance)
  }
  
  function getDirectionAlongEdgePastFlanker(): Angle{
    const isInCorner = getIsInCorner()

    const [flanker1Data, flanker2Data] = logistics.flanked.flankers.map(flanker => {
      const threatLevel = logistics.getEnemyThreatPercentage(flanker)
      const directionFromFighter = getDirectionAwayFromEnemy(flanker)
      const directionAlongEdge = (
        isInCorner ?
          getCorneredDirectionAlongEdgeAwayFromEnemy(flanker) :
          getDirectionAlongEdgeAwayFromEnemy(flanker)
      )
      return {directionAlongEdge, threatLevel, directionFromFighter, flanker}
    })

    const directionFromFlanker1Blocked = enemyBlockingDirection(flanker2Data.flanker, flanker1Data.directionAlongEdge)
    const directionFromFlanker2Blocked = enemyBlockingDirection(flanker1Data.flanker, flanker2Data.directionAlongEdge)

    if(directionFromFlanker1Blocked && directionFromFlanker2Blocked)
      return

    if(directionFromFlanker1Blocked)
      return flanker2Data.directionAlongEdge
      
    if(directionFromFlanker2Blocked)
      return flanker1Data.directionAlongEdge
    
    return flanker1Data.threatLevel > flanker2Data.threatLevel ? flanker2Data.directionAlongEdge : flanker1Data.directionAlongEdge

  }

  function getFlankerThreatInfluence(): [Percent, Percent]{
    const {flankers} = logistics.flanked

    const [flanker1Threat, flanker2Threat] = flankers.map(logistics.getEnemyThreatPercentage.bind(logistics))
    const totalThreatValue = flanker1Threat + flanker2Threat
    
    const [flanker1Influence, flanker2Influence] = [flanker1Threat, flanker2Threat].map(t => toPercent(t/totalThreatValue))
    return [flanker1Influence, flanker2Influence]
  }


  function getDirectionBetweenFlankers(): Angle{
    const {flankers} = logistics.flanked
    
    const [directionOfFlanker1, directionOfFlanker2] = flankers.map(f => proximity.getDirectionOfEnemyCenterPoint(f))

    const [flanker1Influence, flanker2Influence] = getFlankerThreatInfluence()

    const influencedDirection = getDirectionBetweenBasedOnInfluence(
      directionOfFlanker1,
      flanker1Influence,
      directionOfFlanker2,
      flanker2Influence,
      'repulse'
    )
    return influencedDirection
  }

  function getDirectionFromFlanked(){
    const {flankers} = logistics.flanked
    
    const [directionFromFlanker1, directionFromFlanker2] = flankers.map(getDirectionAwayFromEnemy)

    const [flanker1Influence, flanker2Influence] = getFlankerThreatInfluence()

    const influencedDirection = getDirectionBetweenBasedOnInfluence(
      directionFromFlanker1,
      flanker1Influence,
      directionFromFlanker2,
      flanker2Influence,
      'attract'
    )
    return influencedDirection
  }

  function getNearEdgeInDirection(retreatDirection: Angle): Edge | undefined{
    const nearEdges = proximity.getEdges(maxNearEdgeDistance)
    const edgeInDirection = nearEdges.find(({edge}) => {
      const edgeCoords = octagon.getClosestCoordsOnAnEdgeFromAPoint(edge, movement.coords)
      const directionOfEdge =  getDirectionOfPosition2FromPosition1(movement.coords, edgeCoords)
      const directionTowardEdge = directionWithinDegreesOfDirection(retreatDirection, 45, directionOfEdge)
      return directionTowardEdge
    }
    )?.edge
    return edgeInDirection
  }

  function getDirectionInfluencedByNearEdge(initialDirection: Angle, nearEdgeInDirection: Edge){

    const distanceFromEdge = getDistanceFromEdge(nearEdgeInDirection, fighting)
    if(distanceFromEdge < 0 || distanceFromEdge > maxNearEdgeDistance){
      throw 'invalid distance'
    }

    const directionOfCorner = getDirectionOfEdgeCornerClosestToDirection(nearEdgeInDirection, initialDirection)
    
    const percentageDistanceToEdge = toPercent(distanceFromEdge/maxNearEdgeDistance)

    const edgeInfluence = percentageDistanceToEdge
    const initialDirectionInfluence = toPercent(1-percentageDistanceToEdge)

    return getDirectionBetweenBasedOnInfluence(
      directionOfCorner,
      edgeInfluence,
      initialDirection,
      initialDirectionInfluence,
      'attract'
    )
  }

  function getDirectionAwayFromEnemy(enemy: Fighter): Angle{
    return proximity.getDirectionOfEnemyCenterPoint(enemy, true)
  }

  function getDirectionAlongEdgeAwayFromEnemy(enemy: Fighter): Angle{
    if(getIsInCorner()){
      return getCorneredDirectionAlongEdgeAwayFromEnemy(enemy)
    }
    else {
      const directionAwayFromEnemy = getDirectionAwayFromEnemy(enemy)
      const {edge} = proximity.getClosestEdge(maxAgainstEdgeDistance)
      return getDirectionAlongEdgeClosestToDirection(edge, directionAwayFromEnemy)

    }

    
    function getDirectionAlongEdgeClosestToDirection(edge: Edge, direction: Angle): Angle{
      
      const {point1, point2} = octagon.edges[edge]

      const edgeDirection1 = getDirectionOfPosition2FromPosition1(point1, point2)
      const edgeDirection2 = getOppositeDirection(edgeDirection1)

      const point1AngleDiff = getSmallestAngleBetween2Directions(edgeDirection1, direction).angleBetween
      const point2AngleDiff = getSmallestAngleBetween2Directions(edgeDirection2, direction).angleBetween

      return point1AngleDiff < point2AngleDiff ? edgeDirection1 : edgeDirection2
    }
  }



  const publicProperties = {
    getIsAgainstEdge, // ✓
    getDirectionFromFlanked, // ✓
    getNearEdgeInDirection, // ✓
    getDirectionAlongEdgePastFlanker, // ✓
    getDirectionBetweenFlankers, // seems off
    getDirectionInfluencedByNearEdge, // ✓
    getDirectionAwayFromEnemy, // ✓
    getDirectionAlongEdgeAwayFromEnemy, // ✓

  }
  const privateProperties = {
    getDistanceFromEdge,
    getCorneredDirectionAlongEdgeAwayFromEnemy,
    getDirectionOfEdgeCornerClosestToDirection,
    getDirectionBetweenBasedOnInfluence,
    getFlankerThreatInfluence,
    enemyBlockingDirection
  }

  return {publicProperties, privateProperties}
    


  

  function getIsInCorner(): boolean{
    return !!(proximity.getEdges(maxAgainstEdgeDistance).length == 2)
  }

  

  function getDirectionAlongEdgeToFurthestCorner(edge: Edge): Angle{    
    const {point1, point2} = octagon.edges[edge]
    const [distanceFromPoint1, distanceFromPoint2] = [point1,point2].map(point => getDistanceBetweenTwoPoints(movement.coords, point))

    const [furthestPoint, closestPoint] =  distanceFromPoint1 > distanceFromPoint2 ? [point1, point2] : [point2, point1]

    return getDirectionOfPosition2FromPosition1(closestPoint, furthestPoint)
  }

  function getDirectionOfEdgeCornerClosestToDirection(edge: Edge, retreatDirection: Angle): Angle{
   

    const [point1Data, point2Data] = Object.values(octagon.edges[edge]).map((corner: Coords) => {
      
      const cornerDirection = getDirectionOfPosition2FromPosition1(movement.coords, corner)
      const angleDiff = getSmallestAngleBetween2Directions(cornerDirection, retreatDirection).angleBetween

      return {cornerDirection, angleDiff}
    })

    return point1Data.angleDiff < point2Data.angleDiff ? 
      point1Data.cornerDirection : 
      point2Data.cornerDirection

  }


  function getCorneredDirectionAlongEdgeAwayFromEnemy(enemy: Fighter): Angle{
    const furthestEdgeFromEnemy = getEdgeFurthestFromEnemy(getCornerEdges(), enemy)

    const directionAlongEdge = getDirectionAlongEdgeToFurthestCorner(furthestEdgeFromEnemy)
    console.log('directionAlongEdge :>> ', directionAlongEdge);
    return directionAlongEdge
  }



  function getEdgeFurthestFromEnemy(edges: Edge[], enemy: Fighter): Edge{
        
    const [edge1, edge2] = edges
    const edge1Distance = getDistanceFromEdge(edge1, enemy.fighting)
    const edge2Distance = getDistanceFromEdge(edge2, enemy.fighting)
    return edge1Distance > edge2Distance ? edge1 : edge2
  }


  function getCornerEdges(): [Edge, Edge]{    
    const [edge1, edge2] = proximity.getEdges(maxAgainstEdgeDistance).map(({edge}) => edge)

    return edge1 && edge2 && [edge1, edge2]
  }
  

  function getDirectionBetweenBasedOnInfluence(
    direction1: Angle, 
    direction1Influence: Percent,
    direction2: Angle, 
    direction2Influence: Percent,
    influenceRepulseOrAttract: 'repulse' | 'attract'
  ): Angle{

    const {angleBetween, crosses0} = getSmallestAngleBetween2Directions(direction1, direction2)

    const [leftAngle, rightAngle] = (
      (
        !crosses0 && direction1 < direction2 ||
        crosses0 && direction2 < direction1
      ) ? 
      [direction1, direction2] : 
      [direction2, direction1]
    )

    const direction1AngleInfluenceAmount = toAngle(angleBetween * direction1Influence)
    const direction2AngleInfluenceAmount = toAngle(angleBetween * direction2Influence)

    if(influenceRepulseOrAttract == 'attract'){
      if(direction1 == leftAngle) 
        return subtractAngle2FromAngle1(rightAngle, direction1AngleInfluenceAmount)
        
      if(direction2 == leftAngle) 
        return subtractAngle2FromAngle1(rightAngle, direction2AngleInfluenceAmount)
    }
    if(influenceRepulseOrAttract == 'repulse'){
      if(direction1 == leftAngle) 
        return add2Angles(leftAngle, direction1AngleInfluenceAmount)
        
      if(direction2 == leftAngle) 
        return add2Angles(leftAngle, direction2AngleInfluenceAmount)
    }

  }

/* 

  direction away influence
    - get direction away from each flanker
    - smallest angle between
    - if left direction away has closer enemy, then left direction has bigger influence
    - bigger influence should logically mean that 

*/


  /* blocking angle based on distance away */
  function enemyBlockingDirection(enemy: Fighter, direction: Angle): boolean{
    const distance = proximity.getDistanceFromEnemyCenterPoint(enemy)
    const closeness = proximity.getClosenessBasedOnDistance(distance)
    const directionFromEnemy = proximity.getDirectionOfEnemyCenterPoint(enemy)
    if(closeness == Closeness['striking range'])
      return true
    if(closeness == Closeness['close'])
      return directionWithinDegreesOfDirection(direction, 135, directionFromEnemy)
    if(closeness == Closeness['nearby']) 
      return directionWithinDegreesOfDirection(direction, 90, directionFromEnemy)
    if(closeness == Closeness['far']) 
      return directionWithinDegreesOfDirection(direction, 45, directionFromEnemy)
  }

}


  /* 
    getDirectionOfEdgeCornerClosestToDirection
    - need both edge corner directions
    - get smallest angle of each
    - whichever's smaller return its direction
  */

  /* 
    getDirectionAlongEdgePastFlanker
      - this one is big
      - if flanked and cornered theyre pretty much screwed, but should still check if theres an escape option
        ~ should look at 2 possible escape routes, (escape between is another option)
        ~ factor in, how close they are, if theyre attacking, and if theyre in direction of along edge
      - break it down into chunks
        ~ need the along edge directions, distance, directions and if attacking from fighters
      - consider reuse in other functions, non flanked will have similar
      - if both directions are blocked return nothing, if both directions arent blocked, choose best direction
        ~ best direction is based on: if they attacking, if they already dedicated to that direction, how far they are vs what angle they are away relative to what angle along edge is
  */


  /* 
  getDirectionInfluencedByNearEdge
    - logic:
      ~ when retreating toward edge, instead of directly to edge and then along edge, move toward edge corner away from least threatening enemy
    - notes:
      ~ retreat from corner and retreat between flankers is handled elsewhere
  */