import FighterFighting from "./fighter-fighting";
import { random, getDirectionOfPosition2FromPosition1, getSmallestAngleBetween2Directions, getOppositeDirection } from "../../../helper-functions/helper-functions";
import Fighter from "../fighter";
import { octagon } from "../../abilities-general/fight/new-octagon";
import { Angle } from "../../../types/game/angle";
import { Closeness } from "../../../types/fighter/closeness";
export default class Flanking {
  constructor(public fighting: FighterFighting) { }

  retreatFromCorneredDirection: Angle

  determineIfFlanked() {
    
    const { proximity, logistics, rememberedEnemyBehind, stats } = this.fighting
    proximity.flanked = undefined
    proximity.trapped = false
    if(!rememberedEnemyBehind) return

    const enemyInFront = proximity.getClosestEnemyInFront()
    if(!enemyInFront) return

    const behindCloseness = proximity.getEnemyCombatCloseness(rememberedEnemyBehind)
    const inFrontCloseness = proximity.getEnemyCombatCloseness(enemyInFront)

    if(
      inFrontCloseness > Closeness['nearby'] || 
      behindCloseness > Closeness['nearby']
    ) return

    const inFrontAttacking = logistics.enemyAttackingThisFighter(enemyInFront)
    const behindAttacking = logistics.enemyAttackingThisFighter(rememberedEnemyBehind)

    proximity.flanked = {flankingFighters: [enemyInFront, rememberedEnemyBehind], severityRating: 0}



    if(
      inFrontCloseness == Closeness['nearby'] &&
      behindCloseness == Closeness['nearby']
    ){      
      proximity.flanked.severityRating = 2
      if(inFrontAttacking)
        proximity.flanked.severityRating += 2
      if(behindAttacking)
        proximity.flanked.severityRating = 2 + stats.intelligence
    }

    if(
      inFrontCloseness == Closeness['close'] && 
      behindCloseness == Closeness['nearby']
    ){
      proximity.flanked.severityRating = 4
      if(inFrontAttacking)
        proximity.flanked.severityRating += 4
      if(behindAttacking)
        proximity.flanked.severityRating = 2 + stats.intelligence
    }

    if(
      inFrontCloseness == Closeness['nearby'] && 
      behindCloseness == Closeness['close']
    ){
      proximity.flanked.severityRating += 4
      if(inFrontAttacking)
        proximity.flanked.severityRating += 4
      if(behindAttacking)
        proximity.flanked.severityRating += 2 + stats.intelligence
    }

    if(
      inFrontCloseness == Closeness['close'] || 
      behindCloseness == Closeness['close']
    ){
      proximity.flanked.severityRating += 6 + stats.intelligence
      if(inFrontAttacking)
        proximity.flanked.severityRating += 4
      if(behindAttacking)
        proximity.flanked.severityRating += 4 + stats.intelligence
    }

  }
  

  getRetreatFromFlankedDirection(): number{
  
    const {proximity, fighter, movement, logistics} = this.fighting
    if(logistics.retreatBetweenFlankersDirection){
      return logistics.retreatBetweenFlankersDirection
    }
    const {flankingFighters} = proximity.flanked

    const [fighter1, fighter2] = flankingFighters

    let directionAwayFrom2Enemies = getDirectionAwayFrom2Enemies(fighter1, fighter2)



    const directionTowardNearEdge = isDirectionTowardNearEdge(directionAwayFrom2Enemies)

    if(directionTowardNearEdge){
      
      const closeness1 = proximity.getClosenessBasedOnDistance(fighter1)
      const closeness2 = proximity.getClosenessBasedOnDistance(fighter2)
      const fighter1Attacking = logistics.enemyAttackingThisFighter(fighter1)
      const fighter2Attacking = logistics.enemyAttackingThisFighter(fighter2)
      if(
        closeness1 <= Closeness['close'] && closeness2 <= Closeness['close']
        &&
        fighter1Attacking && fighter2Attacking
      ){
        proximity.trapped = true
        console.log(`${fighter.name} flanked trapped`);
        this.fighting.timers.start('on a rampage')
      }
      else {
        directionAwayFrom2Enemies = getOppositeDirection(directionAwayFrom2Enemies)
        this.fighting.logistics.retreatBetweenFlankersDirection = directionAwayFrom2Enemies
        this.fighting.timers.start('retreat between flankers')
      }
    }
    return directionAwayFrom2Enemies


    /* functions */


    
  function getDirectionAwayFrom2Enemies(enemy1: Fighter, enemy2: Fighter){
    const awayFromEnemy1 = proximity.getDirectionOfEnemyCenterPoint(enemy1, true)
    const awayFromEnemy2 = proximity.getDirectionOfEnemyCenterPoint(enemy2, true)
    const {smallestAngle, crosses0} = getSmallestAngleBetween2Directions(awayFromEnemy1, awayFromEnemy2)

    
    const {biggest, smallest} = awayFromEnemy1 > awayFromEnemy2 ? {biggest: awayFromEnemy1, smallest: awayFromEnemy2} : { biggest: awayFromEnemy2, smallest: awayFromEnemy1}


    let directionAway
    if(crosses0){
      const num = smallest - (smallestAngle * .5)
      if(num < 0){
        directionAway = 360 + num
      }
      else {
        directionAway = num
      }
    } 
    else {
      directionAway = biggest - (smallestAngle * .5)
    }
    return directionAway

  }

  function isDirectionTowardNearEdge(directionAwayFrom2Enemies: number): boolean{
    const edges = proximity.getNearEdgesWithDistance(40)
    return edges.some(e => {
      const closestPointOnEdge = octagon.getClosestCoordsOnAnEdgeFromAPoint(e.edgeName, movement.coords)
      const directionOfEdge = getDirectionOfPosition2FromPosition1(movement.coords, closestPointOnEdge)
      const directionTowardEdge = proximity.isDirectionWithinDegreesOfDirection(directionAwayFrom2Enemies, 180, directionOfEdge) 
      return directionTowardEdge
    })
  }
  }
};

