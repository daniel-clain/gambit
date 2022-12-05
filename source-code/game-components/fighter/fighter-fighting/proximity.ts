import Fighter from "../fighter"
import FighterFighting from "./fighter-fighting"
import Coords from "../../../interfaces/game/fighter/coords"
import Dimensions from "../../../interfaces/game/fighter/dimensions"
import { LeftOrRight } from "../../../interfaces/game/fighter/left-or-right"
import EdgeCoordDistance from "../../../interfaces/game/fighter/edge-coord-distance"
import { defaultSkinModelImages } from "../../../client/images/fight-view/fighter/default-skin/default-skin-model-images"
import { muscleSkinModelImages } from "../../../client/images/fight-view/fighter/muscle-skin/muscle-skin-model-images"
import { fastSkinModelImages } from "../../../client/images/fight-view/fighter/fast-skin/fast-skin-model-images"
import { Edge, EdgeDistance, edgeNames } from "../../../types/fighter/edge"
import { octagon } from "../../fight/octagon"
import { Angle } from "../../../types/game/angle"
import { Closeness } from "../../../types/fighter/closeness"
import FighterModelState from "../../../types/fighter/fighter-model-states"

export default class Proximity {

  constructor(public fighting: FighterFighting){}
  

  get againstEdge(): EdgeDistance{
    return this.getClosestEdge(10)
  }

  getClosestEdge(withinDistance?: number): EdgeDistance{
    return this.edgeDistances
    .filter(({distance}) => 
      withinDistance ? distance < withinDistance : true
    )
    .reduce<EdgeDistance>((nearestEdge, edgeDistance) => {
      if(!nearestEdge || edgeDistance.distance < nearestEdge.distance)
        return edgeDistance
      else
        return nearestEdge
    }, undefined)
  }

  getEdges(withinDistance?: number): EdgeDistance[]{
    const edgesWithinDistance = this.edgeDistances.filter(({distance}) => 
      withinDistance ? distance < withinDistance : true
    )
    return edgesWithinDistance
  }

  get edgeDistances(): EdgeDistance[]{
    return edgeNames.map(edge => {
      return {edge, distance: getDistanceFromEdge(edge, this.fighting)}
    })
  }
  

  

  sortEdgesByClosest(edge: EdgeCoordDistance[]): EdgeCoordDistance[]{    
    return edge.sort((a: EdgeCoordDistance, b: EdgeCoordDistance) => this.compareSmallest(a.distance, b.distance))
  }  

  sortFightersByClosest(flankers: Fighter[]): Fighter[]{   
    const f = this.fighting.fighter 
    return flankers.sort((a: Fighter, b: Fighter) => this.compareSmallest(getDistanceOfEnemyStrikingCenter(a, f), getDistanceOfEnemyStrikingCenter(b, f)))
  } 

  compareSmallest(number1: number, number2: number){
    if ( number1 < number2 ){
      return -1;
    }
    if ( number1 > number2 ){
      return 1;
    }
    return 0;
  }
  
 

  

  enemyWithinStrikingRange(enemy: Fighter): boolean{
    const {fighter} = this.fighting
    if(!enemy)
      return false

    const enemyIsOnThe: LeftOrRight = this.enemyIsOnThe('right', enemy) ? 'right' : 'left'
    const thisStrikingCenter: Coords = getFighterStrikingCenter(fighter, isFacingAwayFromEnemy(enemy, fighter))
    const enemyStrikingCenter: Coords = getFighterStrikingCenter(enemy, isEnemyFacingAway(enemy, fighter))

    const verticalRange = 10
    
    const thisTop = thisStrikingCenter.y + verticalRange
    const thisBottom = thisStrikingCenter.y - verticalRange
    const enemyTop = enemyStrikingCenter.y + verticalRange
    const enemyBottom = enemyStrikingCenter.y - verticalRange
    
    let verticalInRange
    if(
      thisTop >= enemyBottom && thisTop <= enemyTop ||
      thisBottom >= enemyBottom && thisBottom <= enemyTop
    )
      verticalInRange = true

    const thisRight = thisStrikingCenter.x + strikingRange
    const thisLeft = thisStrikingCenter.x - strikingRange
    const enemyRight = enemyStrikingCenter.x + strikingRange
    const enemyLeft = enemyStrikingCenter.x - strikingRange
      
    let horizontalInRange
    if(enemyIsOnThe == 'right'){
      if(thisRight >= enemyLeft && thisRight <= enemyRight)
        horizontalInRange = true
    }
    else if(enemyIsOnThe == 'left'){
      if(thisLeft >= enemyLeft && thisLeft <= enemyRight)
        horizontalInRange = true
    }
    
    return verticalInRange && horizontalInRange
  }  


