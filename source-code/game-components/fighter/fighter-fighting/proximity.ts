import Fighter from "../fighter"
import FighterFighting from "./fighter-fighting"
import Coords from "../../../interfaces/game/fighter/coords"
import Dimensions from "../../../interfaces/game/fighter/dimensions"
import { getDirectionOfPosition2FromPosition1, getDistanceBetweenTwoPoints, getOppositeDirection, getSmallestAngleBetween2Directions, validateAngle } from "../../../helper-functions/helper-functions"
import { LeftOrRight } from "../../../interfaces/game/fighter/left-or-right"
import EdgeCoordDistance from "../../../interfaces/game/fighter/edge-coord-distance"
import { defaultSkinModelImages } from "../../../client/images/fight-view/fighter/default-skin/default-skin-model-images"
import { muscleSkinModelImages } from "../../../client/images/fight-view/fighter/muscle-skin/muscle-skin-model-images"
import { fastSkinModelImages } from "../../../client/images/fight-view/fighter/fast-skin/fast-skin-model-images"
import { Edge } from "../../../interfaces/game/fighter/edge"
import { octagon } from "../../abilities-general/fight/new-octagon"
import { Angle } from "../../../types/game/angle"
import { Closeness } from "../../../types/fighter/closeness"
import FighterModelState from "../../../types/fighter/fighter-model-states"



export default class Proximity {

  
  flanked: {severityRating: number, flankingFighters: Fighter[]}
  trapped: boolean
  inCornerOfEdges: Edge[]
  againstEdge: Edge

  constructor(public fighting: FighterFighting){}

  getRetreatFromCorneredDirection(enemy: Fighter): Angle{
    const enemyCoords: Coords = enemy.fighting.movement.coords
    const enemyDistanceFromEdge1: number = octagon.getDistanceFromEdge(this.inCornerOfEdges[0], enemyCoords)
    const enemyDistanceFromEdge2: number = octagon.getDistanceFromEdge(this.inCornerOfEdges[1], enemyCoords)


    let retreatEdge: Edge
    if(enemyDistanceFromEdge1 > enemyDistanceFromEdge2)
      retreatEdge = this.inCornerOfEdges[0]
    else 
      retreatEdge = this.inCornerOfEdges[1]

    
    let directionAlongEdge: Angle = this.getDirectionOfEdgeCornerFurthestAwayFromEnemy(retreatEdge, enemy)

    const isTowardEnemy = this.isDirectionWithinDegreesOfDirection(directionAlongEdge, 30, this.getDirectionOfEnemyCenterPoint(enemy))
    
    if(isTowardEnemy){
      const otherRetreatEdge = retreatEdge == this.inCornerOfEdges[0] ? this.inCornerOfEdges[1] : this.inCornerOfEdges[0]
      
      directionAlongEdge = this.getDirectionOfEdgeCornerFurthestAwayFromEnemy(otherRetreatEdge, enemy)
    }
    console.log(`${this.fighting.fighter.name} cornered retreat along ${retreatEdge}`, directionAlongEdge);


    //console.log(`${this.fighting.fighter.name} is CORNERED by ${enemy.name}, retreating along ${retreatEdge} in direction ${directionAlongEdge}`);
    this.fighting.logistics.directionAlongEdge = directionAlongEdge
    this.fighting.timers.start('retreat along edge')
    return directionAlongEdge
  }

