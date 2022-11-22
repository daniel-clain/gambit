import FighterFighting from "../fighter-fighting"
import { isEnemyFacingAway, isFacingAwayFromEnemy } from "../proximity"

export const getProbabilityToDefend = (fighting: FighterFighting): number => {
  const { proximity, logistics, fighter} = fighting
  const { intelligence, speed, strength, aggression } = fighting.stats
  const closestEnemy = logistics.closestRememberedEnemy

  const enemyAction = closestEnemy.fighting.actions.currentInterruptibleAction

  if (
    isFacingAwayFromEnemy(closestEnemy, fighter) ||
    logistics.onARampage
  )
    return 0

  let probability = 10

  probability -= aggression * 3


  if (isEnemyFacingAway(closestEnemy, fighter))
    probability -= intelligence * 8

  if (logistics.isEnemyAttacking(closestEnemy))
    probability += intelligence * 3

  if (!logistics.hasFullStamina)
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

    if(logistics.hasLowStamina) {
      probability -= intelligence * 2
      
      if (closestEnemy.fighting.stats.speed < speed - 3){
        probability -= intelligence * 2
      }
    }
    
  }


  if (logistics.rememberedEnemyBehind == null)
    probability += intelligence * 2

  
  if (
    enemyAction != 'pre punch' &&
    enemyAction != 'pre critical strike'
  ){
    probability -= intelligence * 2
    if (enemyAction == 'recover')
      probability -= 10 + intelligence * 6
  }
  else    
    probability += intelligence * 4

  if (logistics.flanked)
    probability -= intelligence * 4

  if (logistics.rememberedEnemyBehind == undefined)
    probability -= intelligence * 3

  if (probability < 0)
    probability = 0

  return probability
}