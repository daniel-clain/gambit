import { differenceInMilliseconds } from "date-fns"
import { round } from "lodash"
import { Subject } from "rxjs"
import gameConfiguration from "../../game-settings/game-configuration"
import Coords from "../../interfaces/game/fighter/coords"
import { ActionName } from "../../types/fighter/action-name"
import { Sound } from "../../types/fighter/sound"
import { Angle } from "../../types/game/angle"
import {
  CommentarySchedule,
  FighterAction,
  FighterSchedule,
  FighterUiTimeStamp,
  FightQueueAction,
  FightUiState,
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

  fightUiDataSubject: Subject<FightUiState> = new Subject()
  fightFinishedSubject: Subject<void> = new Subject()

  unpauseSubject: Subject<void> = new Subject()
  paused = false

  fightActionsQueue: FightQueueAction[] = []
  fightGenTimeStep = 0
  private fightTimeStep = 0
  private fightTimer: NodeJS.Timeout
  private countdownTime: number | undefined
  fightGenTimeStepSubject: Subject<number> = new Subject()
  maxFightDuration: number
  private fightersSchedule: FighterSchedule[] = []
  private commentarySchedule: CommentarySchedule[] = []
  result: Result
  fightUiState: FightUiState

  private fightStartDelayMs = 3000

  startTime: number
  lastTimeStep: number

  constructor(
    public fighters: Fighter[],
    public isMainEvent?: boolean,
    public isFinalTournament?: boolean
  ) {
    fighters.forEach((fighter) => (fighter.fighting.fight = this))
  }

  doTeardown() {
    console.log("fight instance teardown")
    clearInterval(this.fightTimer)
    this.paused = false
    this.fighters.forEach((f) => f.fighting.reset())
    this.fightUiDataSubject.complete()
    this.fightFinishedSubject.complete()
  }

  async start() {
    try {
      this.setup()
    } catch {
      return
    }
    await this.generateFight()

    this.checkFightSize()

    this.startFightTimer()
    this.sendUiStateUpdate()
  }

  private setup() {
    const thisFight = this
    this.fighters.forEach((f) => f.fighting.setup())
    console.log("fight started")
    if (this.fighters.every((f) => f.state.dead == true)) {
      this.result = "draw"
      this.sendUiStateUpdate()
      throw "all players are dead"
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
    //this is to track the fight time serverside, purely relative to pause/unpause
    this.startTime = Date.now() + this.fightStartDelayMs
    console.log("fight start time: ", this.startTime)
    new Promise<void>((resolve) => {
      this.fightTimer = setTimeout(() => {
        resolve()
      }, this.fightStartDelayMs)
    }).then(() => {
      this.fightTimer = setInterval(() => {
        // fight timer increment must be small so that when paused the time is acurate
        this.fightTimeStep += 100

        if (this.fightTimeStep % 1000 === 0) {
          console.log("fight time step", this.fightTimeStep / 1000)
        }
        if (this.fightTimeStep >= this.lastTimeStep) {
          this.fightTimeIsUp()
        }
      }, 100)
    })
  }

  private fightTimeIsUp() {
    console.log("fight time is up")
    this.fightFinishedSubject.next()
    clearInterval(this.fightTimer)
  }

  doCountdown(): Promise<void> {
    const thisFight = this
    return new Promise((resolve) => {
      const initialTimeUntilStart = getTimeUntilStart()
      const remainderTime = initialTimeUntilStart % 1000
      this.countdownTime = round(initialTimeUntilStart / 1000)
      console.log("remainderTime", remainderTime)
      this.fightTimer = setTimeout(() => {
        this.countdownTime = round(getTimeUntilStart() / 1000)

        this.fightTimer = setInterval(() => {
          console.log("this.countdownTime", this.countdownTime)
          if (this.countdownTime == 0) {
            clearInterval(this.fightTimer)
            thisFight.countdownTime = undefined
            resolve()
          } else {
            this.countdownTime = round(getTimeUntilStart() / 1000)
          }
        }, 1000)
      }, remainderTime)
      function getTimeUntilStart() {
        return differenceInMilliseconds(
          new Date(thisFight.startTime),
          new Date()
        )
      }
    })
  }

  private async generateFight() {
    console.log("generate fight")
    const thisFight = this

    await loopTimeStep()

    function loopTimeStep(): Promise<void> {
      thisFight.fightGenTimeStepSubject.next(thisFight.fightGenTimeStep)

      if (!thisFight.result) {
        checkTimeIsUp()
        checkForWinner()
      }

      resolveExpiredActions()

      /* 
        - if the fight has a result and its resolved all the actions in the queue, then the fight has finished generating and can start.
        - 
      */
      if (thisFight.result) {
        if (!thisFight.fightActionsQueue.length) {
          thisFight.lastTimeStep = getLastActionTimeStep()

          return Promise.resolve()
        }
      } else {
        inactiveFighersDecideAction()
      }
      thisFight.fightGenTimeStep += 1
      return Promise.resolve().then(loopTimeStep)
    }

    function checkTimeIsUp() {
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
        /* console.log(
          ` ${action.sourceFighter.name} resolving ${action.actionName} at ${action.resolveTime}`
        ) */
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
        if (f.fighting.knockedOut) return

        const hasActionInQueue = thisFight.fightActionsQueue.some(
          (e) => e.sourceFighter.name == f.name
        )

        if (hasActionInQueue) return

        f.fighting.actions.decideAction()
      })
    }
    function handleWinner(winner: Fighter) {
      console.log(`${winner.name} wins`)
      thisFight.addActionToQueue(
        {
          actionName: "do nothing",
          modelState: "Idle",
          duration: 1000,
          onResolve: () => {
            winner.fighting.fighterActionInterupted()
            thisFight.addActionToQueue(
              {
                actionName: "victory",
                modelState: "Victory",
                commentary: `${winner.name} wins!`,
                duration: 0,
              },
              winner
            )
          },
        },
        winner
      )
      thisFight.result = { winner }

      console.log("this.lastTimeStep", thisFight.lastTimeStep)
    }

    function handleTimesUp() {
      console.log("fight timeout")
      const remainingFighters = getFightersThatArentKnockedOut()
      console.log(
        "remainingFighters",
        remainingFighters.map((f) => f.name)
      )
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
          thisFight.addActionToQueue(
            {
              actionName: "do nothing",
              modelState: "Idle",
              duration: 0,
            },
            fighter
          )
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
          null as Fighter | null
        )!
      }
    }
    function getLastActionTimeStep() {
      return thisFight.fightersSchedule.reduce(
        (lastTimeStep, { fighterTimeStamps }) => {
          const fighterLastTimeStep = Math.max(
            ...fighterTimeStamps.map(({ startTimeStep }) => startTimeStep)
          )
          return Math.max(lastTimeStep, fighterLastTimeStep)
        },
        0
      )
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

    /* console.log(
      `add ${fightQueueAction.sourceFighter.name} ${fightQueueAction.actionName} ${fightQueueAction.resolveTime}`,
      this.fightGenTimeStep
    ) */
    this.fightActionsQueue.push(fightQueueAction)

    this.addTimeStampToFighter(
      sourceFighter,
      action.actionName,
      action.soundMade
    )
    if (action.commentary) {
      this.addComentaryTimeStamp(action.commentary)
    }
  }

  addComentaryTimeStamp(commentary: string) {
    this.commentarySchedule.push({
      commentary,
      startTimeStep: this.fightGenTimeStep,
    })
  }
  private addTimeStampToFighter(
    sourceFighter: Fighter,
    actionName: ActionName,
    soundMade?: Sound
  ) {
    const {
      name,
      fighting: {
        afflictions,
        stamina,
        energy,
        facingDirection,
        movement: { coords, movingDirection },
        logistics: {
          onARampage,
          highEnergy,
          lowEnergy,
          flanked,
          currentAffliction,
        },
        spirit,
        modelState,
        stats: { maxEnergy, maxStamina },
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
        affliction: currentAffliction,
        debuggingState: {
          stamina,
          maxStamina,
          energy,
          maxEnergy,
          movingDirection,
          flanked: !!flanked,
        },
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
    console.log("this.startTime", this.startTime)
    this.fightUiState = {
      maxFightDuration: this.maxFightDuration,
      startTime: this.startTime,
      fightTimeStep: this.fightTimeStep,
      fightersSchedule: this.fightersSchedule,
      commentarySchedule: this.commentarySchedule,
      lastTimeStep: this.lastTimeStep,
      paused: this.paused,
      result:
        this.result == "draw"
          ? "draw"
          : { winner: this.result.winner.getInfo() },
    }

    this.fightUiDataSubject.next(this.fightUiState)
  }
  checkFightSize() {
    const fightDataJSON = JSON.stringify(this.fightersSchedule)
    const fightSize = Buffer.byteLength(fightDataJSON, "utf8")
    /* If the payload is under 100 KB, it’s generally fine for most mobile devices. If it's over 500 KB it might be worth optimizing or compressing.*/
    console.log(`Fight JSON size: ${fightSize} bytes`)
    if (fightSize > 500 * 1000) {
      console.log(`Fight size too big`)
    }
  }
}
