
import Fighter from "../fighter"
import { Closeness } from "../../../types/figher/closeness"
import FighterFighting from "./fighter-fighting"
import { ActionName } from "../../../types/figher/action-name"

export default class DecideActionProbability {

  constructor(public fighting: FighterFighting) { }

  getProbabilityTo(action: ActionName, enemy: Fighter): [ActionName, number] {
    switch (action) {
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

  getProbabilityToPunch(closestEnemy: Fighter): number {
    const { aggression, intelligence, speed, strength } = this.fighting.stats
    const { proximity, trapped, flanked, logistics } = this.fighting


    let probability = 20

    if (logistics.moveActionInProgress == 'move to attack')
      probability += 5


    probability += aggression * 4

    if (flanked)
      probability -= intelligence * 2

    if (closestEnemy.fighting.stats.speed > speed)
      probability -= intelligence * 2

    if (closestEnemy.fighting.stats.strength > strength)
      probability -= intelligence * 2

    if (logistics.hadNoCombatForAWhile())
      probability += aggression * 2

    if (logistics.hasFullStamina())
      probability += intelligence * 2

    if (logistics.justBlocked)
      probability += intelligence * 2
    else
      probability -= intelligence * 2


    if (trapped)
      probability += intelligence * 2

    if (logistics.hasLowStamina())
      probability -= intelligence * 2

    if (proximity.isEnemyFacingAway(closestEnemy))
      probability += intelligence * 3

    if (probability < 0)
      probability = 0

    return probability
  }

  getProbabilityToCriticalStrike(closestEnemy: Fighter): number {
    const { aggression, intelligence, speed, strength } = this.fighting.stats
    const { proximity, trapped, flanked, logistics } = this.fighting

    let probability = 0


    probability += aggression

    if (flanked) {
      if (logistics.flankingFighterIsInStrikingRange())
        probability += intelligence * 3
      else
        probability -= intelligence * 3
    }

    if (closestEnemy.fighting.stats.speed > speed)
      probability -= intelligence * 2

    if (closestEnemy.fighting.stats.strength > strength)
      probability -= intelligence * 2

    if (logistics.enemyIsAttackingOrDefending(closestEnemy))
      probability -= intelligence * 2
    else
      probability += intelligence * 2


    if (closestEnemy.fighting.animation.inProgress == 'recovering')
      probability += aggression * 2
      probability += intelligence * 3

    if (proximity.isEnemyFacingAway(closestEnemy))
      probability += intelligence * 3

    if (logistics.enemyHasLowSpirit(closestEnemy))
      probability += intelligence * 2

    if (logistics.enemyHasLowStamina(closestEnemy)) {
      probability += 10
      probability += aggression
      probability += intelligence * 2
    }

    if (logistics.hadNoCombatForAWhile())
      probability += aggression


    if (trapped)
      probability += intelligence * 2

    if (logistics.onARampage)
      probability += aggression * 5

    if (probability < 0)
      probability = 0

    return probability
  }

  getProbabilityToDefend(closestEnemy: Fighter): number {
    const { proximity, flanked, logistics, rememberedEnemyBehind } = this.fighting
    const { intelligence, speed, strength, aggression } = this.fighting.stats


    if (
      proximity.isFacingAwayFromEnemy(closestEnemy) ||
      logistics.onARampage
    )
      return 0

    let probability = 10

    probability += intelligence * 6
    probability -= aggression * 3

    if (proximity.isEnemyFacingAway(closestEnemy))
      probability -= intelligence * 8

    if (logistics.isEnemyTargetingThisFighter(closestEnemy))
      probability += intelligence * 3

    if (!logistics.hasFullStamina())
      probability += intelligence * 3

    if (logistics.enemyIsOnARampage(closestEnemy))
      probability + intelligence * 3

    if (closestEnemy.fighting.stats.speed > speed)
      probability += intelligence * 2

    if (closestEnemy.fighting.stats.strength > strength)
      probability += intelligence * 2

    if (closestEnemy.fighting.animation.inProgress == 'recovering')
      probability -= 5 + intelligence * 4

    if (flanked)
      probability -= intelligence * 4

    if (rememberedEnemyBehind == undefined)
      probability -= intelligence * 3

    if (probability < 0)
      probability = 0

    return probability
  }

  getProbabilityToMoveToAttack(closestEnemy: Fighter): number {
    const { aggression, intelligence } = this.fighting.stats
    const { movement, proximity, flanked, logistics, rememberedEnemyBehind } = this.fighting
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

    let probability = 10

    
    probability += aggression * 4

    if (logistics.moveActionInProgress == 'move to attack')
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

    if (proximity.isEnemyFacingAway(closestEnemy))
      probability += intelligence * 3

    if (logistics.hadNoCombatForAWhile())
      probability += 10 + aggression * 2

    if (logistics.enemyHasLowStamina(closestEnemy)) {
      probability += aggression * 2
      probability += intelligence * 2
    }

    if (flanked || logistics.moveActionInProgress == 'retreat from flanked')
      probability -= intelligence * 4

    if (probability < 0)
      probability = 0

    return probability
  }

  getProbabilityToCautiousRetreat(closestEnemy: Fighter): number {
    const { intelligence, strength, speed, aggression } = this.fighting.stats
    const { movement, proximity, flanked, trapped, logistics } = this.fighting

    const invalid: boolean =
      proximity.getEnemyCombatCloseness(closestEnemy) >= Closeness['nearby'] ||
      logistics.onARampage ||
      proximity.isEnemyFacingAway(closestEnemy) || !logistics.isEnemyTargetingThisFighter(closestEnemy) ||
      !!logistics.isRetreatingTowardCloseEdge(proximity.getDirectionOfEnemyStrikingCenter(closestEnemy, true)) ||
      trapped

    if (invalid)
      return 0

    let probability = 0

    
    probability -= speed * 3 - closestEnemy.fighting.stats.speed * 3
    probability += strength * 3 - closestEnemy.fighting.stats.strength * 3
    probability -= aggression * 2

    if (logistics.moveActionInProgress == 'cautious retreat')
      probability += 500

    if (logistics.hasFullStamina()) {
      probability -= (5 + intelligence * 2)
    }
    else {
      probability += intelligence * 3

      if (!proximity.isFacingAwayFromEnemy(closestEnemy))
        probability += (5 + intelligence * 3)


      if (logistics.hasLowStamina()) {
        probability -= aggression
        probability += (5 + intelligence * 3)
      }

      if (logistics.hasLowSpirit()) {
        probability += (5 + intelligence * 3)
      }
    }

    if (closestEnemy.fighting.animation.inProgress == 'recovering') {
      probability -= intelligence * 2
      probability -= aggression * 2
    }


    if (flanked)
      probability -= intelligence * 4

    if (probability < 0)
      probability = 0

    return probability
  }

  getProbabilityToFastRetreat(closestEnemy: Fighter): number {
    const { intelligence, speed, aggression } = this.fighting.stats
    const { proximity, flanked, trapped, logistics } = this.fighting

    const invalid: boolean =
      proximity.getEnemyCombatCloseness(closestEnemy) > Closeness['nearby'] ||
      proximity.isEnemyFacingAway(closestEnemy) || !logistics.isEnemyTargetingThisFighter(closestEnemy) ||
      logistics.onARampage ||
      !!logistics.isRetreatingTowardCloseEdge(proximity.getDirectionOfEnemyStrikingCenter(closestEnemy, true)) ||
      trapped

    if (invalid)
      return 0

    let probability = 0

    if (logistics.moveActionInProgress == 'fast retreat')
      probability += 500

      
    if(closestEnemy.fighting.animation.inProgress == 'recovering'){
      probability -= intelligence
      probability -= aggression
    }

    if (logistics.hasFullStamina() || logistics.hasFullSpirit())
      probability -= (5 + intelligence)
    else {
      probability += intelligence * 2
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
    }
    probability += speed * 3 - closestEnemy.fighting.stats.speed * 3

    if (flanked)
      probability -= intelligence * 2

    if (logistics.hasLowStamina()) {
      probability += speed * 2
      probability += intelligence * 2
    }

    if (logistics.hasLowSpirit()) {
      probability += speed * 2
      probability += intelligence * 2
    }

    if (probability < 0)
      probability = 0

    return probability
  }

  getProbabilityToRetreat(closestEnemy: Fighter): number {
    const { proximity, flanked, trapped, logistics } = this.fighting
    const { intelligence, speed, aggression } = this.fighting.stats

    const invalid: boolean =
      proximity.getEnemyCombatCloseness(closestEnemy) <= Closeness['close'] ||
      logistics.hasFullStamina() ||
      logistics.onARampage ||
      !!logistics.isRetreatingTowardCloseEdge(proximity.getDirectionOfEnemyStrikingCenter(closestEnemy, true)) ||
      trapped

    if (invalid)
      return 0

    let probability = 0

    if (logistics.moveActionInProgress == 'retreat')
      probability += 400
      

    if (logistics.isARetreatInProgress())
      probability += 100

      
    if(closestEnemy.fighting.animation.inProgress == 'recovering'){
      probability -= intelligence
      probability -= aggression
    }

    if (logistics.isEnemyTargetingThisFighter(closestEnemy))
      probability += intelligence

    if (logistics.hasLowStamina() || logistics.hasLowSpirit()) {

      if (logistics.hasLowStamina()) {
        probability += speed
        probability += intelligence
      }

      if (logistics.hasLowSpirit()) {
        probability += speed
        probability += intelligence
      }
    }
    else {
      if (proximity.isEnemyFacingAway(closestEnemy))
        probability -= (5 + intelligence * 2)

      probability -= aggression
    }

    if (flanked)
      probability -= intelligence * 3



    if (probability < 0)
      probability = 0

    return probability
  }

  getProbabilityToRetreatFromFlanked(closestEnemy: Fighter): number {
    const { flanked, proximity, trapped, logistics } = this.fighting
    const { intelligence, speed, aggression } = this.fighting.stats


    const invalid: boolean =
      logistics.onARampage ||
      !flanked ||
      trapped

    if (invalid)
      return 0

    let probability = 0

    if (logistics.moveActionInProgress == 'retreat from flanked')
      probability += 500

    probability += flanked.criticality * intelligence

    probability += Math.round(flanked.criticality * .5) * speed

    probability -= aggression

    if (probability < 0)
      probability = 0

    return probability
  }

  getProbabilityToCheckFlank(closestEnemy: Fighter): number {

    const { intelligence } = this.fighting.stats
    const { proximity, logistics, rememberedEnemyBehind } = this.fighting

    const enemiesInfront: number = proximity.getEnemiesInfront().length
    const enemiesStillFighting: number = logistics.otherFightersStillFighting().length


    const invalid: boolean =
      logistics.hasJustTurnedAround()

    if (invalid)
      return 0

    let probability = 1

    if (enemiesInfront == enemiesStillFighting)
      probability -= intelligence * 3
    else if (rememberedEnemyBehind === undefined)
      probability += intelligence * 2


    if (closestEnemy) {

      const closeness = proximity.getEnemyCombatCloseness(closestEnemy)
      if (closeness == Closeness['striking range']) {
        if (logistics.hasRetreatOpportunity(closestEnemy))
          probability += intelligence
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
    const { proximity, logistics, rememberedEnemyBehind } = this.fighting
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

    if (rememberedEnemyBehind === undefined)
      probability -= intelligence * 2

    if (rememberedEnemyBehind !== null && enemyBehindCloseness <= Closeness['nearby'])
      probability -= intelligence * 2

    if (enemyInfront && enemyInfrontCloseness <= Closeness['nearby'])
      probability -= intelligence * 2


    if (logistics.justTookHit){
      probability += 4
    }
    if (logistics.hasLowStamina()){
      probability += 4
    }
    if (logistics.hasLowSpirit()){
      probability += 4
    }
    if (proximity.isNearEdge()){
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

      
    if (
      enemyInfront &&
      enemyBehindCloseness <= Closeness['nearby'] &&
      logistics.isEnemyTargetingThisFighter(enemyInfront)
    )
    probability -= intelligence * 4

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

};
