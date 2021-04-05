import FighterFighting from "../fighter-fighting"
import { isEnemyFacingAway, isFacingAwayFromEnemy } from "../proximity"

export const getProbabilityToDefend = (fighting: FighterFighting): number => {
  const { proximity, logistics, rememberedEnemyBehind, fighter} = fighting
  const { intelligence, speed, strength, aggression } = fighting.stats
  const closestEnemy = proximity.getClosestRememberedEnemy()

  if (
    isFacingAwayFromEnemy(closestEnemy, fighter) ||
    logistics.onARampage
  )
    return 0

  let probability = 10

  probability -= aggression * 3

  if(proximity.trapped){
    probability -= intelligence
    probability -= aggression * 2
  }

  if (isEnemyFacingAway(closestEnemy, fighter))
    probability -= intelligence * 8

  if (logistics.isEnemyTargetingThisFighter(closestEnemy))
    probability += intelligence * 3

  if (!logistics.hasFullStamina())
    probability += intelligence * 3

  if (logistics.enemyIsOnARampage(closestEnemy))
    probability + intelligence * 6

  if (closestEnemy.fighting.stats.speed > speed + 3){
    probability += intelligence * 3
    if(closestEnemy.fighting.logistics.onARampage)
      probability += intelligence * 2
  }
  
  if (closestEnemy.fighting.stats.aggression > speed + 3){
    probability += intelligence * 3
    if(closestEnemy.fighting.logistics.onARampage)
      probability += intelligence * 2

  }

  
  if (closestEnemy.fighting.stats.speed < speed){
    probability -= intelligence
    if(closestEnemy.fighting.logistics.onARampage)
      probability -= intelligence

    if(logistics.hasLowStamina()) {
      probability -= intelligence * 2
      
      if (closestEnemy.fighting.stats.speed < speed - 3){
        probability -= intelligence * 2
      }
    }
    
  }


  if (rememberedEnemyBehind == null)
    probability += intelligence * 2

  
  if (
    closestEnemy.fighting.animation.inProgress != 'defending' &&
    closestEnemy.fighting.animation.inProgress != 'trying to critical strike' &&
    closestEnemy.fighting.animation.inProgress != 'trying to punch'
  ){
    probability -= intelligence * 2
    if (closestEnemy.fighting.animation.inProgress == 'recovering')
      probability -= 10 + intelligence * 6
  }
  else    
    probability += intelligence * 4

  if (proximity.flanked)
    probability -= intelligence * 4

  if (rememberedEnemyBehind == undefined)
    probability -= intelligence * 3

  if (probability < 0)
    probability = 0

  return probability
}