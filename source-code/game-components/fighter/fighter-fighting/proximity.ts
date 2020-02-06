import Fighter from "../fighter"
import FighterFighting from "./fighter-fighting"
import Coords from "../../../interfaces/game/fighter/coords"
import Direction360 from "../../../types/figher/direction-360"
import { Closeness } from "../../../types/figher/closeness"
import Dimensions from "../../../interfaces/game/fighter/dimensions"
import { getDirectionOfPosition2FromPosition1, getDistanceBetweenTwoPoints } from "../../../helper-functions/helper-functions"
import { LeftOrRight } from "../../../interfaces/game/fighter/left-or-right"
import EdgeCoordDistance from "../../../interfaces/game/fighter/edge-coord-distance"
import Octagon from "../../fight/octagon"
import EnemiesSortedByDistance from "../../../interfaces/game/fighter/enemies-sorted-by-distance"
import EdgesSortedByDistance from "../../../interfaces/game/fighter/edges-sorted-by-distance"
import FighterModelState from "../../../types/figher/fighter-model-states"
import Flanker from "../../../interfaces/game/fighter/flanker"
import { defaultSkinModelImages } from "../../../client/images/fighter/default-skin/default-skin-model-images"
import { muscleSkinModelImages } from "../../../client/images/fighter/muscle-skin/muscle-skin-model-images"
import { fastSkinModelImages } from "../../../client/images/fighter/fast-skin/fast-skin-model-images"


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
  strikingRange = 8
  closeRange = 70
  nearbyRange = 150
  farRange = 250

  constructor(public fighting: FighterFighting){}
  
  getEnemiesInfront(){
    const fightersInfront: Fighter[] = this.fighting.otherFightersInFight
    .filter((fighter: Fighter) => {  
      if(fighter.fighting.knockedOut){
        return false
      }
      const otherX = fighter.fighting.movement.coords.x      
      const thisX = this.fighting.movement.coords.x 

      if(this.fighting.facingDirection === 'left'){        
        return otherX < thisX
      }
      if(this.fighting.facingDirection === 'right'){        
        return otherX > thisX
      }
    })
    
    return fightersInfront
  }

  rememberEnemyBehind(enemy){
    if(enemy === undefined)
      return

    if(enemy == null)
      this.fighting.rememberedEnemyBehind = null

    else if(enemy){    
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
    return flankers.sort((a: Fighter, b: Fighter) => this.compareSmallest(this.getDistanceOfEnemyStrikingCenter(a), this.getDistanceOfEnemyStrikingCenter(b)))
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
    const enemiesInfront = this.getEnemiesInfront()
    if(rememberedEnemyBehind)      
      return [...enemiesInfront, rememberedEnemyBehind]
    else
      return enemiesInfront
  }
  
  
  isNearEdge(): boolean{
    const {fighter, proximity, movement} = this.fighting
    const {width} = proximity.getFighterModelDimensions(fighter, 'Idle')

    const closestEdgeCoordDistance: EdgeCoordDistance = this.sortEdgesByClosest(Octagon.getAllEdgeDistanceAndCoordOnClosestEdge(movement.coords, width))[0]

    const closeness = proximity.getClosenessBasedOnDistance(closestEdgeCoordDistance.distance)

    return closeness == Closeness['striking range']
  }

  getOppositeDirection(direction: Direction360): Direction360{
    return (direction >= 180 ? direction - 180 : 180 + direction) as Direction360
  }


  getFighterStrikingCenter(fighter: Fighter, behindCenter?: boolean): Coords{
    const {movement, facingDirection} = fighter.fighting
    const {width, height} = this.getFighterModelDimensions(fighter, 'Idle')

    let x
    const y = movement.coords.y + height * 0.8

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

  getDirectionOfEnemyStrikingCenter(enemy: Fighter, opposite?): Direction360{

    const thisStrikingCenter: Coords = this.getFighterStrikingCenter(this.fighting.fighter, this.isFacingAwayFromEnemy(enemy))
    const enemyStrikingCenter: Coords = this.getFighterStrikingCenter(enemy, this.isEnemyFacingAway(enemy))

    const direction: Direction360 = getDirectionOfPosition2FromPosition1(thisStrikingCenter, enemyStrikingCenter)
    
    if(opposite)
      return this.getOppositeDirection(direction)
       

    return direction
  }

  
  getDistanceOfEnemyStrikingCenter(enemy: Fighter): number{

    const thisStrikingCenter: Coords = this.getFighterStrikingCenter(this.fighting.fighter, this.isFacingAwayFromEnemy(enemy))
    const enemyStrikingCenter: Coords = this.getFighterStrikingCenter(enemy, this.isEnemyFacingAway(enemy))

    return getDistanceBetweenTwoPoints(thisStrikingCenter, enemyStrikingCenter)
  }
  

  enemyWithinStrikingRange(enemy: Fighter): boolean{
    const {fighter} = this.fighting
    if(!enemy)
      return false

    const enemyIsOnThe: LeftOrRight = this.enemyIsOnThe('right', enemy) ? 'right' : 'left'
    const thisStrikingCenter: Coords = this.getFighterStrikingCenter(fighter, this.isEnemyFacingAway(fighter))
    const enemyStrikingCenter: Coords = this.getFighterStrikingCenter(enemy, this.isEnemyFacingAway(enemy))

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

    const thisRight = thisStrikingCenter.x + this.strikingRange
    const thisLeft = thisStrikingCenter.x - this.strikingRange
    const enemyRight = enemyStrikingCenter.x + this.strikingRange
    const enemyLeft = enemyStrikingCenter.x - this.strikingRange
      
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

  isFacingCoods(coords: Coords){
    const {facingDirection, movement} = this.fighting
    if(movement.coords.x < coords.x && facingDirection == 'left')
    return true
    if(movement.coords.x > coords.x && facingDirection == 'right')
      return true
    return false
  }


  getClosestEnemyInfront(){
    return this.getEnemiesInfront().reduce(
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

  

  isFacingAwayFromEnemy(enemy: Fighter): boolean{
    const enemyCoords = enemy.fighting.movement.coords
    return this.isFacingCoods(enemyCoords)    
  }

  isEnemyFacingAway(enemy: Fighter): boolean{
    const {coords} = this.fighting.movement
    const enemyFacingDirection = enemy.fighting.facingDirection

    const enemyCoords = enemy.fighting.movement.coords
    if(coords.x < enemyCoords.x && enemyFacingDirection == 'right')
      return true
    if(coords.x > enemyCoords.x && enemyFacingDirection == 'left')
      return true
    return false
  }


  getEnemyCombatCloseness(enemy: Fighter): Closeness{

    if(this.enemyWithinStrikingRange(enemy))
      return Closeness['striking range']
    else{
    const distanceAway: number = this.getDistanceOfEnemyStrikingCenter(enemy)  
      if(distanceAway <= this.closeRange)
        return Closeness['close']
      if(distanceAway <= this.nearbyRange)
        return Closeness['nearby'] 
      if(distanceAway <= this.farRange)
        return Closeness['far']
      return Closeness['very far']
    }
  }

  isEnemyTooCloseToAttack(enemy: Fighter): boolean{
    const {fighter} = this.fighting
    
    const thisStrikingCenter: Coords = this.getFighterStrikingCenter(fighter, this.isEnemyFacingAway(fighter))
    const enemyStrikingCenter: Coords = this.getFighterStrikingCenter(enemy, this.isEnemyFacingAway(enemy))

    
    const thisRight = thisStrikingCenter.x + this.strikingRange
    const thisLeft = thisStrikingCenter.x - this.strikingRange
    const enemyRight = enemyStrikingCenter.x + this.strikingRange
    const enemyLeft = enemyStrikingCenter.x - this.strikingRange
      
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
    if(distance <= this.strikingRange)
      return Closeness['striking range']
    else if(distance <= this.closeRange)
      return Closeness['close']
    else if(distance <= this.nearbyRange)
      return Closeness['nearby']
    else
      return Closeness['far']
  }

  getFighterModelDimensions(fighter: Fighter, modelState?: FighterModelState): Dimensions{   
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
  
  
  
};
