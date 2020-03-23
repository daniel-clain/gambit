import FighterFighting from "./fighter-fighting";
import Direction360 from "../../../types/figher/direction-360";
import { random } from "../../../helper-functions/helper-functions";
import Fighter from "../fighter";
import Flanker from "../../../interfaces/game/fighter/flanker";
import FlankingPair from "../../../interfaces/game/fighter/flanking-pair";
import { getDistanceOfEnemyStrikingCenter, closeRange, nearbyRange } from "./proximity";

export default class Flanking {
  constructor(public fighting: FighterFighting) { }

  retreatFromCorneredDirection: Direction360

  getRetreatFromFlankedDirection(): Direction360 {

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
    const { proximity, fighter } = this.fighting

    const surroundingEnemies: Fighter[] = proximity.getSurroundingEnemies()

    const enemies: Flanker[] = surroundingEnemies.filter(enemy => getDistanceOfEnemyStrikingCenter(enemy, fighter) < nearbyRange).map(enemy => ({
      type: 'Fighter',
      name: enemy.name,
      direction: proximity.getDirectionOfEnemyCenterPoint(enemy),
      distance: proximity.getDistanceFromEnemyCenterPoint(enemy),
      fighter: enemy,
      coords: enemy.fighting.movement.coords
    }))

    const sortedEnemies = proximity.sortFlankersByClosest(enemies)

    if(enemies.length < 2){
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

    //flankingPairs.push({flanker1: sortedEnemies[0], flanker2: sortedEnemies[1]})
    //criticality = 1

    if(criticality == 0)
      proximity.flanked = undefined
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
