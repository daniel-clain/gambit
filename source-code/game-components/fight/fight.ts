import { addSeconds } from "date-fns"
import { Subject } from "rxjs"
import gameConfiguration from "../../game-settings/game-configuration"
import Coords from "../../interfaces/game/fighter/coords"
import { ActionName } from "../../types/fighter/action-name"
import { Sound } from "../../types/fighter/sound"
import { Angle } from "../../types/game/angle"
import {
  FighterAction,
  FighterSchedule,
  FighterUiTimeStamp,
  FightQueueAction,
  FightUIState,
  Result,
} from "../../types/game/ui-fighter-state"
import Fighter from "../fighter/fighter"
import {
  add2Angles,
  getPointGivenDistanceAndDirectionFromOtherPoint,
  toAngle,
} from "../fighter/fighter-fighting/proximity"
import { octagon } from "./octagon"

export default class Fight {
  timeRemaining: number | null = null

  fightUiDataSubject: Subject<FightUIState> = new Subject()
  fightFinishedSubject: Subject<void> = new Subject()

  unpauseSubject: Subject<void> = new Subject()
  paused = false

  fightActionsQueue: FightQueueAction[] = []
  fightGenTimeStep = 0
  private finalTimeStep: number
  private fightTimeStep = 0
  private fightTimer: NodeJS.Timeout
  fightGenTimeStepSubject: Subject<number> = new Subject()
  maxFightDuration: number
  private fightersSchedule: FighterSchedule[] = []
  result: Result

  startTime: string
  lastTimeStep: number

  constructor(
    public fighters: Fighter[],
    public isMainEvent?: boolean,
    public isFinalTournament?: boolean
  ) {
    fighters.forEach((fighter) => (fighter.fighting.fight = this))
  }

  doTeardown() {
    this.fighters.forEach((f) => f.fighting.reset())
    this.fightUiDataSubject.complete()
    this.fightFinishedSubject.complete()
  }

  async start() {
    this.setup()
    this.startTime = addSeconds(new Date(), 3).toISOString()
    await this.generateFight()

    this.sendUiStateUpdate()
    this.startFightTimer()
  }

  setup() {
    const thisFight = this
    this.fighters.forEach((f) => f.fighting.setup())
    console.log("fight started")
    if (this.fighters.every((f) => f.state.dead == true)) {
      this.result = "draw"
      this.sendUiStateUpdate()
    } else {
      placeFighters()

      this.maxFightDuration = this.isMainEvent
        ? gameConfiguration.stageDurations.maxFightDurationMainEvent
        : gameConfiguration.stageDurations.maxFightDuration
    }

    function placeFighters() {
      const angleBetweenEachFighter = 360 / thisFight.fighters.length
      const distanceFromCenter = 150
      const centerPoint: Coords = {
        x: (octagon.edges.right.point1.x - octagon.edges.left.point1.x) / 2,
        y: (octagon.edges.top.point1.y - octagon.edges.bottom.point1.y) / 2,
      }

      thisFight.fighters.forEach((fighter: Fighter, index) => {
        let angle: Angle = add2Angles(
          90 as Angle,
          toAngle(angleBetweenEachFighter * index)
        )
        fighter.fighting.movement.coords =
          getPointGivenDistanceAndDirectionFromOtherPoint(
            centerPoint,
            distanceFromCenter,
            angle
          )
      })
    }
  }

  private startFightTimer() {
    this.fightTimer = setInterval(() => {
      this.fightTimeStep += 10
      if (this.fightTimeStep >= this.finalTimeStep) {
        this.fightTimerExpired()
      }
    }, 10)
  }

  private fightTimerExpired() {
    clearInterval(this.fightTimer)
    this.fightFinishedSubject.next()
  }

