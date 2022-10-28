import FighterFighting from "../fighter-fighting"
import { isEnemyFacingAway } from "../proximity"
import { getProbabilityForGeneralAttack } from "./getProbabilityForGeneralAttack"

export const getProbabilityToCriticalStrike = (fighting: FighterFighting): number => {
  const { aggression, intelligence} = fighting.stats
  const { logistics, fighter, proximity} = fighting
  const closestEnemy = proximity.getClosestRememberedEnemy()

  let probability = 0

  probability += getProbabilityForGeneralAttack(fighting)

  
  if (closestEnemy.fighting.animation.inProgress == 'recovering'){
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

  
  if (logistics.hasFullSpirit()) {
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