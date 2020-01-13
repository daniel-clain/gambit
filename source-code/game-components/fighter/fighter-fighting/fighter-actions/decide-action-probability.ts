
import Fighter from "../../fighter"
import { Closeness } from "../../../../types/figher/closeness"
import FighterFighting from "../fighter-fighting"

export default class DecideActionProbability {

  constructor(private fighting: FighterFighting) {}


  getProbabilityToPunch(closestEnemy: Fighter): number{
    const {aggression} = this.fighting.stats
    const {activeTimers, proximity} = this.fighting

    if(this.isARetreatTimerActive())
      return 0

    let probability = 1
    
    probability += Math.round(aggression * 0.5)

    if(this.hadNoActionInAWhile())
      probability +=2
      
    if (this.hasFullStamina())
      probability += 1
      
    if(this.justBlocked())
      probability += 2  

    if(!this.hasLowStamina()){    

      if (proximity.isEnemyFacingAway(closestEnemy))
        probability += 1

      if(activeTimers.some(timer => timer.name == 'moving to attack'))
        probability += 1 
    } 

    return probability
  }

  getProbabilityToCriticalStrike(closestEnemy: Fighter): number{
    const {aggression} = this.fighting.stats
    const {proximity} = this.fighting

    
    if(this.isARetreatTimerActive())
      return 0

    let probability = 0


    if(closestEnemy.fighting.actions.actionInProgress == 'taking a hit')
      probability += 1
      
    if(proximity.isFacingAwayFromEnemy(closestEnemy))
      probability += 1

    if(this.enemyHasLowSpirit(closestEnemy))
      probability + 1
      
    if(this.enemyHasLowStamina(closestEnemy))
      probability + 1
      
    if(this.justDodged())
      probability += 1    


      
    if(this.onARampage())
      probability + 4

      probability += Math.round(aggression * 0.5)
    
    return probability
  }

  getProbabilityToDefend(closestEnemy: Fighter): number {    
    const {proximity, flanked, trapped} = this.fighting
    const {intelligence, strength} = this.fighting.stats

    
    if(this.isARetreatTimerActive())
      return 0

    let probability = 1

    if(proximity.isFacingAwayFromEnemy(closestEnemy) ||  this.onARampage())
      return 0

    if(this.isEnemyTargetingThisFighter(closestEnemy))  
      probability += 1

    if (!this.hasFullStamina())
      probability += 1

    if(flanked && !trapped)
      probability -= 1
    
    if(trapped)
      probability += 3

    if(proximity.rememberedEnemyBehind == undefined)
      probability -=1

    probability += Math.round(probability * intelligence * 0.5)

    return probability
  }
  
  getProbabilityToMoveToAttack(closestEnemy: Fighter): number {
    if(!closestEnemy)
      return 0
    const {aggression, intelligence} = this.fighting.stats
    const {activeTimers, proximity} = this.fighting

    
    if(this.isARetreatTimerActive())
      return 0
    
    const alreadyMovingToAttack = activeTimers.some(timer => timer.name == 'moving to attack')

    let probability = 2

    if(alreadyMovingToAttack)
      probability += 5

      
    if (this.hasFullStamina())
      probability += 2      

    if(this.hasLowStamina() || this.hasLowSpirit()){
      probability -= 3
    }
    else {
      if(this.hadNoActionInAWhile())
        probability += aggression
        if(proximity.isEnemyFacingAway(closestEnemy))
          probability +=  Math.round(intelligence * .5)
    
        if(this.enemyHasLowStamina(closestEnemy))
          probability +=  Math.round(intelligence * .5)

    }

      
    probability += Math.round(probability * intelligence * 0.5)
    
    if(probability < 0)
      probability = 0

    return probability
  }

  getProbabilityToCautiousRetreat(closestEnemy: Fighter): number {
    const {intelligence, strength} = this.fighting.stats      
    const {activeTimers, proximity, flanked} = this.fighting
    
    const alreadyDoingCautiousRetreat = activeTimers.some(timer => timer.name == 'doing cautious retreat')
    
    if(this.hasFullStamina() ||  this.onARampage() || flanked)
      return 0

    let probability = 0

    if(alreadyDoingCautiousRetreat)
      probability += 5    

    if(proximity.isEnemyFacingAway(closestEnemy) && !this.isEnemyTargetingThisFighter(closestEnemy))
      probability -= 1

    if(!proximity.isFacingAwayFromEnemy(closestEnemy))
      probability +=1
      

    if (this.hasLowStamina()){
      probability += 2  
    }
      
    if (this.hasLowSpirit()){
      probability += 2
    }

    if(flanked)
      probability -= 2

    probability += Math.round(strength * 0.5)

    probability += Math.round(probability * intelligence * 0.5)

    
      
    if(probability < 0)
      probability = 0


    return probability
  }