  isEnemyBehind(enemy: Fighter): boolean{
    const {facingDirection, movement} = this.fighting
    const enemyX = enemy.fighting.movement.coords.x
    const thisX = movement.coords.x

    if(
      facingDirection == 'left' &&
      enemyX > thisX
    )
      return true

    if(
      facingDirection == 'right' &&
      enemyX < thisX
    )
      return true
    
    return false
  }




  
  getDistanceFromEnemyCenterPoint(enemy: Fighter): number{
    if(!enemy){
      debugger
    }
    const thisCoords = this.fighting.movement.coords
    const enemyCoords = enemy.fighting.movement.coords    
    return getDistanceBetweenTwoPoints(thisCoords, enemyCoords)    
  }


  getDirectionOfEnemyCenterPoint(enemy: Fighter, opposite?: boolean): Angle{

    const thisCoords = this.fighting.movement.coords
    const enemyCoords = enemy.fighting.movement.coords  

    const direction: Angle = getDirectionOfPosition1ToPosition2(thisCoords, enemyCoords)
    
    if(opposite)
      return (direction >= 180 ? direction - 180 : 180 + direction) as Angle
       

    return direction
  }



  getEnemyCombatCloseness(enemy: Fighter): Closeness{

    if(this.enemyWithinStrikingRange(enemy))
      return Closeness['striking range']
    else{
    const distanceAway: number = getDistanceOfEnemyStrikingCenter(enemy, this.fighting.fighter)  
      if(distanceAway <= closeRange)
        return Closeness['close']
      if(distanceAway <= nearbyRange)
        return Closeness['nearby'] 
      if(distanceAway <= farRange)
        return Closeness['far']
      return Closeness['very far']
    }
  }

  isEnemyTooCloseForStrikingCenter(enemy: Fighter): boolean{
    const {fighter} = this.fighting

    /* if fighter on left but striking on right then true */
    
    const thisStrikingCenter: Coords = getFighterStrikingCenter(fighter, isEnemyFacingAway(fighter, fighter))
    const enemyStrikingCenter: Coords = getFighterStrikingCenter(enemy, isEnemyFacingAway(enemy, fighter))

      
    const enemyIsOnThe: LeftOrRight = this.enemyIsOnThe('right', enemy) ? 'right' : 'left'

    if(enemyIsOnThe == 'right'){
      if(thisStrikingCenter.x  >= enemyStrikingCenter.x)
        return  true
    }
    else if(enemyIsOnThe == 'left'){
      if(thisStrikingCenter.x  <= enemyStrikingCenter.x)
        return  true
    }
  }


  enemyIsOnThe(side: LeftOrRight, enemy: Fighter): boolean{    
    const thisX = this.fighting.movement.coords.x
    const otherX = enemy.fighting.movement.coords.x

    if(side == 'left' && thisX > otherX)
      return true
    if(side == 'right' && thisX < otherX)
      return true
  }


  getClosenessBasedOnDistance(distance: number): Closeness{
    if(distance <= strikingRange)
      return Closeness['striking range']
    else if(distance <= closeRange)
      return Closeness['close']
    else if(distance <= nearbyRange)
      return Closeness['nearby']
    else
      return Closeness['far']
  }

  spaceToMove(LeftOrRight: LeftOrRight){
    
  }
  

  
  


  



};



  












function getDistanceOfEnemyStrikingCenter(enemy: Fighter, thisFighter: Fighter): number{

  const thisStrikingCenter: Coords = getFighterStrikingCenter(thisFighter, isFacingAwayFromEnemy(enemy, thisFighter))
  const enemyStrikingCenter: Coords = getFighterStrikingCenter(enemy, isEnemyFacingAway(enemy, thisFighter))

  return getDistanceBetweenTwoPoints(thisStrikingCenter, enemyStrikingCenter)
}

function getFighterModelDimensions(fighter: Fighter, modelState?: FighterModelState): Dimensions{   
  let modelImages 
  switch(fighter.skin){
    case 'Default': modelImages = defaultSkinModelImages; break
    case 'Muscle': modelImages =  muscleSkinModelImages; break
    case 'Fast': modelImages =  fastSkinModelImages; break
  }
  return modelImages.find(modelImage => 
    modelImage.modelState == (
      modelState ? modelState : fighter.fighting.modelState)
    ).dimensions
}

