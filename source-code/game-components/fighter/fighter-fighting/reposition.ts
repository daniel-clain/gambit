import { getSmallestAngleBetween2Directions, validateAngle, getDirectionOfPosition2FromPosition1, add2Angles, subtractAngle2FromAngle1, check } from "../../../helper-functions/helper-functions";
import { LeftOrRight } from "../../../interfaces/game/fighter/left-or-right";
import { Closeness } from "../../../types/fighter/closeness";
import { Angle } from "../../../types/game/angle";
import { octagon } from "../../abilities-general/fight/new-octagon";
import Fighter from "../fighter";
import FighterFighting from "./fighter-fighting";
import { closeRange, farRange, getDirectionOfEnemyStrikingCenter, getDistanceOfEnemyStrikingCenter, nearbyRange, strikingRange } from "./proximity";

  /* 
    - if enemy is nearby distance no adjustment
    - if enemy is close distance, full adjustment
    - distances inbetween, relative adjustment between the 2 angles
    - the closer the enemy, the more off course
    - the angle between is always the smallest angle
    - figure out if angle is adjusted smaller or larger
    - factor in that it passes 0/360
  */


export function getRepositionMoveDirection(thisFighter: Fighter, checking?: boolean): number | undefined{
  const {proximity, movement, rememberedEnemyBehind} = thisFighter.fighting
  
  if(!rememberedEnemyBehind) return

  const choice = getChosenSideDirection()

  if(!choice) return

  const {chosenSideDirection, nearbyEnemy} = choice

  if(!nearbyEnemy) return
  
  const enemyDistanceAway: number = proximity.getDistanceFromEnemyCenterPoint(nearbyEnemy)
  const directionAwayFromEnemy: Angle = proximity.getDirectionOfEnemyCenterPoint(nearbyEnemy, true)  

  let adjustedAngle

  const enemyRangeCloseness = enemyDistanceAway - closeRange
  if(enemyRangeCloseness > (farRange - closeRange)){
    //console.log('not close enough to adjust');
    adjustedAngle = chosenSideDirection
  } else {


    const {smallestAngle, crosses0} = getSmallestAngleBetween2Directions(directionAwayFromEnemy, chosenSideDirection)
    const closenessRange = farRange - closeRange
    const closenessFactor = 1 - enemyRangeCloseness / closenessRange

    const diffAngleWeightedByFighterCloseness: Angle = Math.round(smallestAngle * (closenessFactor * .25))


    if(chosenSideDirection >= directionAwayFromEnemy){
      if(crosses0){          
        adjustedAngle = add2Angles(chosenSideDirection, diffAngleWeightedByFighterCloseness)
      }
      else{
        adjustedAngle = subtractAngle2FromAngle1(chosenSideDirection, diffAngleWeightedByFighterCloseness)
      }
    }
    
    if(directionAwayFromEnemy >= chosenSideDirection){    
      if(crosses0){
        adjustedAngle = subtractAngle2FromAngle1(chosenSideDirection, diffAngleWeightedByFighterCloseness)
      }
      else{
        adjustedAngle = add2Angles(chosenSideDirection, diffAngleWeightedByFighterCloseness)
      }
    }
  }
  //console.log('adjustedAngle :>> ', adjustedAngle);

  if(proximity.directionIsBlockedByEdge(adjustedAngle)){
    return
  }

  if(isNaN(adjustedAngle))
    debugger

  return adjustedAngle



  function getChosenSideDirection(): {chosenSideDirection: number, nearbyEnemy: Fighter} | undefined {

    const {leftSpace, rightSpace} = getSideRepositionSpace(thisFighter.fighting)
    if(!thisFighter.fighting.rememberedEnemyBehind){
      debugger
    }
    

    const leftSideDirection = getDirectionOfPosition2FromPosition1(
      movement.coords, 
      octagon.getClosestCoordsOnAnEdgeFromAPoint('left', movement.coords)
    )
    const rightSideDirection = getDirectionOfPosition2FromPosition1(
      movement.coords, 
      octagon.getClosestCoordsOnAnEdgeFromAPoint('right', movement.coords)
    )

    const leftEnemyIsBlocking = proximity.directionBlockedByEnemyOnThe('left', leftSideDirection)    
    const rightEnemyIsBlocking = proximity.directionBlockedByEnemyOnThe('right', rightSideDirection)

    let leftVal: number | undefined
    let rightVal: number | undefined

    if(!leftEnemyIsBlocking){
      const leftDistance = octagon.getDistanceFromEdge('left', movement.coords)
      leftVal = leftSpace && leftSpace - leftDistance / 2
    }
    
    if(!rightEnemyIsBlocking){
      const rightDistance = octagon.getDistanceFromEdge('right', movement.coords)
      rightVal = rightSpace && rightSpace - rightDistance /2
    }

    if(!leftVal || !rightVal){
      //console.log('no side to move to');
      return undefined
    }

    if(!rightVal || (leftVal && leftVal > rightVal)){
      return {chosenSideDirection: leftSideDirection, nearbyEnemy: leftEnemyIsBlocking!}
    }
    if(!leftVal || (rightVal && rightVal > leftVal)){
      return {chosenSideDirection: rightSideDirection, nearbyEnemy: rightEnemyIsBlocking!}
    }


    
    
  }
  
}

export function getSideRepositionSpace(fighting: FighterFighting): {leftSpace: number | undefined, rightSpace: number | undefined}{
      
  const enemyOnFarLeft = fighting.proximity.getEnemyOnTheFar('left')    
  const enemyOnFarRight = fighting.proximity.getEnemyOnTheFar('right')

  if(!enemyOnFarLeft || !enemyOnFarRight){
    return {leftSpace: undefined, rightSpace: undefined}
  }

  const leftEdgeCoords = octagon.getClosestCoordsOnAnEdgeFromAPoint('left', enemyOnFarLeft.fighting.movement.coords)
  
  const rightEdgeCoords = octagon.getClosestCoordsOnAnEdgeFromAPoint('right', enemyOnFarRight.fighting.movement.coords)

  let leftSpace: number | undefined = enemyOnFarLeft.fighting.movement.coords.x - leftEdgeCoords.x
  let rightSpace: number | undefined = rightEdgeCoords.x - enemyOnFarRight.fighting.movement.coords.x 

  const minSpace = 150
  if(leftSpace < minSpace) leftSpace = undefined
  if(rightSpace < minSpace) rightSpace = undefined
  
  return {leftSpace, rightSpace}
}