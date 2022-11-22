import FighterFighting from "./fighter-fighting";
import { getDirectionOfPosition2FromPosition1, getSmallestAngleBetween2Directions, getOppositeDirection } from "../../../helper-functions/helper-functions";
import Fighter from "../fighter";
import { octagon } from "../../fight/octagon";
import { Angle } from "../../../types/game/angle";
import { Closeness } from "../../../types/fighter/closeness";



export default class Flanking {
  constructor(public fighting: FighterFighting) { }

  retreatFromCorneredDirection: Angle

  determineIfFlanked() {
    
    const { proximity, logistics, rememberedEnemyBehind, stats } = this.fighting

    let flanked: Flanked = false
    
    if(!rememberedEnemyBehind) return

    const enemyInFront = proximity.closestEnemyInFront
    if(!enemyInFront) return

    const behindCloseness = proximity.getEnemyCombatCloseness(rememberedEnemyBehind)
    const inFrontCloseness = proximity.getEnemyCombatCloseness(enemyInFront)

    if(
      inFrontCloseness > Closeness['nearby'] || 
      behindCloseness > Closeness['nearby']
    ) return

    const inFrontAttacking = logistics.isEnemyAttacking(enemyInFront)
    const behindAttacking = logistics.isEnemyAttacking(rememberedEnemyBehind)

    flanked = {flankingFighters: [enemyInFront, rememberedEnemyBehind], severityRating: 'low'}



    if(
      inFrontCloseness == Closeness['nearby'] &&
      behindCloseness == Closeness['nearby']
    ){      
      flanked.severityRating = 'medium'
      if(inFrontAttacking || behindAttacking)
        flanked.severityRating = 'high'
    }

    if(
      inFrontCloseness == Closeness['close'] && 
      behindCloseness == Closeness['nearby']
    ){
      flanked.severityRating = 'high'
      if(inFrontAttacking)
        flanked.severityRating = 'critical'
      if(behindAttacking)
        flanked.severityRating = 'very high'
    }

    if(
      inFrontCloseness == Closeness['nearby'] && 
      behindCloseness == Closeness['close']
    ){
      flanked.severityRating = 'high'
      if(inFrontAttacking)
        flanked.severityRating = 'very high'
      if(behindAttacking)
        flanked.severityRating = 'critical'
    }

    if(
      inFrontCloseness == Closeness['close'] || 
      behindCloseness == Closeness['close']
    ){
      flanked.severityRating = 'very high'
      if(inFrontAttacking || behindAttacking)
        flanked.severityRating = 'critical'
    }

    return flanked

  }
  

  getRetreatFromFlankedDirection(): number{
  
    const {proximity, fighter, logistics} = this.fighting
    
    const {flankingFighters} = logistics.flanked

    const [fighter1, fighter2] = flankingFighters

    let directionAwayFrom2Enemies = getDirectionAwayFrom2Enemies(fighter1, fighter2)



    const directionTowardNearEdge = proximity.isDirectionTowardNearEdge(directionAwayFrom2Enemies)

    if(directionTowardNearEdge){
      
      const closeness1 = proximity.getClosenessBasedOnDistance(fighter1)
      const closeness2 = proximity.getClosenessBasedOnDistance(fighter2)
      const fighter1Attacking = logistics.isEnemyAttacking(fighter1)
      const fighter2Attacking = logistics.isEnemyAttacking(fighter2)
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
      }
    }
    return directionAwayFrom2Enemies


    /* functions */


    
  function getDirectionAwayFrom2Enemies(enemy1: Fighter, enemy2: Fighter){
    const awayFromEnemy1 = proximity.getDirectionOfEnemyCenterPoint(enemy1, true)
    const awayFromEnemy2 = proximity.getDirectionOfEnemyCenterPoint(enemy2, true)
    const {angleBetween, crosses0} = getSmallestAngleBetween2Directions(awayFromEnemy1, awayFromEnemy2)

    
    const {biggest, smallest} = awayFromEnemy1 > awayFromEnemy2 ? {biggest: awayFromEnemy1, smallest: awayFromEnemy2} : { biggest: awayFromEnemy2, smallest: awayFromEnemy1}


    let directionAway
    if(crosses0){
      const num = smallest - (angleBetween * .5)
      if(num < 0){
        directionAway = 360 + num
      }
      else {
        directionAway = num
      }
    } 
    else {
      directionAway = biggest - (angleBetween * .5)
    }
    return directionAway

  }

  }
};

