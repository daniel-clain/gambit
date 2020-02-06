import FighterFighting from "./fighter-fighting"
import Fighter from "../fighter"
import { AttackType } from "../../../types/figher/attack-types"
import { ActionName, AttackResponseAction } from "../../../types/figher/action-name"

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
    const {animation, proximity, logistics, spirit} = this.fighting
    
    if(
      proximity.isFacingAwayFromEnemy(enemy) ||
      (animation.inProgress && animation.inProgress != 'defending' && animation.inProgress != 'recovering')
    )
      return 0

    let probability: number = 1

    if(animation.inProgress == 'defending')
      probability += 8

    if(logistics.moveActionInProgress == 'cautious retreat')
      probability += 4


    probability += speed * 3 - enemy.fighting.stats.speed * 3
    
    probability += spirit - enemy.fighting.spirit
    
    probability += intelligence

    if(attackType == 'critical strike')
      probability += 1

    if(this.hasLowStamina())
      probability ++

    
    if(probability < 0)
      probability = 0
    

    return probability
  }

  getProbabilityToBlock(enemy: Fighter, attackType: AttackType): number {
    const {strength, speed, intelligence} = this.fighting.stats
    const {spirit, animation, proximity, logistics} = this.fighting

    
    if(
      proximity.isFacingAwayFromEnemy(enemy) ||
      (animation.inProgress && animation.inProgress != 'defending' && animation.inProgress != 'recovering')
    )
      return 0

    let probability: number = 0
   
    if(animation.inProgress == 'defending')
      probability += 10

    if(logistics.moveActionInProgress == 'cautious retreat')
      probability += 8

      
    if(animation.inProgress == 'recovering')
      probability -= 5
    
    probability += strength * 3 - enemy.fighting.stats.strength * 3
          
    probability += speed - enemy.fighting.stats.speed
    
    probability += spirit - enemy.fighting.spirit
      
    probability += intelligence

    if(attackType == 'punch')
      probability += 1
      
    if(this.hasFullStamina())
      probability += 1


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
