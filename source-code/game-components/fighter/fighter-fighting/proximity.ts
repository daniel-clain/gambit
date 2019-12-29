import Fighter from "../fighter"
import FighterFighting from "./fighter-fighting"
import { fighterModelImages } from "../../../client/images/fighter/fighter-model-images"
import Coords from "../../../interfaces/game/fighter/coords"
import Direction360 from "../../../types/figher/direction-360"
import { Closeness } from "../../../types/figher/closeness"
import Dimensions from "../../../interfaces/game/fighter/dimensions"
import FighterModelState from "../../../types/figher/fighter-model-states"

export default class Proximity {

  closeRange = 25
  nearbyRange = 100

  constructor(private fighterFighting: FighterFighting){}
  
  getFightersInfront(closeness: Closeness){
    const fightersInfront: Fighter[] = this.fighterFighting.otherFightersInFight
    .filter((fighter: Fighter) => {  
      if(fighter.fighting.knockedOut){
        return false
      }
      const otherX = fighter.fighting.movement.coords.x
      const otherWidth = this.getModelDimensions(fighter.fighting.modelState).width

      const thisX = this.fighterFighting.movement.coords.x  
      const thisWidth = this.getModelDimensions(this.fighterFighting.modelState).width

      if(this.fighterFighting.movement.facingDirection === 'left'){        
        return (otherX + otherWidth/2) < thisX
      }
      if(this.fighterFighting.movement.facingDirection === 'right'){        
        return otherX > (thisX + thisWidth/2)
      }
    })
    

    if(closeness == 'nearby'){
      return fightersInfront.filter(fighter => this.getFighterDistanceAway(fighter) < this.nearbyRange)
    }
    
    if(closeness == 'close'){
      return fightersInfront.filter(fighter => this.fighterWithinStrikingRange(fighter))
    }
    return fightersInfront
  }

  fighterInfront(closeness: Closeness): boolean{
    return this.getFightersInfront(closeness).length > 0
  }

  isFighterClose(fighter: Fighter, closeness: Closeness): boolean{
    const distance = this.getFighterDistanceAway(fighter)
    if(closeness == 'close'){
      return distance < this.closeRange
    }
    if(closeness == 'nearby'){
      return distance < this.nearbyRange
    }
  }

  lookForClosestFighter(){
    const {movement} = this.fighterFighting
    let fighter = this.getClosestFighterInfront()
    if(!fighter){
      movement.facingDirection = movement.facingDirection == 'left' ? 'right' : 'left'
      fighter = this.getClosestFighterInfront()
    }
    return fighter
  }

  getClosestFighterInfront(){
    return this.getFightersInfront(null).reduce(
      (closestFighter: Fighter, fighter: Fighter) => {
          if(!closestFighter || this.getFighterDistanceAway(fighter) < 
          this.getFighterDistanceAway(closestFighter)){
            closestFighter = fighter
          }
        return closestFighter
      }, null)
  }

  isFacingFighter(fighter: Fighter): boolean {
    const directionOfFighter: Direction360 = this.getDirectionOfFighter(fighter)
    if(directionOfFighter < 180 && this.fighterFighting.movement.facingDirection == 'right'){
      return true
    }
    if(directionOfFighter >= 180 && this.fighterFighting.movement.facingDirection == 'left'){
      return true
    }
  }

  checkForNearbyFighterInfront(): boolean{
    const nearFightersInfront: Fighter[] = this.getFightersInfront('nearby')
    return nearFightersInfront.length > 0

  }


  getFighterDistanceAway(fighter: Fighter): number{
    let distance
    let xDiff
    const thisCoords = this.fighterFighting.movement.coords
    const otherCoords = fighter.fighting.movement.coords
    
    const thisModel: Dimensions = this.getModelDimensions(this.fighterFighting.modelState)

    const otherModel: Dimensions = this.getModelDimensions(fighter.fighting.modelState)

    if(thisCoords.x > otherCoords.x)
      xDiff = thisCoords.x - (otherCoords.x + otherModel.width/2)  
    else 
      xDiff = otherCoords.x - (thisCoords.x + thisModel.width/2)

    let yDiff
    if(thisCoords.y > otherCoords.y)
      yDiff = thisCoords.y - otherCoords.y
    else 
      yDiff = otherCoords.y - thisCoords.y

    distance = Math.sqrt(yDiff*yDiff + xDiff*xDiff)

    return distance
  }


