import Fighter from "../fighter"
import FighterFighting from "./fighter-fighting"
import Coords from "../../../interfaces/game/fighter/coords"
import Direction360 from "../../../types/figher/direction-360"
import { Closeness } from "../../../types/figher/closeness"
import Dimensions from "../../../interfaces/game/fighter/dimensions"
import { getDirectionOfPosition2FromPosition1, getDistanceBetweenTwoPoints } from "../../../helper-functions/helper-functions"
import { LeftOrRight } from "../../../interfaces/game/fighter/left-or-right"


export default class Proximity {
  strikingRange = 20
  closeRange = 70
  nearbyRange = 180
  
  rememberedEnemyBehind: Fighter

  constructor(private fighting: FighterFighting){}


  
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
      this.rememberedEnemyBehind = null

    else if(enemy){    
      this.rememberedEnemyBehind = enemy
    }   
         
    this.fighting.startTimer(this.fighting.timers.memoryOfEnemyBehind)
  }

  getClosestRememberedEnemy(): Fighter{
    const closestEnemyInfront = this.getClosestEnemyInfront()
    if(!closestEnemyInfront && !this.rememberedEnemyBehind)
      return
    if(closestEnemyInfront && !this.rememberedEnemyBehind)
      return closestEnemyInfront
    if(!closestEnemyInfront && this.rememberedEnemyBehind)
      return this.rememberedEnemyBehind
    

    const infrontEnemyDistance = this.getDistanceFromEnemyCenterPoint(closestEnemyInfront)
    
    const behindEnemyDistance = this.getDistanceFromEnemyCenterPoint(closestEnemyInfront)

    return infrontEnemyDistance < behindEnemyDistance ? closestEnemyInfront : this.rememberedEnemyBehind
  }

  getFighterStrikingCenter(fighter: Fighter): Coords{
    const {movement, facingDirection} = fighter.fighting
    const {width, height} = this.getFighterModelDimensions(fighter)

    let x
    const y = movement.coords.y + height * 0.8
    if(facingDirection == 'right')
      x = movement.coords.x + width * 0.2
    if(facingDirection == 'left')
      x = movement.coords.x - width * 0.2

    return {x, y}
  }

  getDirectionOfEnemyStrikingCenter(enemy: Fighter): Direction360{
    const thisStrikingCenter: Coords = this.getFighterStrikingCenter(this.fighting.fighter)
    const enemyStrikingCenter: Coords = this.getFighterStrikingCenter(enemy)

    return getDirectionOfPosition2FromPosition1(thisStrikingCenter, enemyStrikingCenter)
  }

  
  getDistanceOfEnemyStrikingCenter(enemy: Fighter): number{
    const thisStrikingCenter: Coords = this.getFighterStrikingCenter(this.fighting.fighter)
    const enemyStrikingCenter: Coords = this.getFighterStrikingCenter(enemy)

    return getDistanceBetweenTwoPoints(thisStrikingCenter, enemyStrikingCenter)
  }

  

  enemyWithinStrikingRange(enemy: Fighter): boolean{
    const thisStrikingCenter: Coords = this.getFighterStrikingCenter(this.fighting.fighter)
    const enemyStrikingCenter: Coords = this.getFighterStrikingCenter(enemy)
    
    let verticalInRange
    if(
      thisStrikingCenter.y + 10 > enemyStrikingCenter.y - 10 ||
      thisStrikingCenter.y - 10 < enemyStrikingCenter.y + 10
    )
      verticalInRange = true
      
    let horizontalInRange
    if(
      thisStrikingCenter.x + 10 > enemyStrikingCenter.x - 10 ||
      thisStrikingCenter.x - 10 < enemyStrikingCenter.x + 10
    )
      horizontalInRange = true
    
    return verticalInRange && horizontalInRange
  }
  


  isEnemyBehind(enemy: Fighter){
    const {facingDirection, movement} = this.fighting
    const enemyX = enemy.fighting.movement.coords.x
    const thisX = movement.coords.x

    if(
      facingDirection == 'left' &&
      enemyX > thisX)
      return true

    if(facingDirection == 'right' &&
    enemyX < thisX)
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
    const distanceAway: number = this.getDistanceToEnemyStrikingPosition(enemy)
    if(this.enemyWithinStrikingRange(enemy))
      return Closeness['striking range']
    if(distanceAway <= this.closeRange)
      return Closeness['close']
    if(distanceAway <= this.nearbyRange)
      return Closeness['nearby']
    
    return Closeness['far']
  }

  getFighterSideX(fighter: Fighter, side: LeftOrRight): number {
    const {modelState, movement} = fighter.fighting
    const {x} = movement.coords
    const width: number = this.getModelDimensions(modelState).width
    
    return side == 'left' ? x - width*0.5 : x + width*0.5
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




  getFighterModelDimensions(fighter: Fighter): Dimensions{    
    return fighter.getSkinModelImages()
    .find(modelImage => modelImage.modelState == fighter.fighting.modelState).dimensions
  }
  
  getDirectionOfFighter(fighter: Fighter, opposite?: boolean): Direction360{

    const {movement, modelState} = this.fighting
    const thisCoords = movement.coords
    const otherCoords = fighter.fighting.movement.coords

    const thisModelDimensions: Dimensions = this.getFighterModelDimensions(modelState)
    
    const otherModelDimensions: Dimensions = this.getFighterModelDimensions( fighter.fighting.modelState)

    let pos1: Coords = {...thisCoords}
    let pos2: Coords = {...otherCoords}
    
    if(thisCoords.x < otherCoords.x){
      pos1.x += thisModelDimensions.width / 2
      pos2.x -= thisModelDimensions.width / 2
    }
    else {      
      pos1.x -= thisModelDimensions.width / 2
      pos2.x += thisModelDimensions.width / 2
    }
    

    const direction: Direction360 = getDirectionOfPosition2FromPosition1(pos1, pos2)
    if(opposite){
      if(direction >= 180){
        return (direction - 180) as Direction360
      }
      else {
        return (180 + direction) as Direction360
      }
    }
    
    if(isNaN(direction) || direction >= 360)
      debugger
    return direction
  }

  hasVerticleOverlapWithEnemy(enemy: Fighter){
    const {fighter} = this.fighting
    if(this.enemyIsOnThe('left', enemy)){
      if(
        this.getFighterSideX(enemy, 'right') >
        this.getFighterSideX(fighter, 'left')
      )
        return true
    }
    
    if(this.enemyIsOnThe('right', enemy)){
      if(
        this.getFighterSideX(enemy, 'left') <
        this.getFighterSideX(fighter, 'right')
      )
        return true
    }
  }
  
  
};
