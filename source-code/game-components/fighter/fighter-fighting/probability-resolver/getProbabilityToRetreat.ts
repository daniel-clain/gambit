
import { Closeness } from "../../../../types/fighter/closeness"
import FighterFighting from "../fighter-fighting"
import { getProbabilityForGeneralRetreat } from "./getProbabilityForGeneralRetreat"

export const getProbabilityToRetreat = (fighting: FighterFighting): number => {
  const { proximity, logistics, movement, actions} = fighting
  const { intelligence } = fighting.stats

  const {decideActionProbability} = actions
  const closestEnemy = proximity.getClosestRememberedEnemy()

  const invalid: boolean =
    proximity.getEnemyCombatCloseness(closestEnemy) <= Closeness['close'] ||   
    logistics.onARampage ||
    logistics.hasFullStamina() ||
    movement.moveActionInProgress == 'reposition'

  if (invalid)
    return 0

  let probability = 0

  const instanceLog = decideActionProbability.logInstance('retreat')
  const log = (...args) => {
    instanceLog(...args, 'probability', probability)
  }

  probability += getProbabilityForGeneralRetreat(fighting)
  log('getProbabilityForGeneralRetreat')

  if (movement.moveActionInProgress == 'retreat')
  log('moveActionInProgress', movement.moveActionInProgress == 'retreat')
    probability += 500   

  if (proximity.flanked)
    probability -= intelligence * 3

  if (probability < 0)
    probability = 0

  return probability
}
