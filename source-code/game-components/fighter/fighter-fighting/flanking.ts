import FighterFighting from "./fighter-fighting";
import Direction360 from "../../../types/figher/direction-360";
import { random, getDirectionOfPosition2FromPosition1, getDistanceBetweenTwoPoints } from "../../../helper-functions/helper-functions";
import Fighter from "../fighter";
import EdgeCoordDistance from "../../../interfaces/game/fighter/edge-coord-distance";
import Octagon from "../../fight/octagon";
import Flanker from "../../../interfaces/game/fighter/flanker";
import FlankingPair from "../../../interfaces/game/fighter/flanking-pair";
import { timer } from "rxjs";
import { Edge } from "../../../interfaces/game/fighter/edge";

export default class Flanking {
  constructor(public fighting: FighterFighting) { }

  retreatFromCorneredDirection: Direction360

  flankingEdgesInStikingRange(): Flanker[]{

    const {proximity} = this.fighting
    const closeFlankingEdges = proximity.flanked.flankingPairs.reduce(
      (closeFlankingEdges, flankingPair: FlankingPair) => {
        for(let key in flankingPair){
          const flanker: Flanker = flankingPair[key]
          if(
            (flanker.type == 'Edge' && 
            flanker.distance < proximity.strikingRange)
            &&
            !closeFlankingEdges.some((edge => edge.name == flanker.name))
          )
          closeFlankingEdges.push(flanker)
        }
        return closeFlankingEdges
      },[])
      
      return closeFlankingEdges

  }
  getRetreatFromCorneredDirection(): Direction360{
    const {proximity} = this.fighting
    const edges = this.flankingEdgesInStikingRange()
    edges[0]

    const enemyCoords = proximity.flanked.flankingPairs[0].flanker1.type == 'Fighter' ? 
    proximity.flanked.flankingPairs[0].flanker1.coords : proximity.flanked.flankingPairs[0].flanker2.coords

    const edge1AndEnemyDistace = getDistanceBetweenTwoPoints(edges[0].coords, enemyCoords)

    const edge2AndEnemyDistace = getDistanceBetweenTwoPoints(edges[1].coords, enemyCoords)

    if(edge1AndEnemyDistace > edge2AndEnemyDistace){
      return this.getRetreatAlongEdgeDirection(
        edges[0].name as Edge, 
        proximity.getOppositeDirection(edges[1].direction)
      )
    }
    if(edge2AndEnemyDistace > edge1AndEnemyDistace){

      return this.getRetreatAlongEdgeDirection(
        edges[1].name as Edge, 
        proximity.getOppositeDirection(edges[0].direction)
      )
    }
    
    
    return 
  }

  getSmallestAngleBetween2Directions(direction1: Direction360, direction2: Direction360){
    const {biggest, smallest} = direction1 > direction2 ? {biggest: direction1, smallest: direction2} : { biggest: direction2, smallest: direction1}
    
    if(biggest - smallest > 180)
      return 360 - biggest - smallest
    else
      return biggest - smallest
  }

  
  getRetreatAlongEdgeDirection(edgeName: Edge, initialDirection: Direction360): Direction360{
    const {point1, point2} = Octagon.edges[edgeName]
    const direction1 = getDirectionOfPosition2FromPosition1(point1, point2)
    const direction2 = getDirectionOfPosition2FromPosition1(point2, point1)

    let direction1DiffFromInitial = this.getSmallestAngleBetween2Directions(direction1, initialDirection)
      
    let direction2DiffFromInitial = this.getSmallestAngleBetween2Directions(direction2, initialDirection)


    const directionClosestToInitial = direction1DiffFromInitial < direction2DiffFromInitial ? direction1 : direction2


    return directionClosestToInitial as Direction360
  }


  getRetreatFromFlankedDirection(): Direction360 {

    const { logistics, proximity, timers } = this.fighting
    const { flanker1, flanker2 } = proximity.flanked.flankingPairs[0]

    const cornered = this.flankingEdgesInStikingRange().length == 2
    if(cornered && !this.retreatFromCorneredDirection){
      timers.start('retreat from cornered')
      this.retreatFromCorneredDirection = this.getRetreatFromCorneredDirection()
    }
    if(this.retreatFromCorneredDirection){
      return this.retreatFromCorneredDirection
    }

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
    const retreatingTowardEdge = logistics.isRetreatingTowardCloseEdge(result)
    if (retreatingTowardEdge)
      result = this.getRetreatAlongEdgeDirection(retreatingTowardEdge.edgeName, result)
    return result
  }



