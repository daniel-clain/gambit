import { round } from "lodash"
import { Closeness } from "../../../../types/fighter/closeness"
import FighterFighting from "../fighter-fighting"

/* 
  - other actions should be high probability and drown out this one based on
    - behind is attacking
      - high chance to retreat
    - if they are close
      - high chance to retreat or attack
    - if not close or attacking 
      - high chance to recover or attack

  - main influence to check is how long its been since

  - if behind is coming to attack
    - makes no sense to increase probability because needs to retreat instead of check
      - standard check based on elapsed should be accurate whether attacking or not, cos if they're not attacking, then this will have a higher relative probability



  - if only small ratio infront, that means large ratio behind
    - makes no sense to increase probability, if lots behind and none are attacking, theyre probably attacking eachother. if 
    
  - if 1 behind and not attacking, makes more sense to check, because eventually he will probably attack


*/

export const getProbabilityToCheckFlank = (
  fighting: FighterFighting
): number => {
  const { proximity, logistics, timers, actions } = fighting
  const enemyBehind = fighting.logistics.rememberedEnemyBehind

  const invalid: boolean = enemyBehind === null
  if (invalid) return 1

  const { intelligence } = fighting.stats

  const closestEnemy = logistics.closestRememberedEnemy
  const enemyInFront = logistics.closestEnemyInFront

  const inFrontCloseness = enemyInFront
    ? proximity.getEnemyCombatCloseness(enemyInFront)
    : undefined

  const enemiesInFront: number = logistics.enemiesInFront.length
  const enemiesStillFighting: number =
    logistics.otherFightersStillFighting.length

  const assumedNumberOfEnemiesBehind = enemiesStillFighting - enemiesInFront

  const { decideActionProbability } = actions
  const instanceLog = decideActionProbability.logInstance("check flank")
  const log = (...args: any[]) => {
    instanceLog(...args, "probability", probability)
  }

  let probability = 0

  if (logistics.onARampage) {
    if (enemyInFront) probability -= 6
    else probability += 6
    log("on a rampage, enemy in front: ", enemyInFront)
  }

  if (enemyBehind === undefined) {
    if (assumedNumberOfEnemiesBehind == 0) {
      return 1
    } else if (enemyInFront) {
      probability += 4 + intelligence
      if (inFrontCloseness == Closeness["striking range"]) {
        if (closestEnemy && !logistics.hasRetreatOpportunity(closestEnemy)) {
          probability -= intelligence
        }
      } else {
        probability += intelligence
      }
    } else {
      probability += 6 + intelligence * 2
    }

    log("done remember enemy behind, enemy in front: ", enemyInFront)
  } else {
    const enemyBehindCloseness = proximity.getEnemyCombatCloseness(enemyBehind!)
    const memoryOfBehindElapsed = timers.get("memory of enemy behind")
      .elapsedTime!

    let enemyBehindProbability = 6 + intelligence

    if (
      (enemyBehind && logistics.isEnemyAttacking(enemyBehind)) ||
      assumedNumberOfEnemiesBehind == 1
    ) {
      enemyBehindProbability += intelligence

      if (enemyBehindCloseness <= Closeness["nearby"]) {
        probability += 6
      }

      log("enemy behind closeness: ", enemyBehindCloseness)
    }

    if (enemyInFront) {
      if (inFrontCloseness == Closeness["striking range"]) {
        if (!logistics.hasRetreatOpportunity(closestEnemy!))
          enemyBehindProbability -= intelligence
      } else probability += intelligence
    } else enemyBehindProbability += intelligence * 2

    const exponent =
      (memoryOfBehindElapsed / 1000) * (0.25 + intelligence * 0.005) - 0.2
    const pow = Math.pow(enemyBehindProbability, exponent)
    probability += pow

    log("enemy behind, time:", memoryOfBehindElapsed)
  }

  if (probability < 0) probability = 0

  return round(probability)
}
