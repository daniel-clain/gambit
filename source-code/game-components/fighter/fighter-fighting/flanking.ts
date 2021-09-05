import FighterFighting from "./fighter-fighting";
import { random, getDirectionOfPosition2FromPosition1 } from "../../../helper-functions/helper-functions";
import Fighter from "../fighter";
import Flanker from "../../../interfaces/game/fighter/flanker";
import FlankingPair from "../../../interfaces/game/fighter/flanking-pair";
import { getDistanceOfEnemyStrikingCenter, closeRange, nearbyRange } from "./proximity";
import { octagon } from "../../abilities-general/fight/new-octagon";
import { Angle } from "../../../types/game/angle";
import { Closeness } from "../../../types/fighter/closeness";
export default class Flanking {
  constructor(public fighting: FighterFighting) { }

  retreatFromCorneredDirection: Angle

  determineIfTrapped(){
    //console.log(`${this.fighting.fighter.name} trapped? testx`);
    const {proximity, movement} = this.fighting
    const fighterIsBetween2CloseEnemies = this.areNearestFlankersClose()
    const retreatFromFlankedDirection = this.getRetreatFromFlankedDirection()

    if(fighterIsBetween2CloseEnemies){

      const closestEnemiesSorted = proximity.sortFightersByClosest(proximity.getSurroundingEnemies())

      if(closestEnemiesSorted.length >= 3){
        const thirdClosestEnemyCoords = closestEnemiesSorted[2].fighting.movement.coords
        const directionOf3rdClosetEnemy = getDirectionOfPosition2FromPosition1(movement.coords, thirdClosestEnemyCoords)      
        const retreatFromFlankedIsToward3rdEnemy: boolean = proximity.isDirectionWithinDegreesOfDirection(retreatFromFlankedDirection, 120, directionOf3rdClosetEnemy)
        const thirdEnemyCloseness: Closeness = proximity.getEnemyCombatCloseness(closestEnemiesSorted[2])

        if(retreatFromFlankedIsToward3rdEnemy && thirdEnemyCloseness <= Closeness['close']){      
          proximity.trapped = true
          this.fighting.timers.start('on a rampage')
          return
        }
      }
        
      const directionOfClosestEdge: number = octagon.getDirectionToClosestEdge(movement.coords)
       const distanceOfEdge = proximity.getNearestEdge()?.distance
       if(!distanceOfEdge) return
      const retreatFromFlankedIsTowardCloseEdge: boolean = proximity.isDirectionWithinDegreesOfDirection(retreatFromFlankedDirection, 120, directionOfClosestEdge)
      const closestEdgeCloseness = proximity.getClosenessBasedOnDistance(distanceOfEdge)


      if(retreatFromFlankedIsTowardCloseEdge && closestEdgeCloseness <= Closeness['striking range']){
        proximity.trapped = true
        this.fighting.timers.start('on a rampage')
      }
    }

      

  }

  areNearestFlankersClose(): boolean{
    const {proximity} = this.fighting
    const {flanker1, flanker2} = proximity.flanked.flankingPairs[0]
    const fighter1Closeness = proximity.getEnemyCombatCloseness(flanker1.fighter)
    const fighter2Closeness = proximity.getEnemyCombatCloseness(flanker2.fighter)

    return fighter1Closeness <= Closeness['close'] && fighter2Closeness <= Closeness['close']

  }

  getRetreatFromFlankedDirection(): Angle {

    const { proximity } = this.fighting
    const { flanker1, flanker2 } = proximity.flanked.flankingPairs[0]


    const flanker1Direction = flanker1.type == 'Fighter' ? proximity.getDirectionOfEnemyCenterPoint(flanker1.fighter) : flanker1.direction
    const flanker2Direction = flanker2.type == 'Fighter' ? proximity.getDirectionOfEnemyCenterPoint(flanker2.fighter) : flanker2.direction


    let big
    let small
    if (flanker1Direction > flanker2Direction) {
      big = flanker1Direction
      small = flanker2Direction
    }
    else {
      big = flanker2Direction
      small = flanker1Direction
    }

    const angle1 = big - small
    let result
    if (angle1 == 180) {
      let option1 = big - 90
      let option2
      if (big < 270)
        option2 = big + 90
      else
        option2 = small - 90

      result = !!random(1) ? option1 : option2
    }
    if (angle1 > 180) {
      result = big - Math.round(angle1 / 2)
    }
    else {
      result = big - Math.round((360 - angle1) / 2) - angle1
      if (result < 0)
        result = 360 + result
    }
    return result
  }

