

import {Bet} from '../interfaces/game/bet';
import Fighter from "./fighter/fighter";
import gameConfiguration from '../game-settings/game-configuration';
import { AbilityName } from './abilities-reformed/ability';
import { ActivityLogItem } from '../types/game/activity-log-item';
import { ManagerImage } from '../types/game/manager-image';
import { PostFightReportItem } from '../interfaces/game/post-fight-report-item';
import { Game } from './game';
import { FighterInfo, Loan, Employee } from '../interfaces/front-end-state-interface';



/* 
  What can a 'Manager' do
  he can: 
    - bet on a fighter in the upcoming fight
    - get a fighter to fight for him
    - contract employees to help out
    - borrow money from the loan shark
    - pay off money owed to the loan shark
    - train one of his fighters
    - dope one of his fighters
    - give up

  What does a 'Manager' have
  he has:
    - knowlege of existing fighters
    - knowlege of other managers
    - fighters fighting for him
    - employed professionals
    - money
    - action points
    - loan
    - bet
    - activity log
    - an image of himself

  What state can the manager be in
  he can be:
    - retired
    - ready for the next round

*/
interface KnownManagerStat{  
  lastKnownValue: any,
  roundsSinceUpdated: number
}

export interface KnownManager{
  name: string
  image: ManagerImage
  activityLogs: KnownManagerStat
}

export interface ManagerInfo{
  name: string
  money: number
  abilities: AbilityName[]
  actionPoints: number
  fighters: FighterInfo[]
  knownFighters: FighterInfo[]
  loan?: Loan
  nextFightBet?: Bet
  employees?: Employee[]
  readyForNextFight: boolean
  givenUp: boolean
  otherManagers: KnownManager[]
  activityLogs: ActivityLogItem[]
  image: ManagerImage
}

export class ManagerState{
  readyForNextFight: boolean = false
  givenUp = false
}

class ManagerHas{
  logColorNumber: number
  constructor(public name: string){
    this.logColorNumber = 0
  }
  money = gameConfiguration.manager.startingMoney
  actionPoints = 1
  fighters: Fighter[] = []
  employees: Employee[] = []
  loan: Loan = {debt: 0, weeksOverdue: 0, amountPaidBackThisWeek: 0}
  image: ManagerImage = 'Fat Man'
  nextFightBet?: Bet
  otherManagers: KnownManager[] = []
  knownFighters: FighterInfo[] = []
  activityLogs: ActivityLogItem[] = []
  abilities: AbilityName[] = ['Dope Fighter', 'Train Fighter', 'Research Fighter', 'Offer Contract']
  postFightReportItems: PostFightReportItem[] = []

  
}


class ManagerFunctions{

  constructor(private manager: Manager){}

  addToLog(activityLogItem: ActivityLogItem): void{
    
    const {has} = this.manager
    has.logColorNumber >= 345 ? has.logColorNumber = 0 : has.logColorNumber += 10
    this.manager.has.activityLogs.push({...activityLogItem, color1: `hsl(${has.logColorNumber}deg 50% 50% / 80%)`, color2: `hsl(${has.logColorNumber - 10}deg 50% 50% / 80%)`})
    
  }

  getInfo(): ManagerInfo{
    return {
      ...this.manager.state,
      ...this.manager.has,
      fighters: this.manager.has.fighters.map(f => f.getInfo())
    }
  }
  paybackMoney = (amount: number) =>  {
    const {has} = this.manager
    has.money -= amount
    has.loan = {
      ...has.loan, 
      debt: has.loan.debt -= amount,
      amountPaidBackThisWeek: has.loan.amountPaidBackThisWeek += amount
    }
  }

  borrowMoney = (amount: number) => {
    const {has} = this.manager
    has.money += amount
    has.loan = {
      ...has.loan, 
      debt: has.loan.debt += amount,
      amountPaidBackThisWeek: has.loan.amountPaidBackThisWeek -= amount
    }
  }

  getKnownFighterStats(nextFightFighters: Fighter[]){
    return nextFightFighters.map(fighter => {
      const {sick, injured, doping, hallucinating} = fighter.state
      const foundFighter = this.manager.has.knownFighters?.find(kf => kf.name == fighter.name)
      if(foundFighter){
        const {activeContract,  goalContract, name, ...knownFighterStats} = foundFighter

        return {name, sick, hallucinating, injured, doping, ...knownFighterStats}
      }
      return {name: fighter.name, sick, injured, hallucinating, doping, fitness: undefined, strength: undefined, aggression: undefined, intelligence: undefined, numberOfFights: undefined, manager: undefined, numberOfWins: undefined}

    })
  }

  
}

export class Manager{
  has: ManagerHas
  state = new ManagerState()
  functions: ManagerFunctions

  constructor(private game: Game, name: string){
    this.has = new ManagerHas(name)
    this.functions = new ManagerFunctions(this)
  }


   
  
  

}