  getDirectionOfEdgeCornerFurthestAwayFromEnemy(edge: Edge, enemy: Fighter): Angle{

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

  getRetreatAroundEdgeDirection(enemy): Angle{
    const {directionAlongEdge} = this.fighting.logistics
    /* if(directionAlongEdge)
      return directionAlongEdge */


    if(this.inCornerOfEdges)
      return this.getRetreatFromCorneredDirection(enemy)
      
    
    const retreatingAlongEdge: Edge  = this.getNearestEdge().edgeName
    const directionAwayFromEnemy = this.getDirectionOfEnemyCenterPoint(enemy, true)
    const {point1, point2} = octagon.edges[retreatingAlongEdge]
    const direction1 = getDirectionOfPosition2FromPosition1(point1, point2)
    const direction2 = getDirectionOfPosition2FromPosition1(point2, point1)

    let direction1DiffFromInitial = getSmallestAngleBetween2Directions(direction1, directionAwayFromEnemy)

      
    let direction2DiffFromInitial = getSmallestAngleBetween2Directions(direction2, directionAwayFromEnemy)


    const directionClosestToInitial = direction1DiffFromInitial.smallestAngle < direction2DiffFromInitial.smallestAngle ? direction1 : direction2

    console.log(`${this.fighting.fighter.name} retreat along ${retreatingAlongEdge}`, directionClosestToInitial);
    
    this.fighting.logistics.directionAlongEdge = directionAlongEdge
    this.fighting.timers.start('retreat along edge')
    
    return directionClosestToInitial as Angle
  }

  getNearEdges(): Edge[]{    
    const distanceFromEdges: {edgeName: Edge, distance: number}[] = this.getNearEdgesWithDistance()
    return distanceFromEdges.map(edgeDistance => edgeDistance.edgeName)
  }

  
  getNearEdgesWithDistance(distanceAway = 20): {edgeName: Edge, distance: number}[]{
    const {movement, fighter} = this.fighting
    const modelWidth = getFighterModelDimensions(fighter, 'Idle').width 
    const distanceFromEdges: {edgeName: Edge, distance: number}[] = []
    for (let edgeKey of octagon.edgeKeys) {
      const point: Coords = {...movement.coords}
      switch (edgeKey) {    
        case 'bottomLeft': point.x -= modelWidth*.4; break;
        case 'left': point.x -= modelWidth*.5; break;
        case 'topLeft': point.y += 10; point.x -= modelWidth*.4; break;
        case 'top': point.y += 20; break;
        case 'topRight': point.y += 10; point.x += modelWidth*.4; break;
        case 'right': point.x += modelWidth*.5; break;
        case 'bottomRight': point.x += modelWidth*.4
        break;    
      }
      const distance = octagon.getDistanceFromEdge(edgeKey, point)
      distanceFromEdges.push({edgeName: edgeKey, distance})
    }
    return distanceFromEdges.filter(distanceFromEdge => distanceFromEdge.distance < distanceAway)
  }

  getNearestEdge(): {edgeName: Edge, distance: number}{
    const distanceFromEdges: {edgeName: Edge, distance: number}[] = this.getNearEdgesWithDistance()
    

    const nearestEdge: {edgeName: Edge, distance: number} = distanceFromEdges.reduce((nearestEdge, edgeDistance) => {
      if(!nearestEdge || edgeDistance.distance < nearestEdge.distance)
        return edgeDistance
      else
        return nearestEdge
    }, undefined)

    return nearestEdge && nearestEdge.distance < strikingRange ? nearestEdge : undefined
  }

  
  

  rememberEnemyBehind(enemy){

    if(enemy === undefined)
      return

    if(enemy == null)
      this.fighting.rememberedEnemyBehind = null

    else if(enemy){   
      this.fighting.rememberedEnemyBehind = {...enemy}
      console.log(`${this.fighting.fighter.name} remembers ${enemy.name} behind`);
      
      this.fighting.flanking.determineIfFlanked() 
    }   
    
    this.fighting.timers.start('memory of enemy behind')
  }

  getClosestEnemyInFront(){
    const {facingDirection, movement} = this.fighting
    const otherFighters = this.fighting.logistics.otherFightersStillFighting()
    const closestEnemy =otherFighters.reduce(
      (selectedFighter: Fighter, loopFighter) => {
        const loopFighterLeft = loopFighter.fighting.movement.coords.x
        const loopFighterDistance = getDistanceOfEnemyStrikingCenter(loopFighter, this.fighting.fighter)
        if(!selectedFighter){
          if(facingDirection == 'left'){
            if(loopFighterLeft < movement.coords.x){
              return loopFighter
            }
          } 
          if(facingDirection == 'right'){
            if(loopFighterLeft > movement.coords.x){
              return loopFighter
            }
          }
        }
        else {
          const selectedFighterDistance = getDistanceOfEnemyStrikingCenter(selectedFighter, this.fighting.fighter)
          if(facingDirection == 'left'){
            if(loopFighterLeft < movement.coords.x){
              const loopFighterCloser = loopFighterDistance < selectedFighterDistance
              return loopFighterCloser ? loopFighter : selectedFighter
            }
            else return selectedFighter
          } 
          if(facingDirection == 'right'){
            if(loopFighterLeft > movement.coords.x){
              const loopFighterCloser = loopFighterDistance < selectedFighterDistance
              return loopFighterCloser ? loopFighter : selectedFighter
            }
            else return selectedFighter
          }
        }
        
      }, null
    )

    return closestEnemy
  }

  getClosestRememberedEnemy(): Fighter{
    const closestEnemyInFront = this.getClosestEnemyInFront()
    let enemyBehind = this.fighting.rememberedEnemyBehind
    if(enemyBehind?.fighting.knockedOut){
      enemyBehind = undefined
    }
    if(!closestEnemyInFront && !this.fighting.rememberedEnemyBehind)
      return
    if(closestEnemyInFront && !this.fighting.rememberedEnemyBehind)
      return closestEnemyInFront
    if(!closestEnemyInFront && this.fighting.rememberedEnemyBehind)
      return this.fighting.rememberedEnemyBehind
    

    const inFrontEnemyDistance = this.getDistanceFromEnemyCenterPoint(closestEnemyInFront)
    
    const behindEnemyDistance = this.getDistanceFromEnemyCenterPoint(this.fighting.rememberedEnemyBehind)
    
    const closestEnemy =  inFrontEnemyDistance < behindEnemyDistance ? closestEnemyInFront : this.fighting.rememberedEnemyBehind
    if(closestEnemy.fighting.knockedOut){
      debugger
    }
    return closestEnemy
  }

  sortEdgesByClosest(edge: EdgeCoordDistance[]): EdgeCoordDistance[]{    
    return edge.sort((a: EdgeCoordDistance, b: EdgeCoordDistance) => this.compareSmallest(a.distance, b.distance))
  }  

  sortFightersByClosest(flankers: Fighter[]): Fighter[]{   
    const f = this.fighting.fighter 
    return flankers.sort((a: Fighter, b: Fighter) => this.compareSmallest(getDistanceOfEnemyStrikingCenter(a, f), getDistanceOfEnemyStrikingCenter(b, f)))
  } 

  compareSmallest(number1, number2){
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


  getEnemyOnTheFar(leftOrRight: LeftOrRight): Fighter | undefined{
    const otherFighters = this.fighting.logistics.otherFightersStillFighting()
    if(leftOrRight == 'left'){
      const thisLeftVal = this.fighting.movement.coords.x
      const mostLeftFighter = otherFighters.reduce(
        (fighter, f) => {
          const loopLeftVal = f.fighting.movement.coords.x
          if(!fighter && loopLeftVal < thisLeftVal){
            return f
          }
          if(fighter){
            const fighterLeftVal = fighter.fighting.movement.coords.x

            return loopLeftVal < fighterLeftVal ? f : fighter
          }
          return undefined
        }, undefined
      )
      return mostLeftFighter
    }
    if(leftOrRight == 'right'){
      const thisLeftVal = this.fighting.movement.coords.x
      const mostLeftFighter = otherFighters.reduce(
        (fighter, f) => {
          const loopLeftVal = f.fighting.movement.coords.x
          if(!fighter && loopLeftVal > thisLeftVal){
            return f
          }
          if(fighter){
            const fighterLeftVal = fighter.fighting.movement.coords.x

            return loopLeftVal > fighterLeftVal ? f : fighter
          }
          return undefined
        }, undefined
      )
      return mostLeftFighter
    }
  }

  directionIsBlockedByEdge(adjustedAngle: number): boolean{
    const {coords} = this.fighting.movement
    const edgeDirection = octagon.getDirectionToClosestEdge(coords)
    this.isDirectionWithinDegreesOfDirection(adjustedAngle, 135, edgeDirection)
    const edgeDistance = octagon.getDistanceOfClosestEdge(this.fighting.movement.coords)
    const directionBlockedByEdge = edgeDistance < closeRange
    if(directionBlockedByEdge){
      //console.log('reposition blocked by edge');
      return
    }
  }


  
  getDistanceFromEnemyCenterPoint(enemy: Fighter): number{
    if(!enemy){
      debugger
    }
    const thisCoords = this.fighting.movement.coords
    const enemyCoords = enemy.fighting.movement.coords    
    return getDistanceBetweenTwoPoints(thisCoords, enemyCoords)    
  }


  getDirectionOfEnemyCenterPoint(enemy: Fighter, opposite?): Angle{

    const thisCoords = this.fighting.movement.coords
    const enemyCoords = enemy.fighting.movement.coords  

    const direction: Angle = getDirectionOfPosition2FromPosition1(thisCoords, enemyCoords)
    
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

  isEnemyTooCloseToAttack(enemy: Fighter): boolean{
    const {fighter} = this.fighting
    
    const thisStrikingCenter: Coords = getFighterStrikingCenter(fighter, isEnemyFacingAway(fighter, fighter))
    const enemyStrikingCenter: Coords = getFighterStrikingCenter(enemy, isEnemyFacingAway(enemy, fighter))

    
    const thisRight = thisStrikingCenter.x + strikingRange
    const thisLeft = thisStrikingCenter.x - strikingRange
    const enemyRight = enemyStrikingCenter.x + strikingRange
    const enemyLeft = enemyStrikingCenter.x - strikingRange
      
    const enemyIsOnThe: LeftOrRight = this.enemyIsOnThe('right', enemy) ? 'right' : 'left'

    if(enemyIsOnThe == 'right'){
      if(thisRight > enemyRight)
        return  true
    }
    else if(enemyIsOnThe == 'left'){
      if(thisLeft < enemyLeft)
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


  getClosenessBasedOnDistance(distance): Closeness{
    if(distance <= strikingRange)
      return Closeness['striking range']
    else if(distance <= closeRange)
      return Closeness['close']
    else if(distance <= nearbyRange)
      return Closeness['nearby']
    else
      return Closeness['far']
  }

  
  


  isDirectionWithinDegreesOfDirection(testDirection: Angle, degrees: Angle, withinDirection: Angle): boolean{
    validateAngle(testDirection)
    validateAngle(withinDirection)
    validateAngle(degrees)
    
    const halfOfDegrees = degrees / 2

    if(withinDirection - halfOfDegrees >= 0 && withinDirection + halfOfDegrees < 360){
      if(testDirection > withinDirection - halfOfDegrees && testDirection < withinDirection + halfOfDegrees)
        return true
    }
    else{
      if(withinDirection - halfOfDegrees < 0){
        const angleBackFrom360 = withinDirection - halfOfDegrees
        if(
          testDirection < withinDirection + halfOfDegrees && testDirection > 0 ||
          testDirection > 360 + angleBackFrom360
        )
          return true
      }
      if(withinDirection + halfOfDegrees >= 360){
        const angleOver360 = halfOfDegrees + withinDirection - 360
        if(
          testDirection > withinDirection - halfOfDegrees||
          testDirection < angleOver360
        )
          return true
      }

    }


  
  }

  isEnemyNearbyAndAttacking(enemy: Fighter): boolean{
    const {proximity} = this.fighting
    const {enemyTargetedForAttack} = enemy.fighting   
    const closeness = proximity.getEnemyCombatCloseness(enemy)   
    if(enemyTargetedForAttack){
      if (enemyTargetedForAttack.name == this.fighting.fighter.name &&  closeness <= Closeness['nearby']
      )
      return true
    }
  }

  allEnemiesAreOnOneSide(): boolean{
    const otherFightersStillFighting: Fighter[] = this.fighting.logistics.otherFightersStillFighting().filter(f => {
      const distance = getDistanceOfEnemyStrikingCenter(f, this.fighting.fighter)
      return distance < farRange
    })

    const thisFighterX = this.fighting.movement.coords.x

    const fightersToTheLeft = otherFightersStillFighting.filter(fighter => fighter.fighting.movement.coords.x < thisFighterX)

    return fightersToTheLeft.length == 0 || fightersToTheLeft.length == otherFightersStillFighting.length
  }

  getNumberOfEnemiesOnSideWithFewestNumberOfEnemies(): number{
    
    const otherFightersStillFighting: Fighter[] = this.fighting.logistics.otherFightersStillFighting()

    const thisFighterX = this.fighting.movement.coords.x

    const enemiesToTheLeft = otherFightersStillFighting.filter(fighter => fighter.fighting.movement.coords.x < thisFighterX).length

    const enemiesToTheRight = otherFightersStillFighting.length - enemiesToTheLeft

    return enemiesToTheLeft < enemiesToTheRight ? enemiesToTheLeft : enemiesToTheRight
  }

  directionBlockedByEnemyOnThe(side: LeftOrRight, direction: number): Fighter | undefined{
    const {facingDirection, rememberedEnemyBehind, fighter} = this.fighting

    let enemyOnThSide = facingDirection == side ? this.getClosestEnemyInFront() : rememberedEnemyBehind

    if(!enemyOnThSide) return

    const enemyTooFarAway = this.getEnemyCombatCloseness(enemyOnThSide) >= Closeness['far'] 

    const directionTowardEnemy = this.isDirectionWithinDegreesOfDirection(
      direction, 30, getDirectionOfEnemyStrikingCenter(enemyOnThSide, fighter, true)
    )

    if(
      !enemyTooFarAway &&
      directionTowardEnemy
    ) return enemyOnThSide

  }


};









function getClosestEnemy(enemies: Fighter[], thisFighter: Fighter): Fighter{
  return enemies.reduce((closestEnemy: Fighter, enemy: Fighter) => {
    if(!closestEnemy)
      return enemy
    
    const closestEnemyDistance = getDistanceOfEnemyStrikingCenter(closestEnemy, thisFighter)
    const enemyDistance = getDistanceOfEnemyStrikingCenter(enemy, thisFighter)
    const enemyIsCloser: boolean = enemyDistance < closestEnemyDistance

    return enemyIsCloser ? enemy : closestEnemy

  }, undefined)
}
  
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

function getEnemiesInFront(thisFighter: Fighter){
  const fightersInFront: Fighter[] = thisFighter.fighting.logistics.otherFightersStillFighting().filter((fighter: Fighter) => {  
    const otherX = fighter.fighting.movement.coords.x      
    const thisX = thisFighter.fighting.movement.coords.x 

    if(thisFighter.fighting.facingDirection === 'left'){        
      return otherX <= thisX
    }
    if(thisFighter.fighting.facingDirection === 'right'){        
      return otherX >= thisX
    }
  })
  
  return fightersInFront
}

function getDirectionOfEnemyStrikingCenter(enemy: Fighter, thisFighter: Fighter, opposite?): Angle{
  if(!enemy){
    debugger
  }
  const thisStrikingCenter: Coords = getFighterStrikingCenter(thisFighter, isFacingAwayFromEnemy(enemy, thisFighter))
  const enemyStrikingCenter: Coords = getFighterStrikingCenter(enemy, isEnemyFacingAway(enemy, thisFighter))

  const direction: Angle = getDirectionOfPosition2FromPosition1(thisStrikingCenter, enemyStrikingCenter)
  
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




const strikingRange = 8
const closeRange = 70
const nearbyRange = 150
const farRange = 240

export {
  strikingRange,
  closeRange,
  nearbyRange,
  farRange,
  getDirectionOfEnemyStrikingCenter,
  getEnemiesInFront,
  getFighterStrikingCenter,
  getDistanceOfEnemyStrikingCenter,
  getClosestEnemy,
  getFighterModelDimensions,
  isFacingAwayFromEnemy,
  isEnemyFacingAway
}