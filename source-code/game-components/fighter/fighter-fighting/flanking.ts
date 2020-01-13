import FighterFighting from "./fighter-fighting";
import Direction360 from "../../../types/figher/direction-360";
import { random, getDirectionOfPosition2FromPosition1, getDistanceBetweenTwoPoints } from "../../../helper-functions/helper-functions";
import Fighter from "../fighter";
import { Closeness } from "../../../types/figher/closeness";
import EdgeCoordDistance from "../../../interfaces/game/fighter/edge-coord-distance";
import Octagon from "../../fight/octagon";
import Flanker from "../../../interfaces/game/fighter/flanker";

export default class Flanking {
  constructor(private fighting: FighterFighting){}

  getRetreatFromFlankedDirection(): Direction360{

    const {flanked, movement} = this.fighting
    const {coords} = movement
    const {flanker1, flanker2} = flanked
    
    let big
    let small
    if(flanker1.direction > flanker2.direction){
      big = flanker1.direction
      small = flanker2.direction
    }
    else {
      big = flanker2.direction
      small = flanker1.direction
    }
    
    const angle1 = big - small
    let result
    if(angle1 == 180){
      let option1 = big - 90
      let option2
      if(big < 270)
        option2 = big + 90
      else 
        option2 = small - 90

      result = !!random(1) ? option1 : option2
    }
    if(angle1 > 180){
      result = big - Math.round(angle1 / 2)
    }
    else{
      result = big - Math.round((360 - angle1) / 2) - angle1
      if(result < 0)
        result = 360 + result
    }
    if(isNaN(result) || result > 360){
      debugger
    }
    return result
  }

  
  isEnemyNearbyAndAttacking(enemy: Fighter): boolean{
    const {proximity} = this.fighting
    const {enemyTargetedForAttack} = enemy.fighting.combat   
    const closeness = proximity.getEnemyCombatCloseness(enemy)   
    if(enemyTargetedForAttack){
      if (enemyTargetedForAttack.name == this.fighting.fighter.name &&  closeness <= Closeness['nearby']
      )
      return true
    }
  }

