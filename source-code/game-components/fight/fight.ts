import { Subject } from "rxjs"
import {
  FightReport,
  FightUIState,
  ManagersBet,
} from "../../interfaces/front-end-state-interface"
import Coords from "../../interfaces/game/fighter/coords"
import { Angle } from "../../types/game/angle"
import {
  DecidedAction,
  FighterDelayedEffect,
  FighterTimeStamps,
  FightObject,
} from "../../types/game/fight-object"
import Fighter from "../fighter/fighter"
import {
  add2Angles,
  getPointGivenDistanceAndDirectionFromOtherPoint,
  toAngle,
} from "../fighter/fighter-fighting/proximity"
import { Manager } from "../manager"
import { octagon } from "./octagon"

export default class Fight {
  private fightUpdateLoop

  private _report: FightReport = null
  timeRemaining: number = null
  private startCountdown: number = null

  fightFinishedSubject: Subject<FightReport> = new Subject()
  fightUiDataSubject: Subject<FightUIState> = new Subject()

  unpauseSubject: Subject<void> = new Subject()
  paused = false

  private fightObject: FightObject

  private timesUpTimer
  private timeRemainingInterval

  constructor(
    public fighters: Fighter[],
    public managers: Manager[],
    public isFinalTournament?: boolean
  ) {
    fighters.forEach((fighter) => fighter.getPutInFight(this))
  }

  doTeardown() {
    this.fighters.forEach((f) => (f.state.fight = undefined))
    this.fightUiDataSubject.complete()
  }

  getOtherFightersInFight(thisFighter: Fighter) {
    return this.fighters.filter(
      (fighter: Fighter) => fighter.name != thisFighter.name
    )
  }

  async start() {
    this.fighters.forEach((f) => f.fighting.setup())

    console.log("fight started")
    if (this.fighters.every((f) => f.state.dead == true)) {
      this.finishFight({ draw: true })
    } else {
      this.placeFighters()
      this.fightObject = this.buildFightObject()
      this.sendUiStateUpdate.bind(this)
      const fightDuration = this.getFightDuration()

      this.timesUpTimer = setTimeout(() => this.timesUp(), fightDuration * 1000)
    }
  }

  private buildFightObject(): FightObject {
    return {
      startTime: new Date(),
      fighterTimeStamps: this.generateFight(),
      paused: false,
    }
  }

  private generateFight(): FighterTimeStamps[] {
    const fighters = this.fighters

    const fighterTimeStamps: FighterTimeStamps[] = []
    const fighterDelayedEffects: FighterDelayedEffect[] = []

    let timeStep = 0

    return loopTimeStep()

    function loopTimeStep() {
      resolveExpiredActions()
      inactiveFighersDecideAction()
      const winner = checkIfWinner()

      if (timeStep > 9999999999) {
        console.log("break excess")
        return fighterTimeStamps
      }
      if (winner) {
        return fighterTimeStamps
      } else {
        timeStep += 1
        loopTimeStep()
      }
    }

    function resolveExpiredActions() {}

    function inactiveFighersDecideAction() {
      fighters.forEach((f) => {
        if (!fighterDelayedEffects.some((e) => e.sourceFighterName == f.name)) {
          const decidedAction: DecidedAction = f.fighting.actions.decideAction()

          fighterDelayedEffects.push(fighterDelayedEffect)
        }
      })
    }

    function checkIfWinner() {
      return fighters.reduce((fighters, fighter) => {
        if (!fighter.fighting.knockedOut) {
          fighters.push(fighter)
        }
        return fighters
      }, [] as Fighter[])
    }
  }

  private getFightDuration(): number {
    return this.fightObject.fighterTimeStamps.reduce((biggestMilisecs, s) => {
      const milisecs = this.fightObject.startTime.getTime() - s.time.getTime()
      return milisecs > biggestMilisecs ? milisecs : biggestMilisecs
    }, 0)
  }

  pause() {
    clearInterval(this.timeRemainingInterval)
    clearTimeout(this.timesUpTimer)
    clearTimeout(this.fightUpdateLoop)

    this.paused = true
  }

  unpause() {
    if (this.timeRemaining > 0) {
      this.timeRemainingInterval = setInterval(() => this.timeRemaining--, 1000)
      this.timesUpTimer = setTimeout(
        () => this.timesUp(),
        this.timeRemaining * 1000
      )
    }
    this.paused = false
    this.unpauseSubject.next()
  }

  waitForUnpause(): Promise<void> {
    return new Promise((resolve) => {
      const subscription = this.unpauseSubject.subscribe(() => {
        subscription.unsubscribe()
        resolve()
        this.startFightUpdateLoop()
      })
    })
  }

  startFightUpdateLoop() {
    this.fightUpdateLoop = setInterval(this.sendUiStateUpdate.bind(this), 60)
  }

  set report(value: FightReport) {
    this._report = value
    this.sendUiStateUpdate()
  }

  timesUp() {
    console.log("fight timeout")
    const remainingFighters = this.getFightersThatArentKnockedOut()
    let fightReport: FightReport
    if (this.isFinalTournament) {
      const fighterWithMostStaminaLeft = remainingFighters.reduce(
        (winner, fighter) => {
          if (!winner) return fighter
          if (fighter.fighting.stamina > winner.fighting.stamina) return fighter
          else return winner
        },
        null as Fighter
      )

      this.declareWinner(fighterWithMostStaminaLeft)
      return
    } else {
      fightReport = {
        draw: true,
      }
      console.log(
        `The fight was a draw between ${remainingFighters.map((f, i) =>
          i == 0 ? f.name : " and " + f.name
        )}`
      )
    }
    this.finishFight(fightReport)
  }

  declareWinner(winningFighter: Fighter) {
    winningFighter.state.numberOfWins++
    console.log(`congratulations to ${winningFighter.name}, he is the winner!`)
    const fightReport: FightReport = {
      winner: winningFighter.getInfo(),
      draw: false,
    }
    this.finishFight(fightReport)
  }

  private finishFight(fightReport) {
    this.report = fightReport
    this.timeRemaining = 0
    clearTimeout(this.timesUpTimer)
    clearInterval(this.timeRemainingInterval)

    this.fighters.forEach((f) => {
      f.stopFighting()
      f.state.numberOfFights++
    })

    setTimeout(() => {
      clearInterval(this.fightUpdateLoop)
      this.fightFinishedSubject.next(fightReport)
    }, 2000)
  }

  sendUiStateUpdate() {
    this.fightUiDataSubject.next(this.fightUiData)
  }

  get fightUiData(): FightUIState {
    return {
      startCountdown: this.startCountdown,
      timeRemaining: this.timeRemaining,
      report: this._report,
      fightObject: this.fightObject,
      managersBets: this.managers
        ?.filter((m) => !m.state.retired)
        .map((manager: Manager): ManagersBet => {
          return {
            name: manager.has.name,
            image: manager.has.image,
            bet: manager.has.nextFightBet,
          }
        }),
    }
  }

  private getFightersThatArentKnockedOut() {
    return this.fighters.reduce((fighters, fighter) => {
      if (!fighter.fighting.knockedOut) {
        fighters.push(fighter)
      }
      return fighters
    }, [] as Fighter[])
  }

  private placeFighters() {
    const angleBetweenEachFighter = 360 / this.fighters.length
    const distanceFromCenter = 150
    const centerPoint: Coords = {
      x: (octagon.edges.right.point1.x - octagon.edges.left.point1.x) / 2,
      y: (octagon.edges.top.point1.y - octagon.edges.bottom.point1.y) / 2,
    }

    this.fighters.forEach((fighter: Fighter, index) => {
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