  fighterWithinStrikingRange(fighter: Fighter){
    const thisCoords = this.fighterFighting.movement.coords
    const otherCoords = fighter.fighting.movement.coords

    const thisModelHeight: number = this.getModelDimensions(this.fighterFighting.modelState).height

    const otherModelHeight: number = this.getModelDimensions(fighter.fighting.modelState).height

    const twentyPercentOfThisHeight = thisModelHeight * 0.2
    const fourtyPercentOfThisHeight = thisModelHeight * 0.4

    const fourtyPercentOfOtherHeight = otherModelHeight * 0.4

    const thisAttackBoxTop = thisCoords.y + thisModelHeight - twentyPercentOfThisHeight
    const thisAttackBoxBottom = thisCoords.y + fourtyPercentOfThisHeight

    const otherHitBoxTop = otherCoords.y + otherModelHeight
    const otherHitBoxBottom = otherCoords.y + otherModelHeight - fourtyPercentOfOtherHeight

    const distance = this.getFighterDistanceAway(fighter)


    if (distance <= this.closeRange) {
      if (thisAttackBoxTop > otherHitBoxBottom && thisAttackBoxBottom < otherHitBoxTop)
        return true
    }

  }

  getModelDimensions(modelState: FighterModelState): Dimensions{
    return fighterModelImages.find(image => image.modelState == modelState).dimensions
  }
  
  getDirectionOfFighter(fighter: Fighter, opposite?: boolean): Direction360{
    if(fighter == null){
      debugger
    }
    const {movement, modelState} = this.fighterFighting
    const thisCoords = movement.coords
    const otherCoords = fighter.fighting.movement.coords

    const thisModelDimensions: Dimensions = this.getModelDimensions(modelState)
    
    const otherModelDimensions: Dimensions = this.getModelDimensions( fighter.fighting.modelState)

    let pos1: Coords = {...thisCoords}
    let pos2: Coords = {...otherCoords}
    /* 
    if(thisCoords.x < otherCoords.x){
      pos1.x += thisModelDimensions.width
    }
    else {      
      pos2.x += otherModelDimensions.width
    } */
    

    const direction: Direction360 = this.getDirectionOfPosition2FromPosition1(pos1, pos2)
    if(opposite){
      if(direction > 180){
        return (direction - 180) as Direction360
      }
      else {
        return (180 + direction) as Direction360
      }
    }
    return direction
  }
  getDirectionOfPosition2FromPosition1(pos1: Coords, pos2: Coords): Direction360{
    let directionOfPosition2FromPosition1: Direction360
    let xLength = pos2.x - pos1.x
    let yLength = pos2.y - pos1.y
    let adjacentSide
    let oppositeSide
    let addedDegrees
    if (xLength < 0 && yLength > 0) {
      oppositeSide = yLength
      adjacentSide = xLength * -1
      addedDegrees = 270
    }
    if (xLength < 0 && yLength < 0) {
      adjacentSide = yLength * -1
      oppositeSide = xLength * -1
      addedDegrees = 180
    }
    if (xLength > 0 && yLength < 0) {
      oppositeSide = yLength * -1
      adjacentSide = xLength
      addedDegrees = 90
    }
    if (xLength > 0 && yLength > 0) {
      adjacentSide = yLength
      oppositeSide = xLength
      addedDegrees = 0
    }
  
    const degrees = Math.round(Math.atan(oppositeSide / adjacentSide) * (180 / Math.PI))
    directionOfPosition2FromPosition1 = degrees + addedDegrees
  
    return directionOfPosition2FromPosition1
  }

  distanceFromFighter(fighter: Fighter){
    return this.getDistanceBetweenTwoPositions(this.fighterFighting.movement.coords, fighter.fighting.movement.coords)
  }
  
  getDistanceBetweenTwoPositions(pos1: Coords, pos2: Coords){
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y  - pos2.y, 2))
  }
};
