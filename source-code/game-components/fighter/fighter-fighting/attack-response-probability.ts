import FighterFighting from "./fighter-fighting"
import Fighter from "../fighter"
import { AttackType } from "../../../types/fighter/attack-types"
import { ActionName, AttackResponseAction } from "../../../types/fighter/action-name"
import { isFacingAwayFromEnemy } from "./proximity"

export default class AttackResponseProbability {
  
  constructor(public fighting: FighterFighting){}

  getProbabilityTo(action: AttackResponseAction, enemy: Fighter, attackType: AttackType): [AttackResponseAction, number]{
    switch(action){      
      case 'dodge':
        return [action, this.getProbabilityToDodge(enemy, attackType)]
      case 'block':
        return [action, this.getProbabilityToBlock(enemy, attackType)]
      case 'take hit':
        return [action, this.getProbabilityToTakeHit(enemy, attackType)]
    }
  }
  
  getProbabilityToDodge(enemy: Fighter, attackType: AttackType): number {

    const {speed, intelligence} = this.fighting.stats
    const {animation, fighter, movement, spirit} = this.fighting
    
    if(
      isFacingAwayFromEnemy(enemy, fighter) ||
      (animation.inProgress && animation.inProgress != 'defending' && animation.inProgress != 'recovering')
    )
      return 0

    let probability: number = 1


    if(enemy.state.hallucinating){
      probability -= 6
    }
    if(animation.inProgress == 'defending')
      probability += 8

    if(movement.moveActionInProgress == 'cautious retreat')
      probability += 4


    probability += speed * 3 - enemy.fighting.stats.speed * 3
    
    probability += spirit - enemy.fighting.spirit
    
    probability += intelligence

    if(attackType == 'critical strike')
      probability += 1

    if(this.hasLowStamina())
      probability ++

      if(fighter.state.hallucinating){
        probability -= 6
      }
      
    if(animation.inProgress == 'recovering')
    probability = probability * 0.3  + spirit * .4
    
    if(probability < 0)
      probability = 0
    

    return probability
  }

  getProbabilityToBlock(enemy: Fighter, attackType: AttackType): number {
    const {strength, speed, intelligence} = this.fighting.stats
    const {spirit, animation, fighter, movement} = this.fighting

    
    if(
      isFacingAwayFromEnemy(enemy, fighter) ||
      (animation.inProgress && animation.inProgress != 'defending' && animation.inProgress != 'recovering')
    )
      return 0

    let probability: number = 0
   
    if(animation.inProgress == 'defending')
      probability += 10 + intelligence

    if(movement.moveActionInProgress == 'cautious retreat')
      probability += 8

          
    probability += strength * 3 - enemy.fighting.stats.strength * 3
          
    probability += speed - enemy.fighting.stats.speed
    
    probability += spirit - enemy.fighting.spirit
      
    probability += intelligence

    if(attackType == 'punch')
      probability += 1
      
    if(this.hasFullStamina())
      probability += 1

    if(enemy.state.takingADive){
      probability -= 6
    }

      
    if(animation.inProgress == 'recovering')
      probability = probability * 0.2  + spirit * .5


    if(probability < 0)
      probability = 0

    return probability
  }
  
  getProbabilityToTakeHit(enemy: Fighter, attackType: AttackType): number {
    return 5
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

  hasFullSpirit(): boolean{
    const {spirit, fighter} = this.fighting
    return spirit == fighter.fighting.stats.maxSpirit
  }
};