function getFighterBasePointFromEdge(edge: Edge, fighting: FighterFighting): Coords{
  const {movement: {coords}, fighter} = fighting
  const modelWidth = getFighterModelDimensions(fighter, 'Idle').width 
  const point: Coords = {...coords}
  switch (edge) {    
    case 'bottomLeft': point.x -= modelWidth*.4; break;
    case 'left': point.x -= modelWidth*.5; break;
    case 'topLeft': point.y += 10; point.x -= modelWidth*.4; break;
    case 'top': point.y += 20; break;
    case 'topRight': point.y += 10; point.x += modelWidth*.4; break;
    case 'right': point.x += modelWidth*.5; break;
    case 'bottomRight': point.x += modelWidth*.4
    break;    
  }
  return point
}


function getDistanceFromEdge(edge: Edge, fighting: FighterFighting): number{
  const point = getFighterBasePointFromEdge(edge, fighting)
  return octagon.getDistanceFromEdge(edge, point)
}



function getFighterStrikingCenter(fighter: Fighter, behindCenter?: boolean): Coords{
  const {movement, facingDirection} = fighter.fighting
  const {width, height} = getFighterModelDimensions(fighter, 'Idle')

  let x
  const y = movement.coords.y + height * 0.7

  if(
    facingDirection == 'right' && !behindCenter ||
    (facingDirection == 'left' && behindCenter)
  )
    x = movement.coords.x + width * 0.4

  else if(
    facingDirection == 'left' && !behindCenter ||
    (facingDirection == 'right' && behindCenter)
  )
    x = movement.coords.x - width * 0.4


  return {x, y}
}
function getDirectionOfEnemyStrikingCenter(enemy: Fighter, thisFighter: Fighter, opposite?: boolean): Angle{
  if(!enemy){
    debugger
  }
  const thisStrikingCenter: Coords = getFighterStrikingCenter(thisFighter, isFacingAwayFromEnemy(enemy, thisFighter))
  const enemyStrikingCenter: Coords = getFighterStrikingCenter(enemy, isEnemyFacingAway(enemy, thisFighter))

  const direction: Angle = getDirectionOfPosition1ToPosition2(thisStrikingCenter, enemyStrikingCenter)
  
  if(opposite)
    return getOppositeDirection(direction)
     

  return direction
}

function isFacingAwayFromEnemy(enemy: Fighter, thisFighter: Fighter): boolean{
  if(!enemy){
    debugger
  }
  const enemyCoords = enemy.fighting.movement.coords
  return isFacingCoords(enemyCoords, thisFighter)    
}

function isEnemyFacingAway(enemy: Fighter, thisFighter: Fighter): boolean{
  const {coords} = thisFighter.fighting.movement
  const enemyFacingDirection = enemy.fighting.facingDirection

  const enemyCoords = enemy.fighting.movement.coords
  if(coords.x < enemyCoords.x && enemyFacingDirection == 'right')
    return true
  if(coords.x > enemyCoords.x && enemyFacingDirection == 'left')
    return true
  return false
}


function isFacingCoords(coords: Coords, thisFighter: Fighter){
  const {facingDirection, movement} = thisFighter.fighting
  if(movement.coords.x < coords.x && facingDirection == 'left')
  return true
  if(movement.coords.x > coords.x && facingDirection == 'right')
    return true
  return false
}

function getDistanceBetweenTwoPoints(point1: Coords, point2: Coords): number{
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + 
    Math.pow(point1.y - point2.y, 2)
  )
}

function getPointGivenDistanceAndDirectionFromOtherPoint(point: Coords, distance: number, direction: Angle): Coords{
  const hypotenuse = distance
  let {x, y} = point

  if(direction < 90){
    const angle = direction - 0
    const sinAngle = Math.sin(angle * (Math.PI/180))
    const cosAngle = Math.cos(angle * (Math.PI/180))
    x += Math.round(sinAngle * hypotenuse)
    y += Math.round(cosAngle * hypotenuse)
  }
  else if(direction < 180){
    const angle = direction - 90
    const sinAngle = Math.sin(angle * (Math.PI/180))
    const cosAngle = Math.cos(angle * (Math.PI/180))
    x += Math.round(cosAngle * hypotenuse)
    y -= Math.round(sinAngle * hypotenuse)
  }
  else if(direction < 270){
    const angle = direction - 180
    const sinAngle = Math.sin(angle * (Math.PI/180))
    const cosAngle = Math.cos(angle * (Math.PI/180))
    x -= Math.round(sinAngle * hypotenuse)
    y -= Math.round(cosAngle * hypotenuse)
  }
  else if(direction < 360){
    const angle = direction - 270
    const sinAngle = Math.sin(angle * (Math.PI/180))
    const cosAngle = Math.cos(angle * (Math.PI/180))
    x -= Math.round(cosAngle * hypotenuse)
    y += Math.round(sinAngle * hypotenuse)

  }

  
  return {x, y}
}


