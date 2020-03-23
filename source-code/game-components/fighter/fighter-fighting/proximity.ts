import Fighter from "../fighter"
import FighterFighting from "./fighter-fighting"
import Coords from "../../../interfaces/game/fighter/coords"
import Direction360 from "../../../types/figher/direction-360"
import { Closeness } from "../../../types/figher/closeness"
import Dimensions from "../../../interfaces/game/fighter/dimensions"
import { getDirectionOfPosition2FromPosition1, getDistanceBetweenTwoPoints, getSmallestAngleBetween2Directions } from "../../../helper-functions/helper-functions"
import { LeftOrRight } from "../../../interfaces/game/fighter/left-or-right"
import EdgeCoordDistance from "../../../interfaces/game/fighter/edge-coord-distance"
import Octagon from "../../fight/octagon"
import FighterModelState from "../../../types/figher/fighter-model-states"
import Flanker from "../../../interfaces/game/fighter/flanker"
import { defaultSkinModelImages } from "../../../client/images/fighter/default-skin/default-skin-model-images"
import { muscleSkinModelImages } from "../../../client/images/fighter/muscle-skin/muscle-skin-model-images"
import { fastSkinModelImages } from "../../../client/images/fighter/fast-skin/fast-skin-model-images"
import Flanked from "../../../interfaces/game/fighter/flanked"
import { Edge } from "../../../interfaces/game/fighter/edge"
import { octagon } from "../../fight/new-octagon"


interface Fighters{
  fighters: Fighter[]
}
interface FighteresByCloseness{
  fighters: Fighter[]
}

function x(): FighteresByCloseness{
  return {fighters: []}
}
const y: Fighters = x()

export default class Proximity {

  
  flanked: Flanked
  inCornerOfEdges: Edge[]
  againstEdge: Edge

  constructor(public fighting: FighterFighting){}

  getRetreatFromCorneredDirection(enemy: Fighter): Direction360{
    const enemyCoords: Coords = enemy.fighting.movement.coords
    const enemyDistanceFromEdge1: number = octagon.getDistanceFromEdge(this.inCornerOfEdges[0], enemyCoords)
    const enemyDistanceFromEdge2: number = octagon.getDistanceFromEdge(this.inCornerOfEdges[1], enemyCoords)


    let retreatEdge: Edge
    if(enemyDistanceFromEdge1 > enemyDistanceFromEdge2)
      retreatEdge = this.inCornerOfEdges[0]
    else 
      retreatEdge = this.inCornerOfEdges[1]

    
    const directionAlongEdge: Direction360 = this.getDirectionOfEdgeCornerFurthestAwayFromEnemy(retreatEdge, enemy)


    console.log(`${this.fighting.fighter.name} is CORNERED by ${enemy.name}, retreating along ${retreatEdge} in direction ${directionAlongEdge}`);

    this.fighting.logistics.directionAlongEdge = directionAlongEdge
    this.fighting.timers.start('retreat along edge')

    return directionAlongEdge
  }