  determineIfFlanked() {    
    const {movement, modelState, proximity} = this.fighting

    const closestEnemyInFront: Fighter = proximity.getClosestEnemyInfront()

    const modelWidth = proximity.getModelDimensions(modelState).width
    const closestEdgeWithClosestCoords: EdgeCoordDistance = Octagon.getClosestDistanceAndCoordOnClosestEdge(movement.coords, modelWidth)

    let edgeIsClose: Flanker
    if(proximity.getClosenessBasedOnDistance(closestEdgeWithClosestCoords.distance) <= Closeness['striking range'])
      edgeIsClose = {
        type: 'Edge',
        position: proximity.isFacingCoods(closestEdgeWithClosestCoords.coords) ? 'Infront' : 'Behind',
        name: closestEdgeWithClosestCoords.edgeName,
        direction: getDirectionOfPosition2FromPosition1(movement.coords, closestEdgeWithClosestCoords.coords),
        distance: closestEdgeWithClosestCoords.distance
      }

    let behindEnemyCloseAndAttacking: Flanker
    if(proximity.rememberedEnemyBehind){
      if(this.isEnemyNearbyAndAttacking(proximity.rememberedEnemyBehind))
      behindEnemyCloseAndAttacking = {
        type: 'Fighter',
        fighter: proximity.rememberedEnemyBehind,
        position: 'Behind',
        name: proximity.rememberedEnemyBehind.name,
        direction: proximity.getDirectionOfFighter(proximity.rememberedEnemyBehind),
        distance: getDistanceBetweenTwoPoints(movement.coords, proximity.rememberedEnemyBehind.fighting.movement.coords)
      }
    }    

    let infrontEnemyCloseAndAttacking: Flanker
    if(closestEnemyInFront){
      if(this.isEnemyNearbyAndAttacking(closestEnemyInFront))
        infrontEnemyCloseAndAttacking = {
          type: 'Fighter',
          fighter: closestEnemyInFront,
          position: 'Infront',
          name: closestEnemyInFront.name,
          direction: proximity.getDirectionOfFighter(closestEnemyInFront),
          distance: getDistanceBetweenTwoPoints(movement.coords, closestEnemyInFront.fighting.movement.coords)
        }
    }


    let isFlankedByBehindAndEdge: boolean
    if(edgeIsClose && behindEnemyCloseAndAttacking)
      isFlankedByBehindAndEdge = this.isFlankedBy2Directions(edgeIsClose.direction, behindEnemyCloseAndAttacking.direction)   
    

    let isFlankedByInfrontAndEdge: boolean
    if(edgeIsClose && infrontEnemyCloseAndAttacking)
    isFlankedByInfrontAndEdge = this.isFlankedBy2Directions(edgeIsClose.direction, infrontEnemyCloseAndAttacking.direction)

    
    let isFlankedByInfrontAndBehind: boolean
    if(infrontEnemyCloseAndAttacking && behindEnemyCloseAndAttacking)
    isFlankedByInfrontAndBehind = this.isFlankedBy2Directions( infrontEnemyCloseAndAttacking.direction, behindEnemyCloseAndAttacking.direction)



    if(
      isFlankedByBehindAndEdge && isFlankedByInfrontAndEdge && isFlankedByInfrontAndBehind
      || 
      isFlankedByBehindAndEdge && isFlankedByInfrontAndEdge
      ||
      isFlankedByInfrontAndEdge && isFlankedByInfrontAndBehind
      ||
      isFlankedByInfrontAndEdge && isFlankedByInfrontAndBehind
      ){
      const {closest, secondClosest} = this.whichFlankersAreClosest([edgeIsClose, behindEnemyCloseAndAttacking, infrontEnemyCloseAndAttacking])
      this.fighting.flanked = {
        flanker1: closest, flanker2: secondClosest
      } 
    }
    else if(isFlankedByBehindAndEdge)
      this.fighting.flanked = {
        flanker1: edgeIsClose, 
        flanker2: behindEnemyCloseAndAttacking
      }
    else if(isFlankedByInfrontAndEdge)
      this.fighting.flanked = {
        flanker1: edgeIsClose, 
        flanker2: infrontEnemyCloseAndAttacking
      }
    else if(isFlankedByInfrontAndBehind)
      this.fighting.flanked = {
        flanker1: infrontEnemyCloseAndAttacking, 
        flanker2: behindEnemyCloseAndAttacking
      }
    else {
      this.fighting.flanked = undefined
      this.fighting.trapped = false
    }


    const {flanked} = this.fighting
    if(flanked){
      const {flanker1, flanker2} = flanked
      const flanker1IsVeryClose = flanker1.type == 'Fighter' ? proximity.enemyWithinStrikingRange(flanker1.fighter) : proximity.getClosenessBasedOnDistance(flanker1.distance) == Closeness['striking range']
      
      const flanker2IsVeryClose = flanker2.type == 'Fighter' ? proximity.enemyWithinStrikingRange(flanker2.fighter) : proximity.getClosenessBasedOnDistance(flanker2.distance) == Closeness['striking range']
    
      if(flanker1IsVeryClose && flanker2IsVeryClose)
      this.fighting.trapped = true
      
    }

  }


  whichFlankersAreClosest(flankers: Flanker[]): {closest: Flanker, secondClosest: Flanker}{
    return flankers.reduce((returnObj, flanker) => {
      if(!returnObj.closest)
        returnObj.closest = flanker        
      else if(flanker.distance < returnObj.closest.distance){
        returnObj.secondClosest = returnObj.closest
        returnObj.closest = flanker
      }
      else if(!returnObj.secondClosest)
        returnObj.secondClosest = flanker        
      else if(flanker.distance < returnObj.secondClosest.distance){
        returnObj.secondClosest = flanker
      }      
      return returnObj
    },{closest: null, secondClosest: null})
  }

  isFlankedBy2Directions(direction1: Direction360, direction2: Direction360): boolean{

    if(
      direction1 >= 180 && direction2 < 180 ||
      direction2 >= 180 && direction1 < 180
    )
      return true
    
    if(
      direction1 >= 180  && direction2 >= 180 ||
      direction1 < 180  && direction2 < 180    
    ){
      let degreeBetween = direction1 - direction2
      degreeBetween = degreeBetween < 0 ? degreeBetween * -1 : degreeBetween
      if(degreeBetween > 100)
        return true
    }
  }


};
