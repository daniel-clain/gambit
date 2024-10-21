import FighterFighting from "./fighter-fighting"

import Fighter from "../fighter"
import { canDefendActions, MoveAction } from "../../../types/fighter/action-name"
import { Closeness } from "../../../types/fighter/closeness"
import { farRange, getDistanceOfEnemyStrikingCenter, isEnemyFacingAway, isFacingAwayFromEnemy, strikingRange } from "./proximity"
import { Flanked, PersistPastFlanker } from "../../../types/fighter/flanked"
import { Angle } from "../../../types/game/angle"
import { getRetreatDirection } from "./fighter-retreat"
import { Percent, toPercent } from "../../../types/game/percent"

export default class Logistics {

  constructor(public fighting: FighterFighting){}

  hadActionRecently: boolean
  justTurnedAround: boolean
  justDidAttack: boolean
  justBlocked: boolean
  justDodged: boolean
  justTookHit: boolean
  rememberedEnemyBehind: Fighter
  persistDirection: Angle
  trapped: boolean


  get timeSinceLastCombat(){
    const {timers} = this.fighting
    return timers.get('last combat action').timeElapsed
  }


  get hasFullEnergy(): boolean{
    const {energy, stats} = this.fighting
    return energy == stats.maxEnergy
  }
  get hasFullSpirit(): boolean{
    const {spirit, stats} = this.fighting
    return spirit == stats.maxSpirit
  }
  get hasFullStamina(): boolean{
    const {stamina, stats} = this.fighting
    return stamina == stats.maxStamina
  }

  get flanked(): Flanked | undefined{
    const {proximity} = this.fighting
    if(
      !this.rememberedEnemyBehind || 
      !this.closestEnemyInFront
    ) return

    if(this.closestEnemyInFront.name == this.rememberedEnemyBehind.name){
      debugger
    }

    const enemy2Closeness = proximity.getEnemyCombatCloseness(this.rememberedEnemyBehind)
    const enemy1Closeness = proximity.getEnemyCombatCloseness(this.closestEnemyInFront)

    if(
      enemy1Closeness > Closeness['nearby'] || 
      enemy2Closeness > Closeness['nearby']
    ) return

    return {flankers: [this.closestEnemyInFront, this.rememberedEnemyBehind]}
  }

  get highestThreatEnemy(): Fighter{
    
    const {fighter} = this.fighting
    const enemyInFront = this.closestEnemyInFront
    const enemyBehind = this.rememberedEnemyBehind

    if(!enemyInFront || !enemyBehind) 
      return 

    if(!enemyBehind)
      return enemyInFront

    if(!enemyInFront)
      return enemyBehind


    const inFrontDistance = getDistanceOfEnemyStrikingCenter(enemyInFront, fighter)
    const behindDistance = getDistanceOfEnemyStrikingCenter(enemyBehind, fighter)

    const inFrontThreat = this.isEnemyAttacking(enemyInFront) ? inFrontDistance : inFrontDistance * .3
    const behindThreat = this.isEnemyAttacking(enemyBehind) ? behindDistance : behindDistance * .3

    return inFrontThreat > behindThreat ? enemyInFront : enemyBehind
  }


  get onARampage(): boolean{
    const {timers} = this.fighting    
    return timers.get('on a rampage').active
  }
  
  get highEnergy(){
    return this.fighting.energy > 8
  }
  get lowEnergy(){
    return this.fighting.energy <= 2
  }

  
  get enemiesInFront(){  
    const {movement} = this.fighting
    const thisX = movement.coords.x 

    const fightersInFront: Fighter[] = this.otherFightersStillFighting.filter((fighter: Fighter) => {  
      const otherX = fighter.fighting.movement.coords.x    
  
      if(this.fighting.facingDirection == 'left'){        
        return otherX <= thisX
      }
      if(this.fighting.facingDirection == 'right'){        
        return otherX >= thisX
      }
    })
    
    return fightersInFront
  }


  get otherFightersStillFighting(): Fighter[]{
    return this.fighting.otherFightersInFight.filter(fighter => !fighter.fighting.knockedOut)
  }


  get hasLowStamina(): boolean{
    const {stamina, stats} = this.fighting
    return stamina < stats.maxStamina * .5
  }

  get hasLowSpirit(): boolean{
    const {spirit, stats} = this.fighting
    return spirit < stats.maxSpirit * .5
  }

  /**
   * 
   * @param enemy 
   * @returns threatRating: number
   * @description the closer the enemy is, the bigger threat they are, multiplied if they're attacking
   */
   getEnemyThreatPercentage(enemy: Fighter): Percent {
    const {proximity} = this.fighting

    const distance = proximity.getDistanceFromEnemyCenterPoint(enemy)
    if(distance < strikingRange){
      return 1
    }
    if(distance > farRange){
      return 0
    }
    
    const isAttacking = this.isEnemyAttacking(enemy) 
    const distancePercentage = toPercent((distance-strikingRange)/(farRange-strikingRange))
    const closenessExponentialFactor = isAttacking ? 1.6 : 1.3
    
    const exponentialDistancePercentage = toPercent(Math.pow(distancePercentage, closenessExponentialFactor))

    const inverseExponentialDistancePercentage = toPercent(1 - exponentialDistancePercentage)

    return inverseExponentialDistancePercentage
  }

