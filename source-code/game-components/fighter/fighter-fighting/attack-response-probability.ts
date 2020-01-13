import FighterFighting from "./fighter-fighting"
import Fighter from "../fighter"
import { AttackType } from "../../../types/figher/attack-types"

export default class AttackResponseProbability {
  
  constructor(private fighting: FighterFighting){}

  
  getProbabilityToDodge(enemy: Fighter, attackType: AttackType): number {

    const {speed, intelligence} = this.fighting.stats
    const {actions, proximity, stamina, knockedOut} = this.fighting

    const defending = actions.actionInProgress == 'defending'

    let probability: number = 0
    
    if(proximity.isFacingAwayFromEnemy(enemy) 
    || !(this.doingCautiousRetreat() || defending)
    || knockedOut){
      return 0
    }

    if(defending)
      probability += 6

    if(this.doingCautiousRetreat())
      probability += 3

    probability += speed * 3 - enemy.fighting.stats.speed * 3
    
    probability += intelligence

    if(attackType == 'critical strike')
      probability ++

    if(this.hasLowStamina() || this.hasLowSpirit())
      probability ++

    
    if(probability < 0)
      probability = 0
    

    return probability
  }

  getProbabilityToBlock(enemy: Fighter, attackType: AttackType): number {
    const {strength, speed, aggression, intelligence} = this.fighting.stats
    const {stamina, spirit, actions, activeTimers, proximity, knockedOut} = this.fighting

    const defending = actions.actionInProgress == 'defending'

    let probability: number = 0

    
    if(proximity.isFacingAwayFromEnemy(enemy) || 
    !(this.doingCautiousRetreat() || defending)
    || knockedOut){
      return 0
    }

    if(defending)
      probability += 5

    if(this.doingCautiousRetreat())
      probability += 4
    
    probability += strength * 3 - enemy.fighting.stats.strength * 3
          
    probability += speed - enemy.fighting.stats.speed
    
    probability += spirit - enemy.fighting.spirit
      
    probability += intelligence

    if(attackType == 'punch')
      probability ++

      
    if(this.hasFullStamina() || this.hasFullSpirit())
      probability ++
      
    if(probability < 0)
      probability = 0

    return probability
  }
  
  getProbabilityToTakeHit(enemy: Fighter, attackType: AttackType): number {
    const {spirit} = this.fighting

    let probability: number = 2

    if(attackType == 'critical strike')
      probability += 2

    const spiritDiff = spirit - enemy.fighting.spirit
    if(!(spiritDiff < 0))
    probability += spiritDiff


    if(probability < 0)
      probability = 0


    return probability
  }


  private doingCautiousRetreat(): boolean{
    return this.fighting.activeTimers.some(timer => timer.name == 'doing cautious retreat')
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