  getDirectionOfEdgeCornerFurthestAwayFromEnemy(edge: Edge, enemy: Fighter): Direction360{

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

  getRetreatAroundEdgeDirection(enemy): Direction360{
    const {directionAlongEdge} = this.fighting.logistics
    if(directionAlongEdge)
      return directionAlongEdge


    if(this.inCornerOfEdges)
      return this.getRetreatFromCorneredDirection(enemy)
      
    
    const retreatingAlongEdge: Edge  = this.getNearestEdge()
    const initialDirection = this.getDirectionOfEnemyCenterPoint(enemy, true)
    const {point1, point2} = octagon.edges[retreatingAlongEdge]
    const direction1 = getDirectionOfPosition2FromPosition1(point1, point2)
    const direction2 = getDirectionOfPosition2FromPosition1(point2, point1)

    let direction1DiffFromInitial = getSmallestAngleBetween2Directions(direction1, initialDirection)
      
    let direction2DiffFromInitial = getSmallestAngleBetween2Directions(direction2, initialDirection)

    const directionClosestToInitial = direction1DiffFromInitial < direction2DiffFromInitial ? direction1 : direction2

    
    this.fighting.logistics.directionAlongEdge = directionAlongEdge
    this.fighting.timers.start('retreat along edge')
    
    //console.log(`${this.fighting.fighter.name} is retreating along ${retreatingAlongEdge} edge away from ${enemy.name} in a direction of ${directionClosestToInitial}`);

    return directionClosestToInitial as Direction360
  }

  getNearEdges(): Edge[]{    
    const distanceFromEdges: {edgeName: Edge, distance: number}[] = this.getNearEdgesWithDistance()
    return distanceFromEdges.map(edgeDistance => edgeDistance.edgeName)
  }

  
  getNearEdgesWithDistance(): {edgeName: Edge, distance: number}[]{
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
    return distanceFromEdges.filter(distanceFromEdge => distanceFromEdge.distance < strikingRange)
  }

  getNearestEdge(): Edge{
    const distanceFromEdges: {edgeName: Edge, distance: number}[] = this.getNearEdgesWithDistance()
    

    const nearestEdge: {edgeName: Edge, distance: number} = distanceFromEdges.reduce((nearestEdge, edgeDistance) => {
      if(!nearestEdge || edgeDistance.distance < nearestEdge.distance)
        return edgeDistance
      else
        return nearestEdge
    }, undefined)

    return nearestEdge && nearestEdge.distance < strikingRange ? nearestEdge.edgeName : undefined
  }

  
  

  rememberEnemyBehind(enemy){
    if(enemy === undefined)
      return

    if(enemy == null)
      this.fighting.rememberedEnemyBehind = null

    else if(enemy){   
      this.fighting.flanking.determineIfFlanked() 
      this.fighting.rememberedEnemyBehind = {...enemy}
    }   
         
    this.fighting.timers.start('memory of enemy behind')
  }

  getClosestRememberedEnemy(): Fighter{
    const closestEnemyInfront = this.getClosestEnemyInfront()
    if(!closestEnemyInfront && !this.fighting.rememberedEnemyBehind)
      return
    if(closestEnemyInfront && !this.fighting.rememberedEnemyBehind)
      return closestEnemyInfront
    if(!closestEnemyInfront && this.fighting.rememberedEnemyBehind)
      return this.fighting.rememberedEnemyBehind
    

    const infrontEnemyDistance = this.getDistanceFromEnemyCenterPoint(closestEnemyInfront)
    
    const behindEnemyDistance = this.getDistanceFromEnemyCenterPoint(this.fighting.rememberedEnemyBehind)

    return infrontEnemyDistance < behindEnemyDistance ? closestEnemyInfront : this.fighting.rememberedEnemyBehind
  }

  sortEdgesByClosest(edge: EdgeCoordDistance[]): EdgeCoordDistance[]{    
    return edge.sort((a: EdgeCoordDistance, b: EdgeCoordDistance) => this.compareSmallest(a.distance, b.distance))
  }  

  sortFlankersByClosest(flankers: Flanker[]): Flanker[]{    
    return flankers.sort((a: Flanker, b: Flanker) => this.compareSmallest(a.distance, b.distance))
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

  getSurroundingEnemies(): Fighter[]{
    const {rememberedEnemyBehind} = this.fighting
    const enemiesInfront = getEnemiesInfront(this.fighting.otherFightersInFight, this.fighting.fighter)
    if(rememberedEnemyBehind)      
      return [...enemiesInfront, rememberedEnemyBehind]
    else
      return enemiesInfront
  }
  
 



  

  

  

  enemyWithinStrikingRange(enemy: Fighter): boolean{
    const {fighter} = this.fighting
    if(!enemy)
      return false

    const enemyIsOnThe: LeftOrRight = this.enemyIsOnThe('right', enemy) ? 'right' : 'left'
    const thisStrikingCenter: Coords = getFighterStrikingCenter(fighter, isEnemyFacingAway(fighter, fighter))
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



  getClosestEnemyInfront(){
    return getEnemiesInfront(this.fighting.otherFightersInFight, this.fighting.fighter).reduce(
      (closestFighter: Fighter, fighter: Fighter) => {        
        if(!closestFighter)
          return fighter
        else {          
          const fighterDistance = this.getDistanceFromEnemyCenterPoint(fighter)
          const closestDistance = this.getDistanceFromEnemyCenterPoint(closestFighter)
          if(fighterDistance < closestDistance)
            closestFighter = fighter          
          return closestFighter
        }
      },null)
  }

  
  getDistanceFromEnemyCenterPoint(enemy: Fighter): number{
    const thisCoords = this.fighting.movement.coords
    const enemyCoords = enemy.fighting.movement.coords    
    return getDistanceBetweenTwoPoints(thisCoords, enemyCoords)    
  }


  getDirectionOfEnemyCenterPoint(enemy: Fighter, opposite?): Direction360{

    const thisCoords = this.fighting.movement.coords
    const enemyCoords = enemy.fighting.movement.coords  

    const direction: Direction360 = getDirectionOfPosition2FromPosition1(thisCoords, enemyCoords)
    
    if(opposite)
      return (direction >= 180 ? direction - 180 : 180 + direction) as Direction360
       

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


  isDirectionWithin90DegreesOfDirection(testDirection, withinDirection): boolean{
    if(withinDirection >= 90 && withinDirection < 270){
      if(testDirection > (withinDirection - 90) &&
        testDirection < (withinDirection + 90))
          return true
    }

    if(withinDirection < 90){
      if(testDirection < (withinDirection + 90))
        return true
    }
    
    if(withinDirection >= 270){
      if(testDirection > (withinDirection - 90))
        return true
    }

    if(withinDirection < 90){
      const reverseAmount = 90 - withinDirection
      if(testDirection < withinDirection || 
        testDirection > (359 - reverseAmount))
          return true
    }
    
    if(withinDirection >= 270){
      const reverseAmount = (withinDirection + 90) - 359
      if(testDirection > withinDirection || 
        testDirection < reverseAmount)
          return true
    }

    return false
  
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
    const otherFightersStillFighting: Fighter[] = this.fighting.logistics.otherFightersStillFighting()

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

function getEnemiesInfront(enemies: Fighter[], thisFighter: Fighter){
  const fightersInfront: Fighter[] = enemies.filter((fighter: Fighter) => {  
    if(fighter.fighting.knockedOut){
      return false
    }
    const otherX = fighter.fighting.movement.coords.x      
    const thisX = thisFighter.fighting.movement.coords.x 

    if(thisFighter.fighting.facingDirection === 'left'){        
      return otherX <= thisX
    }
    if(thisFighter.fighting.facingDirection === 'right'){        
      return otherX >= thisX
    }
  })
  
  return fightersInfront
}

function getDirectionOfEnemyStrikingCenter(enemy: Fighter, thisFighter: Fighter, opposite?): Direction360{

  const thisStrikingCenter: Coords = getFighterStrikingCenter(thisFighter, isFacingAwayFromEnemy(enemy, thisFighter))
  const enemyStrikingCenter: Coords = getFighterStrikingCenter(enemy, isEnemyFacingAway(enemy, thisFighter))

  const direction: Direction360 = getDirectionOfPosition2FromPosition1(thisStrikingCenter, enemyStrikingCenter)
  
  if(opposite)
    return getOppositeDirection(direction)
     

  return direction
}

function isFacingAwayFromEnemy(enemy: Fighter, thisFighter: Fighter): boolean{
  const enemyCoords = enemy.fighting.movement.coords
  return isFacingCoods(enemyCoords, thisFighter)    
}

function isEnemyFacingAway(enemy: Fighter, thisFighter): boolean{
  const {coords} = thisFighter.fighting.movement
  const enemyFacingDirection = enemy.fighting.facingDirection

  const enemyCoords = enemy.fighting.movement.coords
  if(coords.x < enemyCoords.x && enemyFacingDirection == 'right')
    return true
  if(coords.x > enemyCoords.x && enemyFacingDirection == 'left')
    return true
  return false
}


function isFacingCoods(coords: Coords, thisFighter: Fighter){
  const {facingDirection, movement} = thisFighter.fighting
  if(movement.coords.x < coords.x && facingDirection == 'left')
  return true
  if(movement.coords.x > coords.x && facingDirection == 'right')
    return true
  return false
}


function getOppositeDirection(direction: Direction360): Direction360{
  return (direction >= 180 ? direction - 180 : 180 + direction) as Direction360
}

const strikingRange = 8
const closeRange = 70
const nearbyRange = 150
const farRange = 250

export {
  strikingRange,
  closeRange,
  nearbyRange,
  farRange,
  getDirectionOfEnemyStrikingCenter,
  getEnemiesInfront,
  getFighterStrikingCenter,
  getDistanceOfEnemyStrikingCenter,
  getClosestEnemy,
  getFighterModelDimensions,
  isFacingAwayFromEnemy,
  isEnemyFacingAway
}