  private async generateFight() {
    console.log("generate fight")
    const thisFight = this

    await loopTimeStep()

    function loopTimeStep(): Promise<void> {
      if (timeIsUp()) {
        return Promise.resolve()
      }

      resolveExpiredActions()

      if (checkForWinner()) {
        return Promise.resolve()
      }

      thisFight.fightGenTimeStepSubject.next(thisFight.fightGenTimeStep)
      inactiveFighersDecideAction()

      thisFight.fightGenTimeStep += 1
      return Promise.resolve().then(loopTimeStep)
    }

    function timeIsUp() {
      if (thisFight.fightGenTimeStep > thisFight.maxFightDuration * 1000) {
        handleTimesUp()
        return true
      }
      return false
    }

    function resolveExpiredActions() {
      const actionsToResolve = thisFight.fightActionsQueue.reduce<
        FightQueueAction[]
      >((actionsToResolve, action) => {
        const { resolveTime, sourceFighter, actionName } = action
        if (resolveTime > thisFight.fightGenTimeStep) return actionsToResolve

        const existingActionIndex = actionsToResolve.findIndex(
          (a) => a.sourceFighter.name === sourceFighter.name
        )
        const isAttackResponseAction = ["block", "dodge", "take hit"].includes(
          actionName
        )

        if (existingActionIndex === -1) {
          // No existing action for this fighter, add this action
          actionsToResolve.push(action)
        } else {
          const existingAction = actionsToResolve[existingActionIndex]
          const existingIsAttackResponseAction = [
            "block",
            "dodge",
            "take hit",
          ].includes(existingAction.actionName)

          if (existingIsAttackResponseAction && isAttackResponseAction) {
            console.error(
              "fighter has multiple attack response actions resolving at the same time",
              existingAction,
              action
            )
          } else if (
            !existingIsAttackResponseAction &&
            !isAttackResponseAction
          ) {
            console.error(
              "fighter has multiple actions resolving at the same time and neither are attack response actions",
              existingAction,
              action
            )
          } else if (
            !existingIsAttackResponseAction &&
            isAttackResponseAction
          ) {
            // Replace non-response action with the attack response action
            actionsToResolve[existingActionIndex] = action
          }
          // If existing is an attack response and current is not, we keep the existing action
        }
        return actionsToResolve
      }, [])

      actionsToResolve.forEach((action) => {
        console.log(
          `resolving ${action.actionName} with resolve time ${action.resolveTime} at gen step ${thisFight.fightGenTimeStep} for ${action.sourceFighter.name}`
        )
        action.onResolve?.()
      })

      thisFight.fightActionsQueue = thisFight.fightActionsQueue.filter(
        (effect) => effect.resolveTime > thisFight.fightGenTimeStep
      )
    }

    function checkForWinner(): boolean {
      const [winner, ...otherFighters] = getFightersThatArentKnockedOut()
      if (!otherFighters.length) {
        handleWinner(winner)
        return true
      }
      return false
    }

    function inactiveFighersDecideAction() {
      thisFight.fighters.forEach((f) => {
        if (
          !thisFight.fightActionsQueue.some(
            (e) => e.sourceFighter.name == f.name
          ) &&
          !f.fighting.knockedOut
        ) {
          f.fighting.actions.decideAction()
        }
      })
    }
    function handleWinner(winner: Fighter) {
      console.log(`${winner.name} wins`)
      winner.fighting.modelState = "Victory"
      thisFight.addTimeStampToFighter(winner, "victory")
      thisFight.result = { winner }
      thisFight.lastTimeStep = getLastActionTimeStep()
      function getLastActionTimeStep() {
        return thisFight.fightActionsQueue.reduce((finalTimeStep, action) => {
          return action.resolveTime > finalTimeStep
            ? action.resolveTime
            : finalTimeStep
        }, 0)
      }
    }

    function handleTimesUp() {
      console.log("fight timeout")
      thisFight.lastTimeStep = thisFight.maxFightDuration * 1000
      const remainingFighters = getFightersThatArentKnockedOut()
      remainingFighters.forEach((f) => f.fighting.timers.cancelAllTimers)
      if (thisFight.isFinalTournament) {
        const winner = getFighterWithTheMostStaminaLeft()

        handleWinner(winner)
      } else {
        thisFight.result = "draw"
        setIdlePoseForRemainingFighters()
        console.log(
          `The fight was a draw between ${remainingFighters.map((f, i) =>
            i == 0 ? f.name : " and " + f.name
          )}`
        )
      }

      function setIdlePoseForRemainingFighters() {
        remainingFighters.forEach((fighter) => {
          fighter.fighting.modelState = "Idle"
          thisFight.addTimeStampToFighter(fighter, "do nothing")
        })
      }

      function getFighterWithTheMostStaminaLeft() {
        return remainingFighters.reduce(
          (fighterWithMostStaminaLeft, fighter) => {
            if (!fighterWithMostStaminaLeft) return fighter
            if (
              fighter.fighting.stamina >
              fighterWithMostStaminaLeft.fighting.stamina
            )
              return fighter
            else return fighterWithMostStaminaLeft
          },
          {} as Fighter
        )
      }
    }

    function getFightersThatArentKnockedOut() {
      return thisFight.fighters.filter(
        (fighter) => !fighter.fighting.knockedOut
      )
    }
  }

