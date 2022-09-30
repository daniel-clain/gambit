import FighterFighting from "../fighter-fighting";
import { isEnemyFacingAway } from "../proximity";

export const getProbabilityForGeneralAttack = (fighting: FighterFighting): number => {
  const { proximity, logistics, fighter, movement, spirit} = fighting
  const { intelligence, speed, aggression, strength } = fighting.stats
  const closestEnemy = proximity.getClosestRememberedEnemy()
  
  let probability = 0
  
  if (movement.moveActionInProgress == 'move to attack')
    probability += 5

  probability += aggression
  
  if(
    closestEnemy.fighting.animation.inProgress == 'recovering' ||
    closestEnemy.fighting.animation.inProgress == 'doing cooldown'
  ){
    probability += intelligence * 3
    probability += aggression
  }
  
  if(closestEnemy.fighting.animation.inProgress == 'defending')
    probability -= intelligence * 2
  
  if (proximity.trapped)
    probability += 10 + aggression + spirit*2
  else if(proximity.flanked)
    probability -= intelligence * 4


    
  if (!logistics.hadActionRecently)
    probability += 5 + aggression * 2

  if (logistics.hasFullStamina())
    probability += intelligence * 2

  if (logistics.justBlocked || logistics.justDodged){
    probability += intelligence * 3
    probability += aggression
  }
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
      probability -= intelligence * 4

    if (logistics.hasLowSpirit())
      probability -= intelligence * 3
  }

  if (isEnemyFacingAway(closestEnemy, fighter))
    probability += intelligence * 5

  return probability
  
}