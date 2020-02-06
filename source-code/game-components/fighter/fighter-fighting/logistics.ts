import FighterFighting from "./fighter-fighting"
import { MoveAction } from "../../../types/figher/action-name"
import Fighter from "../fighter"
import Octagon from "../../fight/octagon"
import { getDirectionOfPosition2FromPosition1 } from "../../../helper-functions/helper-functions"
import { Closeness } from "../../../types/figher/closeness"
import EdgeCoordDistance from "../../../interfaces/game/fighter/edge-coord-distance"
import Direction360 from "../../../types/figher/direction-360"

export default class Logistics {

  noCombatForAWhile: boolean
  justTurnedAround: boolean
  justDidAttack: boolean
  justBlocked: boolean
  justDodged: boolean
  justTookHit: boolean
  onARampage: boolean
  memoryOfEnemyBehind: Fighter
  moveActionInProgress: MoveAction


  constructor(public fighting: FighterFighting){}
  
  isARetreatInProgress(): boolean{

    const retreatActions: MoveAction[] = ['retreat', 'cautious retreat', 'fast retreat', 'retreat from flanked']
    
    return retreatActions.some(moveAction => moveAction == this.moveActionInProgress)
  }

  isRetreatingTowardCloseEdge(retreatingDirection: Direction360): EdgeCoordDistance{
    const {proximity, movement, fighter} = this.fighting
    const {width} = proximity.getFighterModelDimensions(fighter, 'Idle')
    const nearestEdges: EdgeCoordDistance[] = proximity.sortEdgesByClosest(Octagon.getAllEdgeDistanceAndCoordOnClosestEdge(movement.coords, width))
    
    const retreatingTowardEdge = nearestEdges.find(edge => {
      const edgeCloseness = proximity.getClosenessBasedOnDistance(edge.distance)
      const directionTowardNearestEdge = getDirectionOfPosition2FromPosition1(movement.coords, edge.coords)
      const retreatingInDirectionOfEdge = proximity.isDirectionWithin90DegreesOfDirection(retreatingDirection, directionTowardNearestEdge)
  
      if(retreatingInDirectionOfEdge && edgeCloseness == Closeness['striking range'])
        return true
    })
    
    return retreatingTowardEdge
  }

  

  flankingFighterIsInStrikingRange(): boolean{
    const {proximity, flanking} = this.fighting
    const closestFlankingFighter: Fighter = proximity.sortFightersByClosest(flanking.getFlankingFighters())[0]
    return proximity.enemyWithinStrikingRange(closestFlankingFighter)
  }

  enemyAttackingThisFighter(enemy: Fighter): boolean{
    const {name} = this.fighting.fighter
    const {enemyTargetedForAttack} = enemy.fighting
    return enemyTargetedForAttack && enemyTargetedForAttack.name == name
  }


  enemyIsAttackingOrDefending(enemy: Fighter){
    const {logistics, animation} = enemy.fighting
    return (
      animation.inProgress == 'punching' || 
      animation.inProgress == 'critical striking' ||
      animation.inProgress == 'defending' ||
      logistics.moveActionInProgress == 'cautious retreat'
    )
  }

  hadNoCombatForAWhile(): boolean{
    return this.fighting.actions.noCombatForAWhile
  }

  hasJustTurnedAround(): boolean{  
    return this.fighting.timers.activeTimers.some(timer => timer.name == 'just turned around')
  }

  hasLowStamina(): boolean{
    const {stamina, stats} = this.fighting
    return stamina < stats.maxStamina * .5
  }

  hasLowSpirit(): boolean{
    const {spirit, stats} = this.fighting
    return spirit < stats.maxSpirit * .5
  }

  hasFullStamina(): boolean{
    const {stamina, stats} = this.fighting
    return stamina == stats.maxStamina
  }
  hasFullSpirit(): boolean{
    const {spirit, stats} = this.fighting
    return spirit == stats.maxSpirit
  }


  enemyIsOnARampage(enemy: Fighter): boolean{
    return enemy.fighting.timers.activeTimers.some(timer => timer.name == 'on a rampage')
  }

  enemyHasLowSpirit(enemy: Fighter): boolean{
    const {spirit} = enemy.fighting
    const {maxSpirit} = enemy.fighting.stats
    return spirit < (maxSpirit / 2)
  }

  enemyHasLowStamina(enemy: Fighter): boolean{
    const {stamina} = enemy.fighting
    const {maxStamina} = enemy.fighting.stats
    return stamina < (maxStamina / 2)
  }

  isEnemyTargetingThisFighter(enemy: Fighter): boolean{
    const enemyTargeting = enemy.fighting.enemyTargetedForAttack
    const thisFighterName = this.fighting.fighter.name
    return enemyTargeting && enemyTargeting.name == thisFighterName
  }

  
  allOtherFightersAreKnockedOut(): boolean{
    return this.fighting.otherFightersInFight.every((fighter: Fighter) => fighter.fighting.knockedOut)
  } 
  
  otherFightersStillFighting(): Fighter[]{
    return this.fighting.otherFightersInFight.filter(fighter => !fighter.fighting.knockedOut)
  }

  hasRetreatOpportunity(enemy: Fighter): boolean{
    const enemyAction = enemy.fighting.animation.inProgress
    if(this.fighting.proximity.getEnemyCombatCloseness(enemy) != Closeness['striking range']){
      console.error('should used if enemy not in striking range');
      debugger
      return 
    }
    return (
      this.enemyJustAttacked(enemy) ||
      enemyAction == 'recovering' || 
      enemyAction == 'defending'
    )
  }

  enemyJustAttacked(enemy: Fighter){
    return enemy.fighting.logistics.justDidAttack
  }

  hasAttackOpportunity(enemy: Fighter): boolean{
    const {proximity} = this.fighting
    const enemyAction = enemy.fighting.animation.inProgress
    if(this.fighting.proximity.getEnemyCombatCloseness(enemy) != Closeness['striking range']){
      console.error('should used if enemy not in striking range');
      debugger
      return 
    }
    return (
      this.justDodged || 
      this.justBlocked || 
      this.justTookHit ||
      enemyAction == 'recovering' || 
      enemyAction != 'defending'

    )
  
  }
    

};