  addActionToQueue(action: FighterAction, sourceFighter: Fighter) {
    const { modelState, duration, ...rest } = action

    if (modelState) {
      sourceFighter.fighting.modelState = modelState
    }
    const fightQueueAction: FightQueueAction = {
      ...rest,
      resolveTime: this.fightGenTimeStep + duration,
      sourceFighter,
    }

    console.log(
      `addActionToQueue ${sourceFighter.name} ${fightQueueAction.actionName} resolve at ${fightQueueAction.resolveTime}`
    )
    console.log(
      `add ${fightQueueAction.sourceFighter.name} ${fightQueueAction.actionName} ${fightQueueAction.resolveTime}`,
      this.fightGenTimeStep
    )
    this.fightActionsQueue.push(fightQueueAction)

    this.addTimeStampToFighter(
      sourceFighter,
      action.actionName,
      action.soundMade
    )
  }

  private addTimeStampToFighter(
    sourceFighter: Fighter,
    actionName: ActionName,
    soundMade?: Sound
  ) {
    const {
      name,
      fighting: {
        facingDirection,
        movement: { coords },
        logistics: { onARampage, highEnergy, lowEnergy },
        spirit,
        modelState,
      },
      skin,
    } = sourceFighter

    const uiTimeStamp: FighterUiTimeStamp = {
      startTimeStep: this.fightGenTimeStep,
      actionName,
      soundMade,
      uiFighterState: {
        energyState: highEnergy ? "high" : lowEnergy ? "low" : undefined,
        facingDirection,
        coords,
        modelState,
        onARampage,
        skin,
        spirit,
      },
    }

    this.fightersSchedule
      .find((f) => f.fighterName == name)
      ?.fighterTimeStamps.push(uiTimeStamp) ||
      this.fightersSchedule.push({
        fighterName: name,
        fighterTimeStamps: [uiTimeStamp],
      })
  }

  removeFightersActions(fighter: Fighter) {
    this.fightActionsQueue = this.fightActionsQueue.filter((a) => {
      if (a.sourceFighter.name == fighter.name) {
        console.log(`${fighter.name} ${a.actionName} was interupted`)
      } else return true
    })
  }

  pause() {
    console.log("pause")
    clearInterval(this.fightTimer)
    this.paused = true
    this.sendUiStateUpdate()
  }

  unpause() {
    this.startFightTimer()
    this.paused = false
    this.sendUiStateUpdate()
  }

  sendUiStateUpdate() {
    console.log("sendUiStateUpdate")
    const fightUiState: FightUIState = {
      maxFightDuration: this.maxFightDuration,
      startTime: this.startTime,
      fightTimeStep: this.fightTimeStep,
      fightersSchedule: this.fightersSchedule,
      lastTimeStep: this.lastTimeStep,
      paused: this.paused,
      result:
        this.result == "draw"
          ? "draw"
          : { winner: this.result.winner.getInfo() },
    }
    this.fightUiDataSubject.next(fightUiState)
  }
}
