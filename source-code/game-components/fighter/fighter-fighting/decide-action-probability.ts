
import Fighter from "../fighter"
import { Closeness } from "../../../types/figher/closeness"
import FighterFighting from "./fighter-fighting"
import { ActionName } from "../../../types/figher/action-name"
import { isEnemyFacingAway, getEnemiesInfront, isFacingAwayFromEnemy } from "./proximity"

export default class DecideActionProbability {

  constructor(public fighting: FighterFighting) { }

  getProbabilityTo(action: ActionName, enemy: Fighter): [ActionName, number] {
    switch (action) {
      case 'do nothing':
        return [action, this.getProbabilityToDoNothing()]
      case 'punch':
        return [action, this.getProbabilityToPunch(enemy)]
      case 'critical strike':
        return [action, this.getProbabilityToCriticalStrike(enemy)]
      case 'defend':
        return [action, this.getProbabilityToDefend(enemy)]
      case 'move to attack':
        return [action, this.getProbabilityToMoveToAttack(enemy)]
      case 'cautious retreat':
        return [action, this.getProbabilityToCautiousRetreat(enemy)]
      case 'retreat around edge':
        return [action, this.getProbabilityToRetreatAroundEdge(enemy)]
      case 'reposition':
        return [action, this.getProbabilityToReposition(enemy)]
      case 'fast retreat':
        return [action, this.getProbabilityToFastRetreat(enemy)]
      case 'retreat':
        return [action, this.getProbabilityToRetreat(enemy)]
      case 'retreat from flanked':
        return [action, this.getProbabilityToRetreatFromFlanked(enemy)]
      case 'recover':
        return [action, this.getProbabilityToRecover()]
      case 'turn around':
        return [action, this.getProbabilityToCheckFlank(enemy)]
    }
  }
  getProbabilityToDoNothing(): number {
    const { logistics, movement } = this.fighting
    const { aggression, intelligence } = this.fighting.stats

    if(
      logistics.onARampage ||
      movement.moveActionInProgress
    )
      return 0

    let probability = 30

    probability -= intelligence * 2
    probability -= aggression

    if (probability < 0)
      probability = 0

    return probability

  }

  getProbabilityToPunch(closestEnemy: Fighter): number {
    const { intelligence } = this.fighting.stats
    const { logistics } = this.fighting


    let probability = 10

    probability += this.getProbabilityForGeneralAttack(closestEnemy)

    
    if(!logistics.enemyHasLowStamina(closestEnemy))
      probability += 5 + intelligence

    if (probability < 0)
      probability = 0

    return probability
  }

  getProbabilityToCriticalStrike(closestEnemy: Fighter): number {
    const { aggression, intelligence} = this.fighting.stats
    const { logistics, fighter} = this.fighting

    let probability = 0

    probability += this.getProbabilityForGeneralAttack(closestEnemy)


    if (closestEnemy.fighting.animation.inProgress == 'recovering'){
      probability += aggression
      probability += intelligence
    }

    if (isEnemyFacingAway(closestEnemy, fighter)){}
      probability += intelligence

    if (logistics.enemyHasLowSpirit(closestEnemy))
      probability += intelligence * 2

    if (logistics.enemyHasLowStamina(closestEnemy)) {
      probability += 5
      probability += aggression
      probability += intelligence
    }


    if (probability < 0)
      probability = 0

    return probability
  }

  getProbabilityToDefend(closestEnemy: Fighter): number {
    const { proximity, logistics, rememberedEnemyBehind, fighter} = this.fighting
    const { intelligence, speed, strength, aggression } = this.fighting.stats


    if (
      isFacingAwayFromEnemy(closestEnemy, fighter) ||
      logistics.onARampage
    )
      return 0

    let probability = 10

    probability -= aggression * 3

    if(proximity.trapped)
      probability -= intelligence * 3

    if (isEnemyFacingAway(closestEnemy, fighter))
      probability -= intelligence * 8

    if (logistics.isEnemyTargetingThisFighter(closestEnemy))
      probability += intelligence * 3

    if (!logistics.hasFullStamina())
      probability += intelligence * 3

    if (logistics.enemyIsOnARampage(closestEnemy))
      probability + intelligence * 6

    if (closestEnemy.fighting.stats.speed > speed)
      probability += intelligence * 2

    if (closestEnemy.fighting.stats.strength > strength)
      probability += intelligence * 2

    
    if (
      closestEnemy.fighting.animation.inProgress != 'defending' &&
      closestEnemy.fighting.animation.inProgress != 'trying to critical strike' &&
      closestEnemy.fighting.animation.inProgress != 'trying to punch'
    ){
      probability -= intelligence * 2
      if (closestEnemy.fighting.animation.inProgress == 'recovering')
      probability -= 10 + intelligence * 6
    }
    else    
      probability += intelligence * 4

    if (proximity.flanked)
      probability -= intelligence * 4

    if (rememberedEnemyBehind == undefined)
      probability -= intelligence * 3

    if (probability < 0)
      probability = 0

    return probability
  }

