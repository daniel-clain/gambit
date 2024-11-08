import gameConfiguration from "../game-settings/game-configuration"
import { randomNumber } from "../helper-functions/helper-functions"
import {
  Employee,
  FighterInfo,
  FighterStateData,
  Loan,
} from "../interfaces/front-end-state-interface"
import { Bet } from "../interfaces/game/bet"
import { PostFightReportItem } from "../interfaces/game/post-fight-report-item"
import { ActivityLogItem } from "../types/game/activity-log-item"
import { Evidence } from "../types/game/evidence.type"
import { Lawsuit } from "../types/game/lawsuit.type"
import { ManagerImage } from "../types/game/manager-image"
import { AbilityName } from "./abilities-general/ability"
import Fighter from "./fighter/fighter"
import { Game } from "./game"

export interface KnownManagerStat {
  lastKnownValue: any
  weeksSinceUpdated: number
}

export type ManagerStatKey =
  | "money"
  | "employees"
  | "fighters"
  | "loan"
  | "evidence"

export interface KnownManager {
  name: string
  characterType: "Known Manager"
  image: ManagerImage
  money?: KnownManagerStat
  employees?: KnownManagerStat
  fighters?: KnownManagerStat
  loan?: KnownManagerStat
  evidence?: KnownManagerStat
}

export interface ManagerInfo {
  name: string
  characterType: "Manager"
  money: number
  abilities: AbilityName[]
  actionPoints: number
  fighters: FighterInfo[]
  knownFighters: FighterInfo[]
  loan?: Loan
  nextFightBet?: Bet
  employees: Employee[]
  readyForNextFight: boolean
  otherManagers: KnownManager[]
  activityLogs: ActivityLogItem[]
  image: ManagerImage
  evidence: Evidence[]
  retired: boolean
}

export class ManagerState {
  readyForNextFight: boolean = false
  underSurveillance?: { professional: string }
  beingProsecuted: boolean = false
  retired: boolean
  inJail:
    | undefined
    | {
        weeksTotal: number
        weeksRemaining: number
        lawsuit: Lawsuit
      }
}

class ManagerHas {
  logColorNumber: number
  constructor(public name: string) {
    this.logColorNumber = 0
  }
  money = gameConfiguration.manager.startingMoney
  actionPoints = gameConfiguration.manager.actionPoints
  fighters: Fighter[] = []
  employees: Employee[] = []
  loan?: Loan
  image: ManagerImage = randomNumber({ to: 1 }) ? "Fat Man" : "Moustache Man"
  nextFightBet?: Bet
  otherManagers: KnownManager[] = []
  knownFighters: FighterInfo[] = []
  activityLogs: ActivityLogItem[] = []
  abilities: AbilityName[] = [
    "Dope Fighter",
    "Train Fighter",
    "Research Fighter",
    "Offer Contract",
    "Domination Victory",
    "Sinister Victory",
    "Wealth Victory",
    "Take A Dive",
    "Give Up",
  ]
  postFightReportItems: PostFightReportItem[] = []
  evidence: Evidence[] = []
}

class ManagerFunctions {
  logCount = 0

  constructor(private manager: Manager, private game: Game) {}

  addToLog(activityLogItem: Omit<ActivityLogItem, "id">): void {
    this.logCount++
    const { has } = this.manager
    has.logColorNumber >= 345
      ? (has.logColorNumber = 0)
      : (has.logColorNumber += 10)
    this.manager.has.activityLogs.unshift({
      ...activityLogItem,
      color1: `hsl(${has.logColorNumber}deg 50% 50%)`,
      color2: `hsl(${has.logColorNumber - 10}deg 50% 50%)`,
      id: this.logCount,
    })
  }

  toggleReady = () => {
    const ready = !this.manager.state.readyForNextFight
    this.manager.state.readyForNextFight = ready
    this.game.functions.triggerUIUpdate()
  }

  betOnFighter = (bet: Bet) => {
    bet &&
      this.addToLog({
        weekNumber: this.game.has.weekController.weekNumber,
        message: `Made a ${bet.size} bet on ${bet.fighterName}`,
      })
    this.manager.has.nextFightBet = bet
  }

  getInfo(): ManagerInfo {
    return {
      characterType: "Manager",
      ...this.manager.state,
      ...this.manager.has,
      otherManagers: this.manager.has.otherManagers?.filter((om) => {
        const m = this.game.has.managers.find((m) => m.has.name == om.name)
        return m && !m.state.retired
      }),
      fighters: this.manager.has.fighters.map((f) => f.getInfo()),
    }
  }
  paybackMoney = (amount: number) => {
    this.addToLog({
      weekNumber: this.game.has.weekController.weekNumber,
      message: `Paid back ${amount} to the Loan Shark`,
    })
    const { has } = this.manager
    has.money -= amount
    has.loan = !has.loan
      ? undefined
      : {
          ...has.loan,
          debt: (has.loan.debt -= amount),
          amountPaidBackThisWeek: (has.loan.amountPaidBackThisWeek += amount),
        }
  }

  borrowMoney = (amount: number) => {
    this.addToLog({
      weekNumber: this.game.has.weekController.weekNumber,
      message: `Borrowed ${amount} from the Loan Shark`,
    })
    const { has } = this.manager
    has.money += amount
    if (!has.loan) {
      has.loan = {
        isNew: true,
        debt: amount,
        amountPaidBackThisWeek: 0,
        weeksOverdue: 0,
      }
    } else {
      has.loan = {
        ...has.loan,
        debt: (has.loan.debt += amount),
        amountPaidBackThisWeek: (has.loan.amountPaidBackThisWeek -= amount),
      }
    }
  }

  getFighterStateData(fighters: Fighter[]): FighterStateData[] {
    return fighters.map((fighter) => {
      const { sick, injured, doping, hallucinating, takingADive } =
        fighter.state
      const foundFighter = [
        ...this.manager.has.knownFighters,
        ...this.manager.has.fighters.map((f) => f.getInfo()),
      ].find((kf) => kf.name == fighter.name)
      if (foundFighter) {
        const { activeContract, goalContract, name, ...knownFighterStats } =
          foundFighter

        return {
          name,
          sick,
          hallucinating,
          injured,
          doping,
          takingADive,
          ...knownFighterStats,
        }
      }
      const unknownFighter: FighterStateData = {
        name: fighter.name,
        sick,
        injured,
        hallucinating,
        doping,
        takingADive,
      }
      return unknownFighter
    })
  }
}

export class Manager {
  has: ManagerHas
  state = new ManagerState()
  functions: ManagerFunctions

  constructor(name: string, public game: Game) {
    this.has = new ManagerHas(name)
    this.functions = new ManagerFunctions(this, game)
  }
}
