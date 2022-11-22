import { Closeness } from "../../../../types/fighter/closeness";
import FighterFighting from "../fighter-fighting";

export function getProbabilityToDesperateRetreat(fighting: FighterFighting, generalAttackProbability: number){
  const { intelligence } = fighting.stats
  const { logistics, proximity, fighter, spirit } = fighting
  const enemy = logistics.closestRememberedEnemy
  const enemyCloseness = proximity.getEnemyCombatCloseness(enemy)
  const enemyAttacking = logistics.isEnemyAttacking(enemy)

  const invalid: boolean = (
    !logistics.highEnergy ||
    spirit >= 2
  )

  if (invalid) return

  let probability = generalAttackProbability

  if(spirit == 2)
    probability += 10 
    
  if(spirit == 1)
    probability += 20 

  if(spirit == 0)
    probability += 30 

  if(logistics.hasLowStamina)
    probability += 6 + intelligence * 4

  if(enemyCloseness == Closeness['striking range']){
    if(logistics.hasRetreatOpportunity(enemy)){
      probability += intelligence
    }
    else{
      probability -= intelligence * 4
    }
  }
  if(enemyCloseness == Closeness['close']){
    if(logistics.hasRetreatOpportunity(enemy)){
      probability += intelligence * 4
    }
  }

  if (probability < 0)
    probability = 0

  return probability
}