  getProbabilityToMoveToAttack(closestEnemy: Fighter): number {
    const { aggression, intelligence } = this.fighting.stats
    const { proximity, logistics, rememberedEnemyBehind, movement, fighter, spirit} = this.fighting
    const enemyInfront = proximity.getClosestEnemyInfront()

    let enemyInfrontCloseness: Closeness
    if (enemyInfront)
      enemyInfrontCloseness = proximity.getEnemyCombatCloseness(enemyInfront)


    let enemyBehindCloseness: Closeness
    if (rememberedEnemyBehind)
      enemyBehindCloseness = proximity.getEnemyCombatCloseness(rememberedEnemyBehind)


    const invalid: boolean =
      proximity.enemyWithinStrikingRange(closestEnemy)

    if (invalid)
      return 0

    let probability = 5

    
    probability += aggression * 4

    if (movement.moveActionInProgress == 'move to attack')
      probability += 500

    if (
      rememberedEnemyBehind &&
      enemyBehindCloseness)

      if (logistics.isARetreatInProgress()) {
        probability += aggression
        probability -= 10 + intelligence * 2
      }

    if (logistics.hasFullStamina())
      probability += intelligence * 2

    if (logistics.hasFullSpirit())
      probability += intelligence * 2

    if (logistics.hasLowStamina())
      probability -= 5 + intelligence * 2

    if (logistics.hasLowSpirit())
      probability -= 5 + intelligence * 2

    if (isEnemyFacingAway(closestEnemy, fighter))
      probability += intelligence * 3

    if (!logistics.hadActionRecently)
      probability += 10 + aggression * 2

    if (logistics.enemyHasLowStamina(closestEnemy)) {
      probability += aggression * 2
      probability += intelligence * 2
    }
    
    if (closestEnemy.fighting.animation.inProgress == 'recovering'){
      probability += aggression * 2
      probability += intelligence * 2
    }

      
    if (proximity.trapped)
      probability += 10 + aggression + spirit * 2
    else if(proximity.flanked || movement.moveActionInProgress == 'retreat from flanked')
      probability -= intelligence * 4

    if (probability < 0)
      probability = 0

    return probability
  }

  getProbabilityToCheckFlank(closestEnemy: Fighter): number {

    const { intelligence } = this.fighting.stats
    const { proximity, logistics, rememberedEnemyBehind, fighter, otherFightersInFight} = this.fighting

    const enemiesInfront: number = getEnemiesInfront(otherFightersInFight, fighter).length
    const enemiesStillFighting: number = logistics.otherFightersStillFighting().length


    const invalid: boolean =
      logistics.hasJustTurnedAround()

    if (invalid)
      return 0

    let probability = 1

    if (enemiesInfront == enemiesStillFighting)
      probability -= intelligence * 3
    else if (rememberedEnemyBehind === undefined)
      probability += intelligence * 5


    if (closestEnemy) {

      const closeness = proximity.getEnemyCombatCloseness(closestEnemy)
      if (closeness == Closeness['striking range']) {
        if (logistics.hasRetreatOpportunity(closestEnemy))
          probability += intelligence * 2
        else
          probability -= intelligence * 2
      }
    }


    if (probability < 0)
      probability = 0

    return probability
  }

