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
  const { proximity, logistics, timers, actions, movement } = fighting
  const enemyBehind = fighting.logistics.rememberedEnemyBehind

  const enemiesInFront: number = logistics.enemiesInFront.length
  const enemiesStillFighting: number =
    logistics.otherFightersStillFighting.length

  const assumedNumberOfEnemiesBehind = enemiesStillFighting - enemiesInFront

  const invalid: boolean =
    enemyBehind === null || assumedNumberOfEnemiesBehind === 0
  if (invalid) return 0

  const { intelligence } = fighting.stats

  const closestEnemy = logistics.closestRememberedEnemy
  const enemyInFront = logistics.closestEnemyInFront

  const inFrontCloseness = enemyInFront
    ? proximity.getEnemyCombatCloseness(enemyInFront)
    : undefined

  const { decideActionProbability } = actions
  const instanceLog = decideActionProbability.logInstance("check flank")
  const log = (...args: any[]) => {
    instanceLog(...args, "probability", probability)
  }

  let probability = 0

  if (logistics.onARampage) {
    if (enemyInFront) return 0
    else probability += 10
    log("on a rampage, enemy in front: ", enemyInFront)
  }

  if (
    (timers.isActive("move action") &&
      movement.moveAction == "desperate retreat",
    logistics.lowEnergy)
  ) {
    probability += intelligence * 3
  }

  if (enemyBehind === undefined) {
    if (enemyInFront) {
      if (inFrontCloseness == Closeness["striking range"]) {
        if (logistics.hasRetreatOpportunity(enemyInFront)) {
          probability += intelligence * 2
        }
      } else {
        probability += intelligence * 4
      }
    } else {
      probability += 10 + intelligence * 6
    }

    log("done remember enemy behind, enemy in front: ", enemyInFront)
  } else if (enemyBehind === null) {
    return 0
  } else {
    const memoryOfBehindElapsed = timers.get("memory of enemy behind")
      .elapsedTime!

    const behindCloseness = proximity.getEnemyCombatCloseness(enemyBehind)

    let enemyBehindProbability = 0

    if (enemyInFront) {
      if (inFrontCloseness == Closeness["striking range"]) {
        if (logistics.hasRetreatOpportunity(enemyInFront)) {
          enemyBehindProbability += intelligence
        }
      } else {
        enemyBehindProbability += intelligence * 2
      }
    } else {
      enemyBehindProbability += intelligence * 3
    }

    if (
      (timers.isActive("move action") &&
        movement.moveAction == "desperate retreat",
      logistics.lowEnergy) &&
      behindCloseness > Closeness["close"]
    ) {
      probability += intelligence * 5
    }

    const exponent =
      (memoryOfBehindElapsed / 1000) * (intelligence * 0.05) - 0.1

    /* eg for 10 probability, exponential probability over time
      - 1 sec
        ~ int 1 = -.109
        ~ int 5 = .413
        ~ int 10 = 1.512
      - 3 secs
        ~ int 1 = .122
        ~ int 5 = 3.467
        ~ int 10 = 24.119
      - 5 secs
        ~ int 1 = .413
        ~ int 5 = 13.125
        ~ int 10 = 250
    */
    const pow = Math.pow(enemyBehindProbability, exponent)
    probability += pow

    log("enemy behind, time:", memoryOfBehindElapsed)
  }

  if (probability < 0) probability = 0

  return round(probability, 2)
}
