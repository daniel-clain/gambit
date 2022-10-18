

import {Bet} from '../interfaces/game/bet';
import Fighter from "./fighter/fighter";
import gameConfiguration from '../game-settings/game-configuration';
import { AbilityName } from './abilities-general/ability';
import { ActivityLogItem } from '../types/game/activity-log-item';
import { ManagerImage } from '../types/game/manager-image';
import { PostFightReportItem } from '../interfaces/game/post-fight-report-item';
import { Game } from './game';
import { FighterInfo, Loan, Employee } from '../interfaces/front-end-state-interface';
import { Evidence } from '../types/game/evidence.type';
import { Lawsuit } from '../types/game/lawsuit.type';
import { randomFloor } from '../helper-functions/helper-functions';



export interface KnownManagerStat{  
  lastKnownValue: any,
  weeksSinceUpdated: number
}

export interface KnownManager{
  name: string
  characterType: 'Known Manager'
  image: ManagerImage
  money: KnownManagerStat
  employees: KnownManagerStat
  fighters: KnownManagerStat
  loan: KnownManagerStat
  evidence: KnownManagerStat
}

export interface ManagerInfo{
  name: string
  characterType: 'Manager'
  money: number
  abilities: AbilityName[]
  actionPoints: number
  fighters: FighterInfo[]
  knownFighters: FighterInfo[]
  loan?: Loan
  nextFightBet?: Bet
  employees?: Employee[]
  readyForNextFight: boolean
  otherManagers: KnownManager[]
  activityLogs: ActivityLogItem[]
  image: ManagerImage
  evidence: Evidence[]
}

export class ManagerState{
  readyForNextFight: boolean = false
  underSurveillance: {professional: string} = undefined
  beingProsecuted: boolean = false
  inJail: {
    weeksTotal: number,
    weeksRemaining: number,
    lawsuit: Lawsuit
  }
}

class ManagerHas{
  logColorNumber: number
  constructor(public name: string){
    this.logColorNumber = 0
  }
  money = gameConfiguration.manager.startingMoney
  actionPoints = gameConfiguration.manager.actionPoints
  fighters: Fighter[] = []
  employees: Employee[] = []
  loan: Loan
  image: ManagerImage = randomFloor(2) ? 'Fat Man' : 'Moustache Man'
  nextFightBet?: Bet
  otherManagers: KnownManager[] = []
  knownFighters: FighterInfo[] = []
  activityLogs: ActivityLogItem[] = []
  abilities: AbilityName[] = ['Dope Fighter', 'Train Fighter', 'Research Fighter', 'Offer Contract', 'Domination Victory', 'Sinister Victory', 'Wealth Victory', 'Take A Dive']
  postFightReportItems: PostFightReportItem[] = []
  evidence: Evidence[] = []

  
}


class ManagerFunctions{
  logCount = 0

  constructor(private manager: Manager, private game: Game){}

  addToLog(activityLogItem: Omit<ActivityLogItem, 'id'>): void{
    this.logCount ++
    const {has} = this.manager
    has.logColorNumber >= 345 ? has.logColorNumber = 0 : has.logColorNumber += 10
    this.manager.has.activityLogs.unshift({...activityLogItem, color1: `hsl(${has.logColorNumber}deg 50% 50%)`, color2: `hsl(${has.logColorNumber - 10}deg 50% 50%)`, id: this.logCount})
    
  }

  toggleReady = () => {
    const ready = !this.manager.state.readyForNextFight
    this.manager.state.readyForNextFight = ready
    this.game.functions.triggerUIUpdate()
  }

  betOnFighter = (bet: Bet) => {
    
    bet && this.addToLog({
      weekNumber: this.game.has.weekController.weekNumber,
      message: `Made a ${bet.size} bet on ${bet.fighterName}`})
    this.manager.has.nextFightBet = bet
  }

  getInfo(): ManagerInfo{
    return {
      characterType: 'Manager',
      ...this.manager.state,
      ...this.manager.has,
      fighters: this.manager.has.fighters.map(f => f.getInfo())
    }
  }
  paybackMoney = (amount: number) =>  {
    this.addToLog({
      weekNumber: this.game.has.weekController.weekNumber,
      message: `Paid back ${amount} to the Loan Shark`})
    const {has} = this.manager
    has.money -= amount
    has.loan = {
      ...has.loan, 
      debt: has.loan.debt -= amount,
      amountPaidBackThisWeek: has.loan.amountPaidBackThisWeek += amount
    }
  }

  borrowMoney = (amount: number) => {
    this.addToLog({
      weekNumber: this.game.has.weekController.weekNumber,
      message: `Borrowed ${amount} from the Loan Shark`})
    const {has} = this.manager
    has.money += amount
    if(!has.loan){
      has.loan = {
        isNew: true,
        debt: amount,
        amountPaidBackThisWeek: 0,
        weeksOverdue: 0
      }
    } else {
      has.loan = {
        ...has.loan, 
        debt: has.loan.debt += amount,
        amountPaidBackThisWeek: has.loan.amountPaidBackThisWeek -= amount
      }
    }
  }

  getKnownFighterStats(nextFightFighters: Fighter[]){
    return nextFightFighters.map(fighter => {
      const {sick, injured, doping, hallucinating, takingADive} = fighter.state
      const foundFighter = [
        ...this.manager.has.knownFighters,
        ...this.manager.has.fighters.map(f => f.getInfo()),
      ].find(kf => kf.name == fighter.name)
      if(foundFighter){
        const {activeContract, goalContract, name, ...knownFighterStats} = foundFighter

        return {name, sick, hallucinating, injured, doping, takingADive, ...knownFighterStats}
      }
      return {
        name: fighter.name, 
        sick, injured, hallucinating, doping, 
        fitness: undefined, 
        strength: undefined, 
        aggression: undefined, 
        intelligence: undefined, 
        numberOfFights: undefined, 
        manager: undefined, 
        numberOfWins: undefined, 
        takingADive: undefined}

    })
  }

  
}

export class Manager{
  has: ManagerHas
  state = new ManagerState()
  functions: ManagerFunctions

  constructor(name: string, public game: Game){
    this.has = new ManagerHas(name)
    this.functions = new ManagerFunctions(this, game)
  }


   
  
  

}