  getProbabilityToRecover(): number {
    const { intelligence } = this.fighting.stats
    const { proximity, logistics, rememberedEnemyBehind, spirit} = this.fighting
    const enemyInfront = proximity.getClosestEnemyInfront()

    let enemyInfrontCloseness: Closeness
    if (enemyInfront)
      enemyInfrontCloseness = proximity.getEnemyCombatCloseness(enemyInfront)


    let enemyBehindCloseness: Closeness
    if (rememberedEnemyBehind)
      enemyBehindCloseness = proximity.getEnemyCombatCloseness(rememberedEnemyBehind)


    const invalid: boolean =
      logistics.hasFullStamina() ||
      logistics.onARampage

    if (invalid)
      return 0

    let probability = 10

    
    if(proximity.trapped)
      probability -= intelligence * 3

    if (rememberedEnemyBehind === undefined)
      probability -= intelligence * 2

    if (rememberedEnemyBehind !== null && enemyBehindCloseness <= Closeness['nearby'])
      probability -= intelligence * 2

    if (enemyInfront && enemyInfrontCloseness <= Closeness['nearby'])
      probability -= intelligence * 2


    if (logistics.justTookHit){
      probability += 4 + (5 - spirit)
    }
    if (logistics.hasLowStamina()){
      probability += 4
    }
    if (logistics.hasLowSpirit()){
      probability += 4
    }
    if (proximity.againstEdge){
      probability += 4
    }

    if (
      enemyInfront &&
      enemyBehindCloseness <= Closeness['far'] &&
      logistics.isEnemyTargetingThisFighter(enemyInfront)
    )
      probability -= intelligence * 2

    if(
      rememberedEnemyBehind &&
      enemyBehindCloseness <= Closeness['far'] &&
      logistics.isEnemyTargetingThisFighter(rememberedEnemyBehind)
    )
      probability -= intelligence * 2
    else{      
      if (logistics.hasLowStamina())
        probability += intelligence * 2

      if (logistics.hasLowSpirit())
        probability += intelligence * 2
    }

      
    if (
      enemyInfront &&
      enemyBehindCloseness <= Closeness['nearby'] &&
      logistics.isEnemyTargetingThisFighter(enemyInfront)
    )
      probability -= intelligence * 4
    else{      
      if (logistics.hasLowStamina())
        probability += intelligence

      if (logistics.hasLowSpirit())
        probability += intelligence
    }

    if(
      rememberedEnemyBehind &&
      enemyBehindCloseness <= Closeness['nearby'] &&
      logistics.isEnemyTargetingThisFighter(rememberedEnemyBehind)
    )
      probability -= intelligence * 4


    if (
      (!enemyInfront || enemyInfrontCloseness == Closeness['very far']) &&
      (rememberedEnemyBehind === null || enemyBehindCloseness == Closeness['very far'])
    ) {
      probability += intelligence * 3

      if (logistics.hasLowStamina())
        probability += intelligence * 2

      if (logistics.hasLowSpirit())
        probability += intelligence * 2
    }

    if (probability < 0)
      probability = 0

    return probability
  }
  
  getProbabilityToReposition(closestEnemy: Fighter){
    const { intelligence } = this.fighting.stats
    const { proximity, movement, logistics} = this.fighting
    

    const invalid: boolean =
      (proximity.flanked && proximity.flanked.criticality > 5) ||
      proximity.allEnemiesAreOnOneSide() ||      
      proximity.getEnemyCombatCloseness(closestEnemy) == Closeness['striking range'] ||
      logistics.onARampage ||
      proximity.trapped
    
    if (invalid)
      return 0

    let probability = 0

    probability += intelligence * 4

    probability += proximity.getNumberOfEnemiesOnSideWithFewestNumberOfEnemies() * intelligence

    probability += Math.round(this.getProbabilityForGeneralRetreat(closestEnemy) * .5)

    if(proximity.flanked)
      probability += proximity.flanked.criticality * intelligence

    if (
      movement.moveActionInProgress == 'reposition' ||
      logistics.isARetreatInProgress()
    )
      probability += 500


    return probability
  }


