import { Closeness } from "../../../../types/fighter/closeness"
import FighterFighting from "../fighter-fighting"
import { isEnemyFacingAway } from "../proximity"
import { getProbabilityForGeneralAttack } from "./getProbabilityForGeneralAttack"

export const getProbabilityToMoveToAttack = (fighting: FighterFighting): number => {
  const { aggression, intelligence } = fighting.stats
  const { proximity, logistics, rememberedEnemyBehind, movement, fighter, spirit, actions} = fighting

  const {decideActionProbability} = actions

  const enemyInFront = proximity.getClosestEnemyInFront()
  const closestEnemy = proximity.getClosestRememberedEnemy()

  let enemyInFrontCloseness: Closeness
  if (enemyInFront)
    enemyInFrontCloseness = proximity.getEnemyCombatCloseness(enemyInFront)


  let enemyBehindCloseness: Closeness
  if (rememberedEnemyBehind)
    enemyBehindCloseness = proximity.getEnemyCombatCloseness(rememberedEnemyBehind)


  const invalid: boolean =
    proximity.enemyWithinStrikingRange(closestEnemy)

  if (invalid)
    return 0

  let probability = 5
  const instanceLog = decideActionProbability.logInstance('move to attack')
  const log = (...args) => {
    instanceLog(...args, 'probability', probability)
  }

  probability += getProbabilityForGeneralAttack(fighting)
  log('getProbabilityForGeneralAttack')

  if(logistics.onARampage)
    probability += 20

  probability += aggression * 4

  if (movement.moveActionInProgress == 'move to attack')
    probability += 400
  
  log('moveActionInProgress move to attack', movement.moveActionInProgress)
  
  
  log('isARetreatInProgress', logistics.isARetreatInProgress())
  if (logistics.isARetreatInProgress()) {
    probability += aggression
    probability -= 10 + intelligence * 2
  }

  if (logistics.hasFullStamina())
    probability += intelligence * 2

  log('hasFullStamina', logistics.hasFullStamina())

  if (logistics.hasFullSpirit())
    probability += intelligence * 2

  log('hasFullSpirit', logistics.hasFullSpirit())

  if (logistics.hasLowStamina())
    probability -= 5 + intelligence * 2

  log('hasLowStamina', logistics.hasLowStamina())

  if (logistics.hasLowSpirit())
    probability -= 5 + intelligence * 2

  log('hasLowSpirit', logistics.hasLowSpirit())

  if (isEnemyFacingAway(closestEnemy, fighter))
    probability += 5 + intelligence * 4 + aggression

  log('isEnemyFacingAway', isEnemyFacingAway(closestEnemy, fighter))

  if (!logistics.hadActionRecently)
    probability += 10 + aggression * 2

  log('!hadActionRecently', !logistics.hadActionRecently)

  if (logistics.enemyHasLowStamina(closestEnemy)) {
    probability += aggression + intelligence * 2 
    if(logistics.hasFullSpirit())
      probability += 5
  }
  log('enemyHasLowStamina', logistics.enemyHasLowStamina(closestEnemy))
  
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
  log('enemy recovering', closestEnemy.fighting.animation.inProgress == 'recovering')

    
  if (proximity.trapped)
    probability += 10 + aggression + spirit * 2
  else if(proximity.flanked)
    probability -= intelligence * 4

  log('flanked', proximity.flanked)

  if (probability < 0)
    probability = 0

  return probability
}