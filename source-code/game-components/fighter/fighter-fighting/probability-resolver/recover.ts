import { round } from "lodash"
import { Closeness } from "../../../../types/fighter/closeness"
import Fighter from "../../fighter"
import FighterFighting from "../fighter-fighting"

export const getProbabilityToRecover = (fighting: FighterFighting): number => {
  const { intelligence } = fighting.stats
  const { proximity, logistics, spirit, movement, energy, timers } = fighting
  const enemyInFront: Fighter | undefined = logistics.closestEnemyInFront

  const justRecovered = timers.get("just recovered").active

  const enemyBehind: Fighter | null | undefined =
    logistics.rememberedEnemyBehind

  const enemyInFrontCloseness =
    enemyInFront && proximity.getEnemyCombatCloseness(enemyInFront)

  const hasRetreatOpportunityFromInFront =
    enemyInFront && logistics.hasRetreatOpportunity(enemyInFront)

  const inFrontOnRampage =
    enemyInFront && logistics.enemyIsOnARampage(enemyInFront)

  const enemyBehindCloseness =
    enemyBehind && proximity.getEnemyCombatCloseness(enemyBehind)

  const hasRetreatOpportunityFromBehind =
    enemyBehind && logistics.hasRetreatOpportunity(enemyBehind)
  const behindOnRampage =
    enemyBehind && logistics.enemyIsOnARampage(enemyBehind)

  const lowStamina = logistics.hasLowStamina
  const lowSpirit = logistics.hasLowSpirit
  const lowEnergy = logistics.lowEnergy

  const invalid: boolean =
    logistics.onARampage || (logistics.hasFullEnergy && logistics.hasFullEnergy)

  if (invalid) return 0

  let probability = 10
  probability = +justRecovered ? 10 : 0

  if (lowStamina) probability += 10

  if (lowSpirit) probability += 10

  if (lowEnergy) probability += 10

  if (logistics.hasFullStamina) probability -= 20

  if (logistics.justTookHit) probability += 40 - spirit * 5

  if (enemyInFront && inFrontOnRampage) {
    probability -= intelligence * 6
  }

  if (enemyBehind) {
    if (behindOnRampage) probability -= intelligence * 6

    if (enemyBehindCloseness! >= Closeness["far"]) {
      if (!enemyInFront) {
        behindFar()
      } else if (enemyInFrontCloseness! >= Closeness["far"]) {
        inFrontFarAndBehindFar()
      } else if (enemyInFrontCloseness == Closeness["nearby"]) {
        inFrontNearAndBehindFar()
      } else if (enemyInFrontCloseness == Closeness["close"]) {
        inFrontCloseAndBehindFar()
      } else if (enemyInFrontCloseness == Closeness["striking range"]) {
        inFrontStrikingAndBehindFar()
      }
    } else if (enemyBehindCloseness == Closeness["nearby"]) {
      if (!enemyInFront) {
        behindNear()
      } else if (enemyInFrontCloseness! >= Closeness["far"]) {
        inFrontFarAndBehindNear()
      } else if (enemyInFrontCloseness == Closeness["nearby"]) {
        inFrontNearAndBehindNear()
      } else if (enemyInFrontCloseness == Closeness["close"]) {
        inFrontCloseAndBehindNear()
      } else if (enemyInFrontCloseness == Closeness["striking range"]) {
        inFrontStrikingAndBehindNear()
      }
    } else if (enemyBehindCloseness == Closeness["close"]) {
      if (!enemyInFront) {
        behindClose()
      } else if (enemyInFrontCloseness! >= Closeness["far"]) {
        inFrontFarAndBehindClose()
      } else if (enemyInFrontCloseness == Closeness["nearby"]) {
        inFrontNearAndBehindClose()
      } else if (enemyInFrontCloseness == Closeness["close"]) {
        inFrontCloseAndBehindClose()
      } else if (enemyInFrontCloseness == Closeness["striking range"]) {
        inFrontStrikingAndBehindClose()
      }
    } else if (enemyBehindCloseness == Closeness["striking range"]) {
      if (!enemyInFront) {
        behindStriking()
      } else if (enemyInFrontCloseness! >= Closeness["far"]) {
        inFrontFarAndBehindStriking()
      } else if (enemyInFrontCloseness == Closeness["nearby"]) {
        inFrontNearAndBehindStriking()
      } else if (enemyInFrontCloseness == Closeness["close"]) {
        inFrontCloseAndBehindStriking()
      } else if (enemyInFrontCloseness == Closeness["striking range"]) {
        inFrontStrikingAndBehindStriking()
      }
    }
  } else if (enemyBehind === null) {
    if (enemyInFrontCloseness! >= Closeness["far"]) {
      inFrontFar()
    } else if (enemyInFrontCloseness == Closeness["nearby"]) {
      inFrontNear()
    } else if (enemyInFrontCloseness == Closeness["close"]) {
      inFrontClose()
    } else if (enemyInFrontCloseness == Closeness["striking range"]) {
      inFrontStriking()
    }

    if (enemyInFrontCloseness! > Closeness["close"]) {
      if (proximity.againstEdge) {
        probability += 4
      }

      if (logistics.lowEnergy) {
        probability += 4

        if (movement.moveAction == "desperate retreat") {
          probability += 4
        }
      }
    }
  } else if (enemyBehind === undefined) {
    const otherFighters = logistics.otherFightersStillFighting
    const allFightersInFront =
      logistics.enemiesInFront.length == otherFighters.length

    if (allFightersInFront) {
      if (enemyInFrontCloseness! >= Closeness["far"]) {
        inFrontFar()
      } else if (enemyInFrontCloseness == Closeness["nearby"]) {
        inFrontNear()
      } else if (enemyInFrontCloseness == Closeness["close"]) {
        inFrontClose()
      } else if (enemyInFrontCloseness == Closeness["striking range"]) {
        inFrontStriking()
      }
    } else {
      probability -= intelligence * 6

      if (enemyInFrontCloseness! >= Closeness["far"]) {
        inFrontFarAndDontKnowBehind()
      } else if (enemyInFrontCloseness == Closeness["nearby"]) {
        inFrontNearAndDontKnowBehind()
      } else if (enemyInFrontCloseness == Closeness["close"]) {
        inFrontCloseAndDontKnowBehind()
      } else if (enemyInFrontCloseness == Closeness["striking range"]) {
        inFrontStrikingAndDontKnowBehind()
      }
    }
  }

  if (probability < 0) probability = 0

  return round(probability, 2)

  /* functions */

  function inFrontFarAndBehindFar() {
    //console.log('inFrontFarAndBehindFar');
    probability += intelligence * 4
    if (lowStamina) probability += intelligence * 4
    if (lowSpirit) probability += intelligence * 2
    if (lowEnergy) probability += intelligence

    if (hasRetreatOpportunityFromInFront) probability += intelligence * 2
    if (hasRetreatOpportunityFromBehind) probability += intelligence * 2
  }

  function inFrontNearAndBehindFar() {
    //console.log('inFrontNearAndBehindFar');
    probability += intelligence * 2
    if (lowStamina) probability += intelligence * 4
    if (lowSpirit) probability += intelligence * 2
    if (lowEnergy) probability += intelligence

    if (hasRetreatOpportunityFromInFront) {
      probability += intelligence * 2
    } else {
      probability -= intelligence * 2
    }
  }

  function inFrontCloseAndBehindFar() {
    //console.log('inFrontCloseAndBehindFar');

    if (hasRetreatOpportunityFromInFront) {
      if (lowStamina) probability += intelligence * 5
      if (lowSpirit) probability += intelligence * 3
      if (lowEnergy) probability += intelligence
    } else {
      probability -= intelligence * 4
    }
  }
  // behind near

  function inFrontFarAndBehindNear() {
    //console.log('inFrontFarAndBehindNear');
    probability -= intelligence * 4

    if (hasRetreatOpportunityFromBehind) {
      if (lowStamina) probability += intelligence * 6
      if (lowSpirit) probability += intelligence * 4
      if (lowEnergy) probability += intelligence * 2
    } else {
      probability -= intelligence * 4
    }
  }
  function inFrontNearAndBehindNear() {
    //console.log('inFrontNearAndBehindNear');
    probability -= intelligence * 4

    if (hasRetreatOpportunityFromInFront && hasRetreatOpportunityFromBehind) {
      probability += intelligence * 4
      if (lowStamina) probability += intelligence * 6
      if (lowSpirit) probability += intelligence * 4
      if (lowEnergy) probability += intelligence * 2
    } else {
      probability -= intelligence * 4
    }
  }
  function inFrontCloseAndBehindNear() {
    //console.log('inFrontCloseAndBehindNear');
    probability -= intelligence * 4

    if (!hasRetreatOpportunityFromInFront) {
      probability -= intelligence * 2
    }

    if (!hasRetreatOpportunityFromBehind) {
      probability -= intelligence * 2
    }
  }

  // behind close

  function inFrontFarAndBehindClose() {
    //console.log('inFrontFarAndBehindClose');
    probability -= intelligence * 6

    if (logistics.isEnemyAttacking(enemyBehind!)) {
      probability -= intelligence * 8
    }
  }
  function inFrontNearAndBehindClose() {
    //console.log('inFrontNearAndBehindClose');

    probability -= intelligence * 8

    if (logistics.isEnemyAttacking(enemyBehind!)) {
      probability -= intelligence * 8
    }
  }
  function inFrontCloseAndBehindClose() {
    //console.log('inFrontCloseAndBehindClose');

    probability -= intelligence * 10

    if (logistics.isEnemyAttacking(enemyBehind!)) {
      probability -= intelligence * 10
    }
  }

  function inFrontFar() {
    //console.log('inFrontFar');
    probability += intelligence * 4
    if (lowStamina) probability += intelligence * 6
    if (lowSpirit) probability += intelligence * 4
    if (lowEnergy) probability += intelligence * 2
  }
  function inFrontNear() {
    //console.log('inFrontNear');
    probability += intelligence * 2
    if (lowStamina) probability += intelligence * 3
    if (lowSpirit) probability += intelligence * 2
    if (lowEnergy) probability += intelligence

    if (hasRetreatOpportunityFromInFront) {
      probability += intelligence * 2
      if (lowStamina) probability += intelligence * 3
      if (lowSpirit) probability += intelligence * 2
      if (lowEnergy) probability += intelligence
    } else {
      probability -= intelligence * 2
    }
  }
  function inFrontClose() {
    //console.log('inFrontClose');
    if (hasRetreatOpportunityFromInFront) {
      probability += intelligence * 2
      if (lowStamina) probability += intelligence * 3
      if (lowSpirit) probability += intelligence * 2
      if (lowEnergy) probability += intelligence
    } else {
      probability -= intelligence * 4
    }
  }

  function behindFar() {
    //console.log('behindFar');
    probability -= intelligence * 2
    if (hasRetreatOpportunityFromBehind) {
      if (lowStamina) probability += intelligence * 4
      if (lowSpirit) probability += intelligence * 2
      if (lowEnergy) probability += intelligence
    } else {
      probability -= intelligence * 4
    }
  }
  function behindNear() {
    //console.log('behindNear');
    probability -= intelligence * 4

    if (hasRetreatOpportunityFromBehind) {
      if (lowStamina) probability += intelligence * 6
      if (lowSpirit) probability += intelligence * 4
      if (lowEnergy) probability += intelligence * 2
    } else {
      probability -= intelligence * 4
    }
  }
  function behindClose() {
    //console.log('behindClose');
    probability -= intelligence * 8

    if (logistics.isEnemyAttacking(enemyBehind!)) {
      probability -= intelligence * 8
    }
  }

  function inFrontFarAndDontKnowBehind() {
    //console.log('inFrontFarAndDontKnowBehind');
    probability -= intelligence * 6
  }
  function inFrontNearAndDontKnowBehind() {
    //console.log('inFrontNearAndDontKnowBehind');

    probability -= intelligence * 8
  }
  function inFrontCloseAndDontKnowBehind() {
    //console.log('inFrontCloseAndDontKnowBehind');
    probability -= intelligence * 10
  }
  function inFrontStrikingAndDontKnowBehind() {
    //console.log('inFrontStrikingAndDontKnowBehind')
    probability -= intelligence * 12
  }

  function inFrontStriking() {
    //console.log('inFrontStriking')
    probability -= intelligence * 12
  }
  function inFrontStrikingAndBehindFar() {
    //console.log('inFrontStrikingAndBehindFar')
    probability -= intelligence * 12
  }
  function inFrontStrikingAndBehindNear() {
    //console.log('inFrontStrikingAndBehindNear')
    probability -= intelligence * 14
  }
  function inFrontStrikingAndBehindClose() {
    //console.log('inFrontStrikingAndBehindClose')
    probability -= intelligence * 16
  }

  function behindStriking() {
    //console.log('behindStriking')
    probability -= intelligence * 16
  }
  function inFrontFarAndBehindStriking() {
    //console.log('inFrontFarAndBehindStriking')
    probability -= intelligence * 16
  }
  function inFrontNearAndBehindStriking() {
    //console.log('inFrontNearAndBehindStriking')
    probability -= intelligence * 16
  }
  function inFrontCloseAndBehindStriking() {
    //console.log('inFrontCloseAndBehindStriking')
    probability -= intelligence * 16
  }

  function inFrontStrikingAndBehindStriking() {
    //console.log('inFrontStrikingAndBehindStriking')
    probability -= intelligence * 18
  }
}
