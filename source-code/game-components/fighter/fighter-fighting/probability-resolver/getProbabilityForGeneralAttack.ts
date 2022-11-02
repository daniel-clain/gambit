import FighterFighting from "../fighter-fighting";
import { isEnemyFacingAway } from "../proximity";

export const getProbabilityForGeneralAttack = (fighting: FighterFighting): number => {
  const { proximity, logistics, fighter, movement, spirit, actions} = fighting
  const { intelligence, speed, aggression, strength } = fighting.stats
  const closestEnemy = proximity.getClosestRememberedEnemy()
  
  let probability = 20
  
  if (movement.moveActionInProgress == 'move to attack')
    probability += 10
  else 
    probability -= 10

  
  if (movement.moveActionInProgress == 'reposition'){
    probability -= 10 + 4 * intelligence
  }

  probability += aggression

  if(logistics.onARampage)
    probability += 10
  
  
  if(closestEnemy.fighting.animation.inProgress == 'defending')
    probability -= intelligence * 2
  
  if (proximity.trapped)
    probability += 10 + aggression + spirit*2
  else if(proximity.flanked && !logistics.onARampage)
    probability -= intelligence * proximity.flanked.severityRating

  if(logistics.hasAttackOpportunity(closestEnemy)){
    probability += 3 * intelligence
    probability += aggression

    if(closestEnemy.fighting.animation.inProgress == 'recovering'){
      probability += intelligence * 2
      probability += aggression
    }
    if (isEnemyFacingAway(closestEnemy, fighter)){
      probability += intelligence * 2
      probability += aggression
    }
  }
  if (logistics.enemyHasLowStamina(closestEnemy)){
    probability += 2 + intelligence * 2
    probability += aggression * 2
  }
  if (logistics.enemyHasLowStamina(closestEnemy)){
    probability += 2 + intelligence * 2
    probability += aggression * 2
  }
    
  if (!logistics.hadActionRecently)
    probability += 5 + aggression * 2

  if (logistics.hasFullStamina()){
    probability += intelligence * 2
    probability += aggression
  }

  if (logistics.justBlocked || logistics.justDodged){
    if(logistics.hasLowStamina())
      probability -= intelligence
    else
      probability += intelligence * 4
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
    else{
      probability += 6 + intelligence
      probability += aggression
    }


    if (closestEnemy.fighting.stats.strength > strength)
      probability -= intelligence
    else{
      probability += 6 + intelligence
      probability += aggression
    }

    if (logistics.hasLowStamina())
      probability -= intelligence * 4

    if (logistics.hasLowSpirit())
      probability -= intelligence * 3
  }



  return probability
  
}