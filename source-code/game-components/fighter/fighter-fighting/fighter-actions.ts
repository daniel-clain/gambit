import {
  OptionProbability,
  selectByProbability,
} from "../../../helper-functions/helper-functions"
import {
  combatActions,
  DecideActionName,
  miscActions,
  moveActions,
} from "../../../types/fighter/action-name"
import { FighterAction } from "../../../types/game/ui-fighter-state"
import Fighter from "../fighter"
import DecideActionProbability from "./decide-action-probability"
import FighterFighting from "./fighter-fighting"

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
    const { proximity, fighter, logistics, stopFighting } = this.fighting
    const { hallucinating } = fighter.state

    let closestEnemy: Fighter | undefined = logistics.closestRememberedEnemy

    let enemyWithinStrikingRange =
      closestEnemy && proximity.enemyWithinStrikingRange(closestEnemy)

    const responseProbabilities: OptionProbability<DecideActionName>[] = []

    const includeCombatActions =
      enemyWithinStrikingRange || (hallucinating && closestEnemy)

    const includeMoveActions = !!closestEnemy

    if (includeCombatActions || includeMoveActions) {
      this.decideActionProbability.setGeneralAttackAndRetreatProbabilities()
    }

    if (includeCombatActions)
      responseProbabilities.push(
        ...combatActions.map((action) =>
          this.decideActionProbability.getProbabilityTo(action)
        )
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
      console.log("should have action probabilites")
      debugger
    }
    const { combat, fighter, movement, timers } = this.fighting
    console.log(`${fighter.name} responseProbabilities`, responseProbabilities)
    const decidedAction = selectByProbability(responseProbabilities)

    this.decidedActionLog.unshift([decidedAction, responseProbabilities])

    if (!decidedAction) {
      console.log(
        `${fighter.name} had no decided action, wait 1/10 a sec then decide again`,
        responseProbabilities
      )
      this.doNothing()
    } else {
      const decidedActionIsMove = moveActions.find((x) => x == decidedAction)
      if (!decidedActionIsMove) {
        timers.cancel("persist direction")
      }
      console.log(`${fighter.name} decidedAction is ${decidedAction}`)
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
    this.fighting.addFighterAction(this.turnAround())
  }

  recover() {
    const { fighter, stats } = this.fighting
    const { sick, injured } = fighter.state
    const duration =
      2500 - stats.fitness * 150 + (((sick || injured) && 1000) || 0)

    this.fighting.addFighterAction({
      actionName: "recover",
      modelState: "Recovering",
      duration,
      onResolve: () => {
        this.fighting.stamina++
        if (this.fighting.spirit < 3) {
          this.fighting.spirit++
        }
        this.fighting.energy += 3
      },
    })
  }

  doNothing() {
    const { hallucinating } = this.fighting.fighter.state

    const duration = 1000 + (hallucinating ? 1000 : 0)

    this.fighting.addFighterAction({
      actionName: "do nothing",
      modelState: "Idle",
      duration,
    })
  }
}
