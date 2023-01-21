import FighterFighting from "./fighter-fighting"
import Fighter from "../fighter"
import { AttackAction, AttackResponseAction } from "../../../types/fighter/action-name"
import { isFacingAwayFromEnemy } from "./proximity"
import { OptionProbability } from "../../../helper-functions/helper-functions"

export default class AttackResponseProbability {
  
  constructor(public fighting: FighterFighting){}

  getProbabilityTo(action: AttackResponseAction, enemy: Fighter, attackType: AttackAction): OptionProbability<AttackResponseAction>{
    switch(action){      
      case 'dodge':
        return {
          option: action, 
          probability: this.getProbabilityToDodge(enemy, attackType)
        }
      case 'block':
        return {
          option: action, 
          probability: this.getProbabilityToBlock(enemy, attackType)
        }
      case 'take hit':
        return {
          option: action, 
          probability: this.getProbabilityToTakeHit()
        }
    }
  }
  
  getProbabilityToDodge(enemy: Fighter, attackType: AttackAction): number {

    const {speed, intelligence} = this.fighting.stats
    const {fighter, spirit, actions, logistics} = this.fighting
    
    if(!logistics.getHasDefendOpportunity(enemy))
      return 0

    let probability: number = 1


    if(enemy.state.hallucinating){
      probability -= 6
    }
    if(actions.currentInterruptibleAction == 'defend')
      probability += 4 + intelligence

    if(actions.currentMainAction == 'cautious retreat')
      probability += 2 + intelligence


    probability += speed * 3 - enemy.fighting.stats.speed * 3
    
    probability += spirit - enemy.fighting.spirit
    
    probability += intelligence

    if(attackType == 'critical strike')
      probability += 1

    if(logistics.hasLowStamina)
      probability ++

      
    if(actions.currentInterruptibleAction == 'recover')
      probability = probability * 0.3  + spirit * .4
    
    if(probability < 0)
      probability = 0
    

    return probability
  }

  getProbabilityToBlock(enemy: Fighter, attackType: AttackAction): number {
    const {strength, speed, intelligence} = this.fighting.stats
    const {spirit, actions, fighter, logistics} = this.fighting

    
    if(!logistics.getHasDefendOpportunity(enemy))
      return 0

    let probability: number = 0
   
    if(actions.currentInterruptibleAction == 'defend')
      probability += 10 + intelligence

    if(actions.currentMainAction == 'cautious retreat')
      probability += 8

          
    probability += strength * 3 - enemy.fighting.stats.strength * 3
          
    probability += speed - enemy.fighting.stats.speed
    
    probability += spirit - enemy.fighting.spirit
      
    probability += intelligence

    if(attackType == 'punch')
      probability += 1
      
    if(logistics.hasFullStamina)
      probability += 1

    if(enemy.state.takingADive){
      probability -= 6
    }

      
    if(actions.currentInterruptibleAction == 'recover')
      probability = probability * 0.2  + spirit * .5


    if(probability < 0)
      probability = 0

    return probability
  }
  
  getProbabilityToTakeHit(): number {
    return 5
  }
};
