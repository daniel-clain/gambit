import { Closeness } from "../../../../types/fighter/closeness"
import FighterFighting from "../fighter-fighting"
import { isEnemyFacingAway } from "../proximity"

export const getProbabilityToMoveToAttack = (fighting: FighterFighting): number => {
  const { aggression, intelligence } = fighting.stats
  const { proximity, logistics, rememberedEnemyBehind, movement, fighter, spirit} = fighting
  const enemyInfront = proximity.getClosestEnemyInfront()
  const closestEnemy = proximity.getClosestRememberedEnemy()

  let enemyInfrontCloseness: Closeness
  if (enemyInfront)
    enemyInfrontCloseness = proximity.getEnemyCombatCloseness(enemyInfront)


  let enemyBehindCloseness: Closeness
  if (rememberedEnemyBehind)
    enemyBehindCloseness = proximity.getEnemyCombatCloseness(rememberedEnemyBehind)


  const invalid: boolean =
    proximity.enemyWithinStrikingRange(closestEnemy)

  if (invalid)
    return 0

  let probability = 5

  
  probability += aggression * 4

  if (movement.moveActionInProgress == 'move to attack')
    probability += 500

  if (rememberedEnemyBehind &&  enemyBehindCloseness)

    if (logistics.isARetreatInProgress()) {
      probability += aggression
      probability -= 10 + intelligence * 2
    }

  if (logistics.hasFullStamina())
    probability += intelligence * 2

  if (logistics.hasFullSpirit())
    probability += intelligence * 2

  if (logistics.hasLowStamina())
    probability -= 5 + intelligence * 2

  if (logistics.hasLowSpirit())
    probability -= 5 + intelligence * 2

  if (isEnemyFacingAway(closestEnemy, fighter))
    probability += 5 + intelligence * 4 + aggression

  if (!logistics.hadActionRecently)
    probability += 10 + aggression * 2

  if (logistics.enemyHasLowStamina(closestEnemy)) {
    probability += aggression + intelligence * 2 
    if(logistics.hasFullSpirit())
      probability += 5
  }
  
  if (closestEnemy.fighting.animation.inProgress == 'recovering'){
    probability += aggression * 2
    probability += intelligence * 4
    
    if(logistics.hasFullSpirit())
      probability += 5
      
    if (logistics.enemyHasLowStamina(closestEnemy))
      probability += intelligence * 2

    if(logistics.hasLowSpirit())
      probability -= intelligence * 2
      
    if(logistics.hasLowStamina())
      probability -= intelligence * 2
  }

    
  if (proximity.trapped)
    probability += 10 + aggression + spirit * 2
  else if(proximity.flanked || movement.moveActionInProgress == 'retreat from flanked')
    probability -= intelligence * 4

  if (probability < 0)
    probability = 0

  return probability
}