  getHasDefendOpportunity(enemy: Fighter): boolean{
    const {fighter, actions} = this.fighting
    if(isFacingAwayFromEnemy(enemy, fighter)) 
      return false
    return !!canDefendActions.find(a => a == actions.currentInterruptibleAction)
  }
  

  get closestEnemyInFront(){
    const {facingDirection, movement, logistics, proximity} = this.fighting
    const otherFighters = logistics.otherFightersStillFighting
    const closestEnemy = otherFighters.reduce(
      (selectedFighter: Fighter, loopFighter) => {
        const loopFighterLeft = loopFighter.fighting.movement.coords.x
        const loopFighterDistance = proximity.getDistanceFromEnemyCenterPoint(loopFighter)
        if(!selectedFighter){
          if(facingDirection == 'left'){
            if(loopFighterLeft < movement.coords.x){
              return loopFighter
            }
            else return selectedFighter
          } 
          if(facingDirection == 'right'){
            if(loopFighterLeft > movement.coords.x){
              return loopFighter
            }
            else return selectedFighter
          }
        }
        else {
          const selectedFighterDistance = proximity.getDistanceFromEnemyCenterPoint(selectedFighter)
          if(facingDirection == 'left'){
            if(loopFighterLeft < movement.coords.x){
              const loopFighterCloser = loopFighterDistance < selectedFighterDistance
              return loopFighterCloser ? loopFighter : selectedFighter
            }
            else return selectedFighter
          } 
          if(facingDirection == 'right'){
            if(loopFighterLeft > movement.coords.x){
              const loopFighterCloser = loopFighterDistance < selectedFighterDistance
              return loopFighterCloser ? loopFighter : selectedFighter
            }
            else return selectedFighter
          }
        }
        
      }, null
    )
    if(closestEnemy && closestEnemy.name == this.rememberedEnemyBehind?.name){
      debugger
    }
    return closestEnemy
  }

  get closestRememberedEnemy(): Fighter{
    const {proximity} = this.fighting
    let enemyBehind = this.rememberedEnemyBehind
    if(!this.closestEnemyInFront && !enemyBehind)
      return
    if(this.closestEnemyInFront && !enemyBehind)
      return this.closestEnemyInFront
    if(!this.closestEnemyInFront && enemyBehind)
      return enemyBehind
    

    const inFrontEnemyDistance = proximity.getDistanceFromEnemyCenterPoint(this.closestEnemyInFront)
    
    const behindEnemyDistance = proximity.getDistanceFromEnemyCenterPoint(enemyBehind)
    
    const closestEnemy =  inFrontEnemyDistance < behindEnemyDistance ? this.closestEnemyInFront : enemyBehind
    if(!closestEnemy){
      debugger
    }
    return closestEnemy
  }


  get allOtherFightersAreKnockedOut(): boolean{
    return this.fighting.otherFightersInFight.every((fighter: Fighter) => fighter.fighting.knockedOut)
  } 


  get enemyIsBehind(){
    return !this.isFacingEnemy(this.closestRememberedEnemy)
  }

  isFacingEnemy(enemy: Fighter){
    const {facingDirection, proximity} = this.fighting
    return proximity.enemyIsOnThe(facingDirection, enemy)
  }

  enemyIsOnARampage(enemy: Fighter): boolean{
    if(!enemy) return
    return enemy.fighting.timers.activeTimers.some(timer => timer.name == 'on a rampage')
  }

  enemyHasLowSpirit(enemy: Fighter): boolean{
    if(!enemy) return
    const {spirit} = enemy.fighting
    const {maxSpirit} = enemy.fighting.stats
    return spirit < (maxSpirit / 2)
  }

  enemyHasLowStamina(enemy: Fighter): boolean{
    if(!enemy) return
    const {stamina} = enemy.fighting
    const {maxStamina} = enemy.fighting.stats
    return stamina < (maxStamina / 2)
  }

  isEnemyAttacking(enemy: Fighter): boolean{
    if(!enemy) return
    const enemyTargeting = enemy.fighting.enemyTargetedForAttack
    const thisFighterName = this.fighting.fighter.name
    return enemyTargeting && enemyTargeting.name == thisFighterName
  }

  
  

  hasRetreatOpportunity(enemy: Fighter): boolean{
    if(!enemy) return
    const enemyAction = enemy.fighting.actions.currentInterruptibleAction
    const enemyFacingAway = isEnemyFacingAway(enemy, this.fighting.fighter)
    return (
      !this.isEnemyAttacking(enemy) ||
      enemyFacingAway ||
      this.enemyJustAttacked(enemy) ||
      enemyAction == 'take hit' || 
      enemyAction == 'recover' ||
      enemyAction == 'defend' ||
      enemyAction == 'do nothing'
    )
  }

  enemyJustAttacked(enemy: Fighter){
    if(!enemy) return
    return enemy.fighting.logistics.justDidAttack
  }

  hasAttackOpportunity(enemy: Fighter): boolean{
    if(!enemy) return
    const enemyAction = enemy.fighting.actions.currentInterruptibleAction
    const enemyFacingAway = isEnemyFacingAway(enemy, this.fighting.fighter)
    return (
      !this.isEnemyAttacking(enemy) ||
      enemyFacingAway ||
      this.enemyJustAttacked(enemy) ||
      enemyAction == 'take hit' || 
      enemyAction == 'recover' ||
      enemyAction == 'do nothing'
    )
  
  }
    

};