  isFlankedBy2Enemies(enemy1: Flanker, enemy2: Flanker): number {
    const {logistics, proximity} = this.fighting
    let criticality = 0
    if(this.isFlankedBy2Flankers(enemy1, enemy2)){
      const enemy1attacking = logistics.enemyAttackingThisFighter(enemy1.fighter)

      if(enemy1.distance < proximity.closeRange){
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

      if(enemy2.distance < proximity.closeRange){
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
  isFlankedBy1EnemyAnd1Edge(enemy: Flanker, edge: Flanker): number {
    const {logistics, proximity} = this.fighting
    let criticality = 0
    if(this.isFlankedBy2Flankers(enemy, edge)){
      const enemyAttacking = logistics.enemyAttackingThisFighter(enemy.fighter)

      if(enemy.distance < proximity.closeRange){
        if(enemyAttacking)
          criticality += 4
        else
          criticality += 2
      }
      else{
        if(enemyAttacking)
          criticality += 3
        else
          criticality += 1
      }      

      if(edge.distance < proximity.strikingRange)
        criticality += 2
      else
        criticality += 1
    }
    return criticality
  }

  determineIfFlanked() {
    const { movement, proximity, fighter, logistics } = this.fighting
    const flankingPairs: FlankingPair[] = []
    const modelWidth = proximity.getFighterModelDimensions(fighter, 'Idle').width

    const surroundingEnemies: Fighter[] = proximity.getSurroundingEnemies()

    /* const closestEdges: EdgeCoordDistance[] = Octagon.getAllEdgeDistanceAndCoordOnClosestEdge(movement.coords, modelWidth).filter(edge => edge.distance < proximity.closeRange)

    const edges: Flanker[] = closestEdges.map(edge => ({
      type: 'Edge',
      name: edge.edgeName,
      direction: getDirectionOfPosition2FromPosition1(movement.coords, edge.coords),
      distance: edge.distance,
      coords: edge.coords
    })) */

    const enemies: Flanker[] = surroundingEnemies.filter(enemy => proximity.getDistanceOfEnemyStrikingCenter(enemy) < proximity.nearbyRange).map(enemy => ({
      type: 'Fighter',
      name: enemy.name,
      direction: proximity.getDirectionOfEnemyCenterPoint(enemy),
      distance: proximity.getDistanceFromEnemyCenterPoint(enemy),
      fighter: enemy,
      coords: enemy.fighting.movement.coords
    }))

    //const sortedEdges = proximity.sortFlankersByClosest(edges)
    const sortedEnemies = proximity.sortFlankersByClosest(enemies)
    const allFlankersSorted = proximity.sortFlankersByClosest([/* ...edges, */ ...enemies])

    if(allFlankersSorted.length < 2){
      proximity.flanked = undefined
      return
    }
      

    let criticality = 0    
    let pairCriticallity 

    
    /* if(sortedEdges.length >= 1 && sortedEnemies.length >= 1){      
      pairCriticallity = this.isFlankedBy1EnemyAnd1Edge(sortedEnemies[0], sortedEdges[0])
      if(pairCriticallity){
        flankingPairs.push({flanker1: sortedEnemies[0], flanker2: sortedEdges[0]})
        criticality += pairCriticallity
      }
    }    
    
    if(sortedEdges.length >= 2 && sortedEnemies.length >= 1){   
      pairCriticallity = this.isFlankedBy1EnemyAnd1Edge(sortedEnemies[0], sortedEdges[1])
      if(pairCriticallity){
        flankingPairs.push({flanker1: sortedEnemies[0], flanker2: sortedEdges[1]})
        criticality += pairCriticallity
      }
    }
    
    if(sortedEdges.length >= 1 && sortedEnemies.length >= 2){   
      pairCriticallity = this.isFlankedBy1EnemyAnd1Edge(sortedEnemies[1], sortedEdges[0])
      if(pairCriticallity){
        flankingPairs.push({flanker1: sortedEnemies[1], flanker2: sortedEdges[0]})
        criticality += pairCriticallity
      }    
    }
    
    if(sortedEdges.length >= 2 && sortedEnemies.length >= 2){   
      pairCriticallity = this.isFlankedBy1EnemyAnd1Edge(sortedEnemies[1], sortedEdges[1])
      if(pairCriticallity){
        flankingPairs.push({flanker1: sortedEnemies[1], flanker2: sortedEdges[1]})
        criticality += pairCriticallity
      }
    } */


    if(sortedEnemies.length >= 2){
      pairCriticallity = this.isFlankedBy2Enemies(sortedEnemies[0], sortedEnemies[1])
      if(pairCriticallity){
        flankingPairs.push({flanker1: sortedEnemies[0], flanker2: sortedEnemies[1]})
        criticality += pairCriticallity
      }   
    } 
    
    if(sortedEnemies.length >= 3){
      pairCriticallity = this.isFlankedBy2Enemies(sortedEnemies[0], sortedEnemies[2])
      if(pairCriticallity){
        flankingPairs.push({flanker1: sortedEnemies[0], flanker2: sortedEnemies[2]})
        criticality += pairCriticallity
      }
      pairCriticallity = this.isFlankedBy2Enemies(sortedEnemies[1], sortedEnemies[2])
      if(pairCriticallity){
        flankingPairs.push({flanker1: sortedEnemies[1], flanker2: sortedEnemies[2]})
        criticality += pairCriticallity
      }
    }


    if(criticality == 0)
      proximity.flanked = undefined
    else
      proximity.flanked = {
        flankingPairs,
        criticality
      }
  }

  getFlankingFighters(): Fighter[]{
    return this.fighting.proximity.flanked.flankingPairs.reduce((fighters, flankingPair: FlankingPair) => {
      if(flankingPair.flanker1.type == 'Fighter' &&
      !fighters.some(fighter => fighter.name == flankingPair.flanker1.fighter.name))
        fighters.push(flankingPair.flanker1.fighter)
        
      if(flankingPair.flanker2.type == 'Fighter' &&
      !fighters.some(fighter => fighter.name == flankingPair.flanker2.fighter.name))
        fighters.push(flankingPair.flanker2.fighter)
      
      return fighters
    }, [])
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