  getProbabilityToFastRetreat(closestEnemy: Fighter): number {
    const {intelligence, speed} = this.fighting.stats    
    const {activeTimers, proximity, flanked} = this.fighting
    
    const alreadyDoingFastRetreat = activeTimers.some(timer => timer.name == 'doing fast retreat')
    
    
    if(this.hasFullStamina() ||  this.onARampage() || flanked)
      return 0

    let probability = 0

    const closeness = proximity.getEnemyCombatCloseness(closestEnemy)
    
    if(closeness == Closeness['striking range']){

      if(this.justBlocked() || this.justDodged() || this.justTookHit())
        probability += 2
      else
        probability -= 2
    }

      
    if(proximity.isEnemyFacingAway(closestEnemy) && !this.isEnemyTargetingThisFighter(closestEnemy))
      probability -= 1


  
    if(this.hasLowStamina() || this.hasLowSpirit()){
      probability += 2
      
      if(proximity.isFacingAwayFromEnemy(closestEnemy))
        probability +=2

      if(this.justDodged())
        probability += 4

    }

    probability += Math.round(probability * speed * 0.5)

    probability += Math.round(probability * intelligence * 0.5)

    
    
    if(alreadyDoingFastRetreat)
      probability *= 2

      
    if(probability < 0)
      probability = 0

    return probability
  }

  getProbabilityToRetreat(closestEnemy: Fighter): number {  
    const {activeTimers, proximity, stats, spirit, flanked} = this.fighting
    
    const alreadyRetreating = activeTimers.some(timer => timer.name == 'retreating')    
    

    
    
    if(this.hasFullStamina() || this.onARampage() || flanked)
      return 0

    let probability = 0


    if(this.isARetreatTimerActive())
      probability +=3
    
    
    if (this.hasLowStamina()){    
      probability += 3

      if(this.isEnemyTargetingThisFighter(closestEnemy))  
        probability += 2        
    }
    
    probability += closestEnemy.fighting.spirit - spirit

    if(proximity.isEnemyFacingAway(closestEnemy))
      probability -= 1

    probability += Math.round(probability * stats.intelligence * 0.5)

    
    if(alreadyRetreating)
      probability *= 2

    if(probability < 0)
      probability = 0

    return probability
  }

  getProbabilityToRetreatFromFlanked(closestEnemy: Fighter): number {
    const {flanked, activeTimers, proximity, trapped} = this.fighting
    const {intelligence} = this.fighting.stats
    const alreadyRetreatingFromFlanked = activeTimers.some(timer => timer.name == 'retreating from flanked')

    if(!flanked || this.onARampage() || trapped)
      return 0

    let probability = 0

    
    if(closestEnemy){      
      const closeness = proximity.getEnemyCombatCloseness(closestEnemy)      
      if(closeness == Closeness['striking range']){
        if(this.justBlocked() || this.justDodged() || this.justTookHit())
          probability += 2
        else
          probability -= 2
      }
    }

    
    if(this.hasLowStamina()){
      probability += 2

      if(this.justDodged())
        probability += 3
    }

    if(this.hasLowSpirit()){
      probability += 2
      
      if(this.justDodged())
        probability += 3
    }

    if(this.isEnemyTargetingThisFighter(closestEnemy))
      probability += 3


    probability += Math.round(probability * intelligence * 0.8)

    
    if(alreadyRetreatingFromFlanked)
      probability *= 2

      
    if(probability < 0)
      probability = 0

    return probability
  }

