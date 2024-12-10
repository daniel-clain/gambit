import gameConfiguration from "../../../game-settings/game-configuration"
import {
  OptionProbability,
  selectByProbability,
} from "../../../helper-functions/helper-functions"
import {
  ActionName,
  combatActions,
  DecideActionName,
  miscActions,
  moveActions,
} from "../../../types/fighter/action-name"
import { FighterAction } from "../../../types/game/ui-fighter-state"
import Fighter from "../fighter"
import DecideActionProbability from "./decide-action-probability"
import FighterFighting from "./fighter-fighting"
import { getRetreatDirection } from "./fighter-retreat"

export default class FighterActions {
  decideActionProbability: DecideActionProbability
  decidedActionLog: [
    DecideActionName,
    OptionProbability<DecideActionName>[]
  ][] = []
  nextDecisionFactors = {
    justBlocked: false,
    justDodged: false,
    justTookHit: false,
    justMissedAttack: false,
    justHitAttack: false,
  }

  constructor(public fighting: FighterFighting) {
    this.decideActionProbability = new DecideActionProbability(fighting)
  }

  getActionProbabilities() {
    const { proximity, fighter, logistics, timers } = this.fighting

    let closestEnemy: Fighter | undefined = logistics.closestRememberedEnemy

    let enemyWithinStrikingRange =
      closestEnemy && proximity.enemyWithinStrikingRange(closestEnemy)

    const responseProbabilities: OptionProbability<DecideActionName>[] = []

    const includeCombatActions =
      enemyWithinStrikingRange || logistics.isHallucinating

    const includeMoveActions = !!closestEnemy

    /* test retreat logic before calcutale probabilities */
    logistics.trapped = false
    if (closestEnemy) {
      try {
        getRetreatDirection(this.fighting)
      } catch {}
    }

    if (includeCombatActions || includeMoveActions) {
      this.decideActionProbability.setGeneralAttackAndRetreatProbabilities()
    }

    if (includeCombatActions)
      responseProbabilities.push(
        ...combatActions
          .map((action) =>
            this.decideActionProbability.getProbabilityTo(action)
          )
          .map((option) => ({
            ...option,
            probability: logistics.isHallucinating
              ? option.probability * 0.1
              : option.probability,
          }))
      )

    if (includeMoveActions)
      responseProbabilities.push(
        ...moveActions.map((action) =>
          this.decideActionProbability.getProbabilityTo(action)
        )
      )

    responseProbabilities.push(
      ...miscActions.map((action) =>
        this.decideActionProbability.getProbabilityTo(action)
      )
    )
    return responseProbabilities
  }

  decideAction() {
    const responseProbabilities = this.getActionProbabilities()
    if (!responseProbabilities || !responseProbabilities.length) {
      console.error("should have action probabilites")
      debugger
    }
    const { combat, fighter, movement, timers, logistics, afflictions } =
      this.fighting
    //console.log(`${fighter.name} responseProbabilities`, responseProbabilities)

    this.addAfflictionProbabilities(responseProbabilities)

    const decidedAction = selectByProbability(responseProbabilities)

    if (!decidedAction) {
      console.error(
        `${fighter.name} had no decided action, wait 1/10 a sec then decide again`,
        responseProbabilities,
        this.fighting
      )
      this.doNothing()
    } else {
      this.decidedActionLog.unshift([decidedAction, responseProbabilities])
      const decidedActionIsMove = moveActions.find((x) => x == decidedAction)
      if (!decidedActionIsMove) {
        timers.cancel("move action")
        timers.cancel("persist direction")
      }
      //console.log(`${fighter.name} decidedAction is ${decidedAction}`)

      if (
        (["punch", "kick", "move to attack"] as ActionName[]).includes(
          decidedAction
        )
      ) {
        this.fighting.enemyTargetedForAttack = logistics.closestRememberedEnemy!
        timers.start("targeted for attack")
      } else {
        this.fighting.enemyTargetedForAttack = null
        timers.cancel("targeted for attack")
      }

      ;(() => {
        switch (decidedAction) {
          case "punch":
            return combat.punch()
          case "kick":
            return combat.kick()
          case "defend":
            return combat.startDefending()
          case "move to attack":
          case "cautious retreat":
          case "strategic retreat":
          case "desperate retreat":
            return movement.move(decidedAction)
          case "recover":
            return this.recover()
          case "check flank":
            return this.checkFlank()
          case "be sick":
            return afflictions.beSick()

          case "flinch":
            return afflictions.flinch()

          case "hallucinations":
            return afflictions.hallucinations()
          case "do nothing":
            return this.doNothing()
        }
      })()
    }
  }

  turnAround(onResolve?: () => void): FighterAction {
    const { fighting } = this
    const { facingDirection } = fighting
    return {
      actionName: "turn around warmup",
      duration: 100,
      onResolve: () => {
        fighting.facingDirection = facingDirection == "left" ? "right" : "left"

        fighting.addFighterAction({
          actionName: "turn around cooldown",
          duration: 100,
          onResolve,
        })
      },
    }
  }

  checkFlank() {
    this.fighting.addFighterAction({
      actionName: "check flank",
      duration: 0,
      onResolve: () => this.fighting.addFighterAction(this.turnAround()),
    })
  }

  recover() {
    const { fighter, stats, timers } = this.fighting
    const duration = 2500 - stats.fitness * 150

    this.fighting.addFighterAction({
      actionName: "recover",
      modelState: "Recovering",
      duration,
      onResolve: () => {
        this.fighting.stamina += 1 + (1 * stats.fitness) / 10
        if (this.fighting.spirit < 3) {
          this.fighting.spirit++
        }
        this.fighting.energy += 3
        timers.start("just recovered")
      },
    })
  }

  doNothing() {
    this.fighting.addFighterAction({
      actionName: "do nothing",
      modelState: "Idle",
      duration: 1000,
    })
  }

  addAfflictionProbabilities(
    responseProbabilities: OptionProbability<DecideActionName>[]
  ) {
    const { proximity, fighter, logistics, timers } = this.fighting
    const { hallucinating, sick, injured } = fighter.state

    const {
      injured: { chanceToFlinchAfterAttackingOrBeingAttacked: flinchChance },
      hallucinating: { chanceToHaveHallucinations: hallucinationsChance },
      sick: { chanceToBeSick },
    } = gameConfiguration.afflictions

    const currentTotal = responseProbabilities.reduce(
      (sum, option) => sum + option.probability,
      0
    )

    if (injured && !logistics.onARampage) {
      if (
        logistics.justTookHit ||
        logistics.justLandedAttack ||
        logistics.justBlocked
      ) {
        const flinchProbability =
          (flinchChance / 100) * (currentTotal / (1 - flinchChance / 100))
        console.log("flinch probability ", flinchProbability)
        responseProbabilities.push({
          option: "flinch",
          probability: flinchProbability,
        })
      }
    }
    if (hallucinating && !logistics.isHallucinating) {
      const hallucinationsProbability =
        (hallucinationsChance / 100) *
        (currentTotal / (1 - hallucinationsChance / 100))

      responseProbabilities.push({
        option: "hallucinations",
        probability: hallucinationsProbability,
      })
    }
    if (sick && !logistics.wasJustSick) {
      const beSickProbability =
        (chanceToBeSick / 100) * (currentTotal / (1 - chanceToBeSick / 100))

      responseProbabilities.push({
        option: "be sick",
        probability: beSickProbability,
      })
    }
  }
}
