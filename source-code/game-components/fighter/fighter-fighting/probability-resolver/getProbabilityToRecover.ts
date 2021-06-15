
import { Closeness } from "../../../../types/fighter/closeness";
import FighterFighting from "../fighter-fighting";

export const getProbabilityToRecover = (fighting: FighterFighting): number => {
  const { intelligence } = fighting.stats
  const { proximity, logistics, rememberedEnemyBehind, spirit} = fighting
  const enemyInfront = proximity.getClosestEnemyInfront()

  let enemyInfrontCloseness: Closeness
  if (enemyInfront)
    enemyInfrontCloseness = proximity.getEnemyCombatCloseness(enemyInfront)


  let enemyBehindCloseness: Closeness
  if (rememberedEnemyBehind)
    enemyBehindCloseness = proximity.getEnemyCombatCloseness(rememberedEnemyBehind)


  const invalid: boolean =
    logistics.hasFullStamina() ||
    logistics.onARampage

  if (invalid)
    return 0

  let probability = 10

  
  if(proximity.trapped)
    probability -= intelligence * 3

  if (rememberedEnemyBehind === undefined)
    probability -= intelligence * 2

  if (rememberedEnemyBehind !== null && enemyBehindCloseness >= Closeness['nearby']){
    if(rememberedEnemyBehind.fighting.animation.inProgress == 'recovering')
      probability += intelligence
    else
      probability -= intelligence * 2
  }

  if (enemyInfront && enemyInfrontCloseness <= Closeness['nearby'])
    probability -= intelligence * 2


  if (logistics.justTookHit){
    probability += 4 + (5 - spirit)
  }
  if (logistics.hasLowStamina()){
    probability += 4
  }
  if (logistics.hasLowSpirit()){
    probability += 4
  }
  if (proximity.againstEdge){
    probability += 6
  }

  if (
    enemyInfront &&
    enemyBehindCloseness <= Closeness['far'] &&
    logistics.isEnemyTargetingThisFighter(enemyInfront)
  )
    probability -= intelligence * 2

  if(
    rememberedEnemyBehind &&
    enemyBehindCloseness <= Closeness['far'] &&
    logistics.isEnemyTargetingThisFighter(rememberedEnemyBehind)
  )
    probability -= intelligence * 2
  else{      
    if (logistics.hasLowStamina())
      probability += intelligence * 2

    if (logistics.hasLowSpirit())
      probability += intelligence * 2
  }

    
  if (
    enemyInfront &&
    enemyBehindCloseness <= Closeness['nearby'] &&
    logistics.isEnemyTargetingThisFighter(enemyInfront)
  )
    probability -= intelligence * 4
  else{      
    if (logistics.hasLowStamina())
      probability += intelligence

    if (logistics.hasLowSpirit())
      probability += intelligence
  }

  if(
    rememberedEnemyBehind &&
    enemyBehindCloseness <= Closeness['nearby'] &&
    logistics.isEnemyTargetingThisFighter(rememberedEnemyBehind)
  )
    probability -= intelligence * 4
  else{      
    if (logistics.hasLowStamina())
      probability += intelligence

    if (logistics.hasLowSpirit())
      probability += intelligence
  }


  if (
    (!enemyInfront || enemyInfrontCloseness == Closeness['very far']) &&
    (rememberedEnemyBehind === null || enemyBehindCloseness == Closeness['very far'])
  ) {
    probability += intelligence * 3

    if (logistics.hasLowStamina())
      probability += intelligence * 2

    if (logistics.hasLowSpirit())
      probability += intelligence * 2
  }

  if (probability < 0)
    probability = 0

  return probability
}