function getDirectionOfPosition1ToPosition2(pos1: Coords, pos2: Coords): Angle{
  let directionOfPosition2FromPosition1: Angle
  let xLength = pos2.x - pos1.x
  let yLength = pos2.y - pos1.y
  let adjacentSide: number
  let oppositeSide: number
  let addedDegrees: Angle
  if(xLength == 0 && yLength == 0)
    return 0
  if (xLength < 0 && yLength >= 0) {
    oppositeSide = yLength
    adjacentSide = xLength * -1
    addedDegrees = 270
  }
  if (xLength < 0 && yLength < 0) {
    adjacentSide = yLength * -1
    oppositeSide = xLength * -1
    addedDegrees = 180
  }
  if (xLength >= 0 && yLength < 0) {
    oppositeSide = yLength * -1
    adjacentSide = xLength
    addedDegrees = 90
  }
  if (xLength >= 0 && yLength >= 0) {
    adjacentSide = yLength
    oppositeSide = xLength
    addedDegrees = 0
  }

  const degrees = toAngle(Math.round(
    Math.atan(oppositeSide! / adjacentSide!) * (180 / Math.PI)
  ))
  directionOfPosition2FromPosition1 = add2Angles(degrees, addedDegrees!)

  if(isNaN(directionOfPosition2FromPosition1))
    debugger

  return directionOfPosition2FromPosition1
}


function getOppositeDirection(direction: Angle): Angle{
  return subtractAngle2FromAngle1(direction, 180)
}

function getSmallestAngleBetween2Directions(direction1: Angle, direction2: Angle): {angleBetween: Angle, crosses0: boolean}{
  const [biggest, smallest] = direction1 > direction2 ?  [direction1, direction2] : [direction2, direction1]
  
  if(biggest - smallest > 180)
    return {angleBetween: subtractAngle2FromAngle1(smallest, biggest), crosses0: true}
  else
    return {angleBetween: subtractAngle2FromAngle1(biggest, smallest), crosses0: false}
}


function subtractAngle2FromAngle1(angle1: Angle, angle2: Angle): Angle {
  const subtracted = angle1 - angle2
  return toAngle(
    subtracted < 0 ?
      360 - (subtracted*-1) :
      subtracted
  )
}

function add2Angles(angle1: Angle, angle2: Angle) {
  return toAngle((angle1 + angle2) % 360)
}

function toAngle(angle: number): Angle{
  const rounded = Math.round(angle)
  if(rounded >= 360 || rounded < 0)
    throw 'angle is invalid: ' + rounded
  
  return rounded as Angle
}

const strikingRange = 8
const closeRange = 70
const nearbyRange = 150
const farRange = 240

export {
  strikingRange,
  closeRange,
  nearbyRange,
  farRange,
  getFighterBasePointFromEdge,
  directionWithinDegreesOfDirection,
  getDistanceBetweenTwoPoints,
  getPointGivenDistanceAndDirectionFromOtherPoint,
  getDirectionOfPosition1ToPosition2,
  getSmallestAngleBetween2Directions,
  add2Angles,
  subtractAngle2FromAngle1,
  toAngle,
  getOppositeDirection,
  getDirectionOfEnemyStrikingCenter,
  getFighterStrikingCenter,
  getDistanceOfEnemyStrikingCenter,
  getFighterModelDimensions,
  getDistanceFromEdge,
  isFacingAwayFromEnemy,
  isEnemyFacingAway
}


function directionWithinDegreesOfDirection(testDirection: Angle, degrees: Angle, withinDirection: Angle): boolean{
  
  if((withinDirection - degrees) >= 0 && (withinDirection + degrees) < 360){
    if(testDirection > (withinDirection - degrees) && testDirection < (withinDirection + degrees))
      return true
  }
  else{
    if((withinDirection - degrees) < 0){
      const angleBackFrom360 = withinDirection - degrees
      if(
        testDirection < (withinDirection + degrees) && testDirection > 0 ||
        testDirection > (360 + angleBackFrom360)
      )
        return true
    }
    if((withinDirection + degrees) >= 360){
      const angleOver360 = degrees + withinDirection - 360
      if(
        testDirection > (withinDirection - degrees) ||
        testDirection < angleOver360
      )
        return true
    }

  }

} 

export function getCornerPoint(cornerEdges: [Edge, Edge]): Coords{
  const {cornerPoint} = cornerEdges.reduce((passedObj, edge, i): {points, cornerPoint} => {
    const points = Object(octagon.edges[edge]).values
    if(i == 0){
      return {...passedObj,points} 
    }
    else {
      return {...passedObj, cornerPoint: points.find(p => p.x == passedObj.points.some(po => po.x == p.x && po.y == p.y))}
    }
  },{points: undefined, cornerPoint: undefined})
  
  return cornerPoint
}