  getProbabilityToCheckFlank(closestEnemy: Fighter): number {
  
    const {intelligence} = this.fighting.stats
    const {rememberedEnemyBehind} = this.fighting.proximity
    const {flanked, proximity} = this.fighting

    const enemiesInfront: Fighter[] = proximity.getEnemiesInfront()
    const otherFightersStillFighting = this.fighting.getOtherFightersStillFighting()


    let probability = 0
    
    if(this.hasJustTurnedAround() || 
    enemiesInfront.length == otherFightersStillFighting.length)
      return 0

    if(closestEnemy){
      
      const closeness = proximity.getEnemyCombatCloseness(closestEnemy)      
      if(closeness == Closeness['striking range']){
        if(this.justBlocked() || this.justDodged() || this.justTookHit())
          probability += 2
        else
          probability -= 2
      }
    }
    
    
    if(rememberedEnemyBehind === undefined)
      probability += 4   
    
    if(this.hasLowStamina())
      probability += 2

    probability += Math.round(probability * intelligence)

    if(probability < 0)
      probability = 0


    return probability
  }

  getProbabilityToRecover(): number {
    const {intelligence} = this.fighting.stats
    const {proximity} = this.fighting
    const {rememberedEnemyBehind} = proximity
    const enemyInfront = proximity.getClosestEnemyInfront()

    let enemyInfrontCloseness: Closeness
    if(enemyInfront)
      enemyInfrontCloseness = proximity.getEnemyCombatCloseness(enemyInfront)

      
    let enemyBehindCloseness: Closeness
    if(rememberedEnemyBehind)
      enemyBehindCloseness = proximity.getEnemyCombatCloseness(rememberedEnemyBehind)

    if(rememberedEnemyBehind === undefined 
      || (rememberedEnemyBehind !== null && 
          enemyBehindCloseness <= Closeness['nearby'])
      || this.hasFullStamina()
      || this.onARampage()
      || (enemyInfront && enemyInfrontCloseness <= Closeness['nearby'])){
      return 0
    }
    
    let probability = 0

    if(this.fighting.stamina >= this.fighting.stats.maxStamina)
      debugger

    if(rememberedEnemyBehind == null)
      probability += 3
    
    
    if(rememberedEnemyBehind){
      if(enemyBehindCloseness >= Closeness['far'])
        probability += 3
      else if(this.isEnemyTargetingThisFighter(rememberedEnemyBehind))
        probability -= 2  
    }
    
    if(enemyInfront){
      if(enemyInfrontCloseness >= Closeness['far'])
        probability += 3
      else if(this.isEnemyTargetingThisFighter(enemyInfront))
        probability -= 2  
    }

    if(this.hasLowStamina())
      probability += 2
    
    probability += Math.round(probability * intelligence * .5)

    if(probability < 0)
      probability = 0

    return probability
  }

//////////////////////////////////////////////////////////////////////////

  isARetreatTimerActive(): boolean{

    const {activeTimers} = this.fighting
    
    const retreating = activeTimers.some(timer => timer.name == 'retreating')    
    const doingCautiousRetreat = activeTimers.some(timer => timer.name == 'doing cautious retreat')
    const doingFastRetreat = activeTimers.some(timer => timer.name == 'doing fast retreat')    
    const retreatingFromFlanked = activeTimers.some(timer => timer.name == 'retreating from flanked')

    return retreating || doingCautiousRetreat || doingFastRetreat || retreatingFromFlanked

  }

  hadNoActionInAWhile(): boolean{
    return this.fighting.combat.noActionForAWhile
  }

  hasJustTurnedAround(): boolean{  
    return this.fighting.activeTimers.some(timer => timer.name == 'just turned around')
  }

  hasLowStamina(): boolean{
    const {stamina, fighter} = this.fighting
    return stamina < fighter.fighting.stats.maxStamina * .5
  }

  hasLowSpirit(): boolean{
    const {spirit, fighter} = this.fighting
    return spirit < fighter.fighting.stats.maxSpirit * .5
  }

  hasFullStamina(): boolean{
    const {stamina, fighter} = this.fighting
    return stamina == fighter.fighting.stats.maxStamina
  }

  justBlocked(): boolean{
    return this.fighting.activeTimers.some(timer => timer.name == 'just blocked')
  }

  justDodged(): boolean{
    return this.fighting.activeTimers.some(timer => timer.name == 'just dodged')
  }

  justTookHit(): boolean{
    return this.fighting.activeTimers.some(timer => timer.name == 'just took a hit')

  }

  onARampage(): boolean{
    return this.fighting.activeTimers.some(timer => timer.name == 'on a rampage')
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
    const enemyTargeting = enemy.fighting.combat.enemyTargetedForAttack
    const thisFighterName = this.fighting.fighter.name
    return enemyTargeting && enemyTargeting.name == thisFighterName
  }
    

};