  isFlankedBy2Enemies(enemy1: Flanker, enemy2: Flanker): number {
    const {logistics, proximity} = this.fighting
    let criticality = 0
    if(this.isFlankedBy2Flankers(enemy1, enemy2)){
      const enemy1attacking = logistics.enemyAttackingThisFighter(enemy1.fighter)

      if(enemy1.distance < closeRange){
        if(enemy1attacking)
          criticality += 4
        else
          criticality += 2
      }
      else{
        if(enemy1attacking)
          criticality += 3
        else
          criticality += 1
      }
      
      const enemy2attacking = logistics.enemyAttackingThisFighter(enemy2.fighter)

      if(enemy2.distance < closeRange){
        if(enemy2attacking)
          criticality += 4
        else
          criticality += 2
      }
      else{
        if(enemy2attacking)
          criticality += 3
        else
          criticality += 1
      }
    }
    return criticality
  }

  determineIfFlanked() {
    
    //console.log(`${this.fighting.fighter.name} flanked? testx`);
    const { proximity, fighter } = this.fighting

    const surroundingEnemies: Fighter[] = proximity.getSurroundingEnemies()

    const nearbyEnemyFlankers: Flanker[] = surroundingEnemies.filter(enemy => getDistanceOfEnemyStrikingCenter(enemy, fighter) < nearbyRange).map(enemy => ({
      type: 'Fighter',
      name: enemy.name,
      direction: proximity.getDirectionOfEnemyCenterPoint(enemy),
      distance: proximity.getDistanceFromEnemyCenterPoint(enemy),
      fighter: enemy,
      coords: enemy.fighting.movement.coords
    }))

    const sortedEnemies = proximity.sortFlankersByClosest(nearbyEnemyFlankers)

    if(nearbyEnemyFlankers.length < 2){
      proximity.flanked = undefined
      return
    }
      


    const flankingPairs: FlankingPair[] = []
    let criticality = 0    


    if(sortedEnemies.length >= 2){
      const pairCriticallity = this.isFlankedBy2Enemies(sortedEnemies[0], sortedEnemies[1])
      if(pairCriticallity){
        flankingPairs.push({flanker1: sortedEnemies[0], flanker2: sortedEnemies[1]})
        criticality += pairCriticallity
      }   
    } 
    
    if(sortedEnemies.length >= 3){
      {
        const pairCriticallity = this.isFlankedBy2Enemies(sortedEnemies[0], sortedEnemies[2])
        if(pairCriticallity){
          flankingPairs.push({flanker1: sortedEnemies[0], flanker2: sortedEnemies[2]})
          criticality += pairCriticallity
        }
      }
      {
        const pairCriticallity = this.isFlankedBy2Enemies(sortedEnemies[1], sortedEnemies[2])
        if(pairCriticallity){
          flankingPairs.push({flanker1: sortedEnemies[1], flanker2: sortedEnemies[2]})
          criticality += pairCriticallity
        }
      }
    }

    if(
      flankingPairs.length >= 2 && (
        (flankingPairs[0].flanker1.name == flankingPairs[1].flanker1.name ||
        flankingPairs[0].flanker1.name == flankingPairs[1].flanker2.name) &&
        (flankingPairs[0].flanker2.name == flankingPairs[1].flanker1.name ||
          flankingPairs[0].flanker2.name == flankingPairs[1].flanker2.name)
      )
    )
      debugger

    if(criticality == 0){
      proximity.flanked = undefined
      proximity.trapped = false
    }
    else
      proximity.flanked = {
        flankingPairs,
        criticality
      }
  }

  private isFlankedBy2Flankers(flanker1: Flanker, flanker2: Flanker): boolean {
    const direction1 = flanker1.direction
    const direction2 = flanker2.direction
    if (
      (flanker1.type == 'Fighter' && flanker2.type == 'Fighter') 
      &&
      (direction1 >= 180 && direction2 < 180 ||
      direction2 >= 180 && direction1 < 180)
    )
      return true

  
    let degreeBetween = direction1 - direction2
    degreeBetween = degreeBetween < 0 ? degreeBetween * -1 : degreeBetween
    if (degreeBetween > 100)
      return true

    return false
  }

};
