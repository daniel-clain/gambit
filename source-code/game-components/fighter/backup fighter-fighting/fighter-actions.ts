import {
  OptionProbability,
  selectByProbability,
} from "../../../helper-functions/helper-functions"
import {
  combatActions,
  InterruptibleActionName,
  MainActionName,
  miscActions,
  MoveAction,
  moveActions,
} from "../../../types/fighter/action-name"
import Fighter from "../fighter"
import {
  ActionChain,
  ActionPromises,
  Interrupt,
  MainAction,
} from "./action-promises"
import DecideActionProbability from "./decide-action-probability"
import FighterFighting from "./fighter-fighting"

export default class FighterActions {
  decideActionProbability: DecideActionProbability
  decidedActionLog: [MainActionName, OptionProbability<MainActionName>[]][] = []
  currentMainAction: MainActionName
  currentInterruptibleAction: InterruptibleActionName
  actionPromises: ActionPromises
  rejectCurrentAction: (interrupt?: Interrupt) => void
  nextDecisionFactors = {
    justBlocked: false,
    justDodged: false,
    justTookHit: false,
    justMissedAttack: false,
    justHitAttack: false,
  }

  constructor(public fighting: FighterFighting) {
    this.decideActionProbability = new DecideActionProbability(fighting)
    this.actionPromises = new ActionPromises(fighting)
  }

  getActionProbabilities() {
    const { proximity, fighter, logistics, stopFighting } = this.fighting
    const { hallucinating } = fighter.state

    if (stopFighting) {
      return
    }

    let closestEnemy: Fighter = logistics.closestRememberedEnemy

    let enemyWithinStrikingRange =
      closestEnemy && proximity.enemyWithinStrikingRange(closestEnemy)

    const responseProbabilities: OptionProbability<MainActionName>[] = []

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
      debugger
    }
    const { combat, fighter, logistics, timers } = this.fighting
    const decidedAction = selectByProbability(responseProbabilities)

    this.decidedActionLog.unshift([decidedAction, responseProbabilities])

    let mainAction: MainAction

    if (!decidedAction) {
      console.log(
        `${fighter.name} had no decided action, wait 1/10 a sec then decide again`,
        responseProbabilities
      )
      mainAction = this.doNothing()
      this.currentMainAction = "do nothing"
    } else {
      this.currentMainAction = decidedAction
      const decidedActionIsMove = moveActions.find((x) => x == decidedAction)
      if (!decidedActionIsMove) {
        timers.cancel("persist direction")
      }
      console.log(
        `**O decided action ${decidedAction} started (${fighter.name})`
      )

      mainAction = (() => {
        switch (decidedAction) {
          case "punch":
          case "critical strike":
            return combat.attack(decidedAction)
          case "defend":
            return combat.startDefending()
          case "move to attack":
          case "cautious retreat":
          case "strategic retreat":
          case "desperate retreat":
            return this.move(decidedAction)
          case "recover":
            return this.recover()
          case "check flank":
            return this.checkFlank()
          case "do nothing":
            return this.doNothing()
        }
      })()
    }

    mainAction.promise
      .then(() => {
        console.log(
          `**X decided action ${decidedAction} finished (${fighter.name})`
        )

        if (logistics.allOtherFightersAreKnockedOut) {
          this.fighting.modelState = "Victory"
        } else if (fighter.fighting.knockedOut) {
          this.fighting.modelState = "Knocked Out"
        } else {
          this.decideAction()
        }
      })
      .catch((reason) => {
        console.log("******* action catch should not be called ", reason)
      })
  }

  get turnAroundActionChain(): ActionChain {
    const { interruptibleAction, instantAction } = this.actionPromises
    const { turnAround } = this.fighting.movement
    return [
      interruptibleAction({ name: "turn around warmup", duration: 100 }),
      instantAction({ name: "turn around", action: turnAround }),
      interruptibleAction({ name: "turn around cooldown", duration: 100 }),
    ]
  }

  speedModifier(baseSpeed) {
    const { speed } = this.fighting.stats
    return baseSpeed * (1 - (speed * 1.7) / 100)
  }

  checkFlank(): MainAction {
    const { mainAction } = this.actionPromises
    return mainAction({
      name: "check flank",
      actionChain: this.turnAroundActionChain,
    })
  }

  move(name: MoveAction): MainAction {
    const { mainAction, interruptibleAction, instantAction } =
      this.actionPromises
    const { movement, timers } = this.fighting

    if (!timers.get("move action")) {
      timers.start("move action")
    }

    movement.startMoveLoop(name)

    const moveAction = interruptibleAction({
      name: "move",
      model: name == "cautious retreat" ? "Defending" : "Walking",
      duration: 1000,
    })

    const mainMoveAction = mainAction({
      name,
      actionChain: [
        ...(movement.shouldTurnAround ? this.turnAroundActionChain : []),
        moveAction,
      ],
    })

    mainMoveAction.promise.then(() => {
      console.log("move action then stop move loop")
      movement.stopMoveLoop("move action finished")
    })

    return mainMoveAction
  }

  recover(): MainAction {
    const { mainAction, interruptibleAction, instantAction } =
      this.actionPromises
    const { fighter, stats } = this.fighting
    const { sick, injured } = fighter.state
    const duration =
      2500 - stats.fitness * 150 + (((sick || injured) && 1000) || 0)

    return mainAction({
      name: "recover",
      actionChain: [
        interruptibleAction({
          name: "recover",
          duration,
          model: "Recovering",
        }),
        instantAction({
          name: "recover",
          action: () => {
            this.fighting.stamina++
            if (this.fighting.spirit < 3) {
              this.fighting.spirit++
            }
            this.fighting.energy += 3

            this.fighting.modelState = "Idle"
            return Promise.resolve()
          },
        }),
      ],
    })
  }

  doNothing(): MainAction {
    const { mainAction, interruptibleAction } = this.actionPromises
    const { hallucinating } = this.fighting.fighter.state

    const duration = 1000 + (hallucinating ? 1000 : 0)

    return mainAction({
      name: "do nothing",
      actionChain: [
        interruptibleAction({
          name: "do nothing",
          model: "Idle",
          duration,
        }),
      ],
    })
  }
}
