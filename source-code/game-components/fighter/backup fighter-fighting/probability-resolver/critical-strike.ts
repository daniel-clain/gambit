import FighterFighting from "../fighter-fighting"
import { isEnemyFacingAway } from "../proximity"

export const getProbabilityToCriticalStrike = (fighting: FighterFighting, generalAttackProbability: number): number => {
  const { aggression, intelligence} = fighting.stats
  const { logistics, fighter, proximity} = fighting
  const closestEnemy = logistics.closestRememberedEnemy

  let probability = 0

  probability += generalAttackProbability

  if(logistics.hasAttackOpportunity(closestEnemy)){
    probability += 3 * intelligence
    probability += aggression

    if(closestEnemy.fighting.actions.currentInterruptibleAction == 'recover'){
      probability += intelligence * 2
      probability += aggression
    }
    if (isEnemyFacingAway(closestEnemy, fighter)){
      probability += intelligence * 2
      probability += aggression
    }
  }

  
  if (closestEnemy.fighting.actions.currentInterruptibleAction == 'recover'){
    probability += aggression
    probability += intelligence
  }

  if (isEnemyFacingAway(closestEnemy, fighter)){
    probability += intelligence
    probability += aggression
  }

  if (logistics.enemyHasLowSpirit(closestEnemy))
    probability += intelligence

  if (logistics.enemyHasLowStamina(closestEnemy)) {
    probability += 6
    probability += aggression
    probability += intelligence
  }

  if(logistics.onARampage)
    probability += 3

  
  if (logistics.hasFullSpirit) {
    probability += 1
    probability += aggression
    probability += intelligence
  }
  
  if(fighter.state.hallucinating && 
    !proximity.enemyWithinStrikingRange(closestEnemy)){
    probability *= .1
  }

  if (probability < 0)
    probability = 0

  return probability
}