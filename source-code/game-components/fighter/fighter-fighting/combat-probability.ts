import Combat from "./combat"
import Fighter from "../fighter"

export default class CombatProbability {

  constructor(private combat: Combat) {
    
  }
  
  getProbabilityToAttack(fighter: Fighter): number {
    const {fighterFighting, noActionForAWhile, justBlocked, justDidAttack, movingToAttackTimerActive} = this.combat
    const {maxStamina, aggression} = fighterFighting.fighter.state
    const {stamina, movement} = fighterFighting
    let probability = 1
    if(movingToAttackTimerActive){
      probability +=3
    }
    if (movement.facingDirection == fighter.fighting.movement.facingDirection && !(stamina < maxStamina * .6))
      probability += 2
    if (stamina == maxStamina)
      probability += 2
    if(noActionForAWhile)
      probability += 2
    if(justBlocked)
      probability += 2
    if(justDidAttack)
      probability +=3
    if(aggression)
      probability += Math.round(aggression * 1.4)

    if(probability < 0)
      probability = 0

    return probability

  }

  getProbabilityToDefend(fighter: Fighter): number {
    const {fighterFighting} = this.combat
    const {maxStamina, aggression, intelligence, speed, strength} = fighterFighting.fighter.state
    const {stamina, proximity} = fighterFighting
    let probability = 0
    const enemyIsClose = proximity.isFighterClose(fighter, 'close')
    if(enemyIsClose){
      probability += intelligence
      probability += Math.round(speed * 0.8)    
      if(this.isEnemyTargetingThisFighter(fighter))  
        probability += 2

      if (stamina < maxStamina)
        probability += 2

      probability += Math.round(strength * 1.8)

      probability -= Math.round(aggression * 1.8)
        
    }

    if(probability < 0)
      probability = 0
    return probability
  }

  getProbabilityToRetreat(fighter: Fighter): number {

    const {fighterFighting, justDodged, retreatingTimerActive} = this.combat
    const {maxStamina, aggression, intelligence, speed} = fighterFighting.fighter.state
    const {stamina, proximity} = fighterFighting
    
    const enemyIsClose = proximity.isFighterClose(fighter, 'close')

    let probability = 0

    if(retreatingTimerActive){
      probability +=3
    }
    if (stamina < maxStamina * .6) {
      probability += 3
      probability += Math.round(speed * .5)
          
      if(this.isEnemyTargetingThisFighter(fighter))  
        probability += 2

      if(justDodged)
        probability += 2
      
      if(enemyIsClose)
        probability += 1
      
      probability += intelligence

    }
    probability -= Math.round(aggression * 1.4)


      
    if(probability < 0)
      probability = 0

    return probability
  }

  
  isEnemyTargetingThisFighter(fighter: Fighter): boolean{
    if (fighter.fighting.combat.fighterTargetedForAttack){
      const thisFighterName = this.combat.fighterFighting.fighter.name
      const enemeyTargetingFighterName = fighter.fighting.combat.fighterTargetedForAttack.name
      return enemeyTargetingFighterName === thisFighterName
    }
    return false
  }





  
  getProbabilityToDodge(fighter: Fighter): number {

    const {fighterFighting} = this.combat
    const {speed} = fighterFighting.fighter.state
    const {stamina, actionInProgress} = fighterFighting

    let probability: number = 5

    probability += speed * 2 - fighter.state.speed
    
    if(stamina < fighter.fighting.stamina)
      probability += fighter.fighting.stamina - stamina

    if(actionInProgress == 'defending')
      probability += 1

    if(probability < 0)
      probability = 0

    return probability
  }

  getProbabilityToBlock(fighter: Fighter): number {
    const {fighterFighting, justBlocked} = this.combat
    const {strength, speed, aggression, intelligence} = fighterFighting.fighter.state
    const {stamina, spirit, actionInProgress} = fighterFighting

    let probability: number = 3
    
    probability += strength * 3 - fighter.state.strength
    
    if(stamina > fighter.fighting.stamina)
      probability += stamina - fighter.fighting.stamina
      
    if(speed < fighter.state.speed)
      probability -= 1

      
    if(justBlocked)
      probability += 1
      
    probability -= aggression  

    probability += intelligence *2


    if(spirit > 2)
      probability ++

    if(spirit < 2)
      probability --    

    if(actionInProgress == 'defending')
      probability += 6
      
    if(probability < 0)
      probability = 0

    return probability
  }
  
  getProbabilityToTakeHit(fighter: Fighter): number {
    const {speed} = this.combat.fighterFighting.fighter.state

    let probability: number = 4

    if(fighter.state.speed > speed)
      probability ++

    if(fighter.fighting.combat.justBlocked)
      probability += 3

    if(fighter.fighting.combat.justDodged)
      probability += 1
      
    if(fighter.fighting.combat.justDidAttack)
      probability += 1

    
    probability += fighter.fighting.spirit

    probability -= fighter.state.aggression

    if(probability < 0)
      probability = 0

    if(probability < 0)
      probability = 0

    return probability
  }
  
  getProbabilityToTakeCriticalHit(fighter: Fighter): number {

    let probability: number = 0

      
    if(this.combat.onRampage)
      probability += 1
      
    if(this.combat.justDidAttack)
      probability += 1
    
    probability += fighter.fighting.spirit

    probability += fighter.state.aggression
    

    return probability
  }


};
