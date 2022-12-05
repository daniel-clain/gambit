
import FighterFighting from "../fighter-fighting"
import { isEnemyFacingAway } from "../proximity"

export const getProbabilityToMoveToAttack = (fighting: FighterFighting, generalAttackProbability: number): number => {
  const { aggression, intelligence } = fighting.stats
  const { proximity, logistics, fighter, spirit, actions, timers, movement } = fighting

  const {decideActionProbability} = actions

  const closestEnemy = logistics.closestRememberedEnemy



  const invalid: boolean =
    proximity.enemyWithinStrikingRange(closestEnemy)

  if (invalid)
    return 0

  let probability = 5
  const instanceLog = decideActionProbability.logInstance('move to attack')
  const log = (...args) => {
    instanceLog(...args, 'probability', probability)
  }

  probability += generalAttackProbability
  log('getProbabilityForGeneralAttack')

  
  const moveTimer = timers.get('move action')
  if(moveTimer.active && movement.moveAction == 'move to attack'){
    moveTimer.timeElapsed
    probability += movement.getExponentialMoveFactor(500) 
  }

  if(logistics.onARampage)
    probability += 20

  probability += aggression * 4
  

  if (logistics.hasFullStamina)
    probability += intelligence * 2

  log('hasFullStamina', logistics.hasFullStamina)

  if (logistics.hasFullSpirit)
    probability += intelligence * 2

  log('hasFullSpirit', logistics.hasFullSpirit)

  if (logistics.hasLowStamina)
    probability -= 5 + intelligence * 2

  log('hasLowStamina', logistics.hasLowStamina)

  if (logistics.hasLowSpirit)
    probability -= 5 + intelligence * 2

  log('hasLowSpirit', logistics.hasLowSpirit)

  if (isEnemyFacingAway(closestEnemy, fighter))
    probability += 5 + intelligence * 4 + aggression

  log('isEnemyFacingAway', isEnemyFacingAway(closestEnemy, fighter))

  if (!logistics.hadActionRecently)
    probability += 10 + aggression * 2

  log('no action Recently', !logistics.hadActionRecently)

  if (logistics.enemyHasLowStamina(closestEnemy)) {
    probability += aggression + intelligence * 2 
    if(logistics.hasFullSpirit)
      probability += 5
  }
  log('enemyHasLowStamina', logistics.enemyHasLowStamina(closestEnemy))
  
  if (closestEnemy.fighting.actions.currentInterruptibleAction == 'recover'){
    probability += aggression * 2
    probability += intelligence * 4
    
    if(logistics.hasFullSpirit)
      probability += 5
      
    if (logistics.enemyHasLowStamina(closestEnemy))
      probability += intelligence * 2

    if(logistics.hasLowSpirit)
      probability -= intelligence * 2
      
    if(logistics.hasLowStamina)
      probability -= intelligence * 2
  }
  log('enemy recovering', closestEnemy.fighting.actions.currentInterruptibleAction == 'recover')

    
  if (logistics.trapped)
    probability += 10 + aggression + spirit * 2
  else if(logistics.flanked)
    probability -= intelligence * 4

  log('flanked', logistics.flanked)

  if (probability < 0)
    probability = 0

  return probability
}