  getProbabilityToCautiousRetreat(closestEnemy: Fighter): number {
    const { intelligence, strength, speed, aggression } = this.fighting.stats
    const { movement, proximity, logistics, fighter} = this.fighting

    const invalid: boolean =
      proximity.getEnemyCombatCloseness(closestEnemy) >= Closeness['nearby'] ||
      isEnemyFacingAway(closestEnemy, fighter) || 
      !logistics.isEnemyTargetingThisFighter(closestEnemy) ||
      !!proximity.getNearestEdge() ||       
      logistics.onARampage ||
      logistics.hasFullStamina() ||
      proximity.trapped

    if (invalid)
      return 0

    let probability = 0
    
    probability += this.getProbabilityForGeneralRetreat(closestEnemy)


    const closeness = proximity.getEnemyCombatCloseness(closestEnemy)
    if (closeness == Closeness['striking range']) {
      if (
        logistics.justTookHit ||
        logistics.justBlocked ||
        logistics.justDodged || closestEnemy.fighting.animation.inProgress == 'defending' || closestEnemy.fighting.animation.inProgress == 'recovering'
      ) {
        probability += intelligence
      }
      else
        probability -= intelligence * 2
    }
    
    probability -= speed * 3 - closestEnemy.fighting.stats.speed * 3
    probability += strength * 3 - closestEnemy.fighting.stats.strength * 3
    probability -= aggression * 2

    if (movement.moveActionInProgress == 'cautious retreat')
      probability += 500


    if (proximity.flanked)
      probability -= intelligence * 4

    if (probability < 0)
      probability = 0

    return probability
  }

  getProbabilityToFastRetreat(closestEnemy: Fighter): number {
    const { intelligence, speed, aggression } = this.fighting.stats
    const { proximity, logistics, movement, fighter} = this.fighting

    const invalid: boolean =
      proximity.getEnemyCombatCloseness(closestEnemy) > Closeness['nearby'] ||
      logistics.onARampage ||
      logistics.hasFullStamina() ||
      proximity.trapped

    if (invalid)
      return 0

    let probability = 0

    
    probability += this.getProbabilityForGeneralRetreat(closestEnemy)

    if (movement.moveActionInProgress == 'fast retreat')
      probability += 500

    const closeness = proximity.getEnemyCombatCloseness(closestEnemy)
    if (closeness == Closeness['striking range']) {
      if (
        logistics.justTookHit ||
        logistics.justBlocked ||
        logistics.justDodged || closestEnemy.fighting.animation.inProgress == 'defending' || closestEnemy.fighting.animation.inProgress == 'recovering'
      ) {
        probability += speed * 2
        probability += intelligence * 2
      }
      else
        probability -= intelligence * 4
    }
    

    probability += speed * 3 - closestEnemy.fighting.stats.speed * 3

    if (proximity.flanked)
      probability -= intelligence * 3


    if (probability < 0)
      probability = 0

    return probability
  }

  getProbabilityToRetreat(closestEnemy: Fighter): number {
    const { proximity, logistics, movement} = this.fighting
    const { intelligence, speed, aggression } = this.fighting.stats

    const invalid: boolean =
      proximity.getEnemyCombatCloseness(closestEnemy) <= Closeness['close'] ||   
      logistics.onARampage ||
      logistics.hasFullStamina() ||
      proximity.trapped

    if (invalid)
      return 0

    let probability = 0

    probability += this.getProbabilityForGeneralRetreat(closestEnemy)

    if (movement.moveActionInProgress == 'retreat')
      probability += 500   

    if (proximity.flanked)
      probability -= intelligence * 3

    if (probability < 0)
      probability = 0

    return probability
  }

  getProbabilityToRetreatFromFlanked(closestEnemy: Fighter): number {
    const { proximity, logistics, movement} = this.fighting
    const { intelligence, speed, aggression } = this.fighting.stats


    const invalid: boolean =
      !proximity.flanked ||
      logistics.onARampage ||
      proximity.trapped

    if (invalid)
      return 0

    let probability = 0

    
    probability += this.getProbabilityForGeneralRetreat(closestEnemy)

    if (movement.moveActionInProgress == 'retreat from flanked')
      probability += 500

    probability += proximity.flanked.criticality * intelligence * 4

    probability += Math.round(proximity.flanked.criticality * (speed * .5))

    if (probability < 0)
      probability = 0

    return probability
  }


  getProbabilityToRetreatAroundEdge(closestEnemy: Fighter): number {

    const { intelligence } = this.fighting.stats
    const { proximity, logistics, rememberedEnemyBehind, movement} = this.fighting


    const invalid: boolean =      
      logistics.onARampage || 
      !proximity.getNearestEdge() ||
      proximity.trapped

    if (invalid)
      return 0

    let probability = 0

    probability += this.getProbabilityForGeneralRetreat(closestEnemy)


    if (movement.moveActionInProgress == 'retreat around edge')
      probability += 500

    if (probability < 0)
      probability = 0

    return probability
  
  }

  getProbabilityForGeneralAttack(closestEnemy: Fighter): number{
    const { proximity, logistics, fighter, movement, spirit} = this.fighting
    const { intelligence, speed, aggression, strength } = this.fighting.stats

    
    let probability = 0
    
    if (movement.moveActionInProgress == 'move to attack')
      probability += 5

    probability += aggression
    
    if(
      closestEnemy.fighting.animation.inProgress == 'recovering' ||
      closestEnemy.fighting.animation.inProgress == 'doing cooldown'
    ){
      probability += intelligence * 2
      probability += aggression * 2
    }
    
    if(closestEnemy.fighting.animation.inProgress == 'defending')
      probability -= intelligence * 2
    
    if (proximity.trapped)
      probability += 10 + aggression + spirit*2
    else if(proximity.flanked)
      probability -= intelligence * 4


      
    if (!logistics.hadActionRecently)
      probability += 5 + aggression

    if (logistics.hasFullStamina())
      probability += intelligence * 2

    if (logistics.justBlocked || logistics.justDodged)
      probability += intelligence * 2
    else if(!proximity.trapped)
      probability -= intelligence * 2
      
    if(logistics.justDidAttack)
      probability += aggression
      
    if(logistics.justTookHit){
      probability += aggression
      if(!proximity.trapped)
        probability -= intelligence
    }      
    if(!proximity.trapped){
      if (closestEnemy.fighting.stats.speed > speed)
        probability -= intelligence

      if (closestEnemy.fighting.stats.strength > strength)
        probability -= intelligence

      if (logistics.hasLowStamina())
        probability -= intelligence * 3

      if (logistics.hasLowSpirit())
        probability -= intelligence * 3
    }

    if (isEnemyFacingAway(closestEnemy, fighter))
      probability += intelligence * 4

    return probability
  }

  getProbabilityForGeneralRetreat(closestEnemy: Fighter): number{
    const { fighter, logistics, proximity} = this.fighting
    const { intelligence, speed, aggression } = this.fighting.stats


    const invalid: boolean =  
      proximity.trapped ||
      logistics.onARampage ||
      logistics.hasFullStamina()

    if (invalid)
      return 0

    let probability = 0

    if (logistics.isARetreatInProgress())
      probability += 100
      
    probability -= aggression    


    if(logistics.enemyIsOnARampage(closestEnemy))
      probability += 5 + intelligence * 4


    if (logistics.hasLowStamina() || logistics.hasLowSpirit())  {

      
      if(
        closestEnemy.fighting.animation.inProgress == 'recovering' ||
        closestEnemy.fighting.animation.inProgress == 'doing cooldown'
      ){
        probability += intelligence * 2
        probability -= aggression * 2
      }

      
      if (logistics.isEnemyTargetingThisFighter(closestEnemy))
        probability += intelligence * 2

      if (logistics.hasLowStamina()) {
        probability += speed
        probability -= aggression
        probability += (5 + intelligence * 6)
      }

      if (logistics.hasLowSpirit()) {
        probability += speed
        probability += (5 + intelligence * 6)
      }
      
      if (isEnemyFacingAway(closestEnemy, fighter))
        probability += intelligence * 2

    }
    else {
      probability -= aggression

      
    
      if(proximity.getEnemyCombatCloseness(closestEnemy) >= Closeness['nearby'])
        probability -= intelligence * 4

      if(
        closestEnemy.fighting.animation.inProgress == 'recovering' ||
        closestEnemy.fighting.animation.inProgress == 'doing cooldown'
      ){
        probability -= intelligence
        probability -= aggression
      }

      if (isEnemyFacingAway(closestEnemy, fighter))
        probability -= (5 + intelligence * 4)

    }


    return probability
  }

};