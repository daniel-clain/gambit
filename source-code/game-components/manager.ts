

import {Bet} from '../interfaces/game/bet';
import {Subject} from 'rxjs';
import {FighterInfo, Employee, Loan, KnownFighter} from '../interfaces/game-ui-state.interface';
import Fighter from "./fighter/fighter";
import gameConfiguration from '../game-settings/game-configuration';
import Game from './game';
import { AbilityName } from './abilities-reformed/ability';
import { ActivityLogItem } from '../types/game/activity-log-item';
import { GoalContract } from '../interfaces/game/contract.interface';
import { ManagerImage } from '../types/game/manager-image';
import { PostFightReportItem } from '../interfaces/game/post-fight-report-item';

export interface KnownManager{
  name: string
}

export interface ManagerInfo{
  name: string
  money: number
  abilities: AbilityName[]
  actionPoints: number
  fighters: FighterInfo[]
  knownFighters: KnownFighter[]
  loan: Loan
  nextFightBet: Bet
  employees: Employee[]
  readyForNextFight: boolean
  retired: boolean
  otherManagers: KnownManager[]
  activityLog: ActivityLogItem[]
  image: ManagerImage
}
export default class Manager{
  private _money: number = gameConfiguration.manager.startingMoney
  private _actionPoints: number = 1
  fighters: Fighter[] = []
  knownFighters: KnownFighter[] = []
  abilities: AbilityName[] = ['Dope Fighter', 'Train Fighter', 'Research Fighter', 'Offer Contract']
  private _nextFightBet: Bet
  employees: Employee[] = []
  private _loan: Loan = {debt: 0, weeksOverdue: 0, amountPaidBackThisWeek: 0}
  private _readyForNextFight: boolean
  private _retired: boolean
  private activityLog: ActivityLogItem[] = []  
  postFightReportItems: PostFightReportItem[] = []
  
  image: ManagerImage = 'Fat Man'


  managerUpdatedSubject: Subject<ManagerInfo> = new Subject()
  managerErrorSubject: Subject<string> = new Subject()

  constructor(public name: string, private game: Game){}

  get info(): ManagerInfo{
    return {
      name: this.name,
      money: this._money,
      abilities: this.abilities,
      actionPoints: this._actionPoints,
      fighters: this.fighters.map(fighter => fighter.getInfo()),
      knownFighters: this.knownFighters,
      nextFightBet: this._nextFightBet,
      employees: this.employees,
      loan: this._loan,
      readyForNextFight: this._readyForNextFight,
      retired: this._retired,
      otherManagers: this.game.managers
        .filter(manager => manager.name !== this.name)
        .map(manager => ({name: manager.name})),
      activityLog: this.activityLog,
      image: this.image
    }
  }

  set money(val: number){
    this._money = val
    this.sendUpdate()
  }
  get money(){
    return this._money
  }
  set actionPoints(val){
    this._actionPoints = val
    this.sendUpdate()
  }
  get actionPoints(){
    return this._actionPoints
  }

  set nextFightBet(bet: Bet){
    this._nextFightBet = bet
    this.sendUpdate()
  }
  get nextFightBet(): Bet{
    return this._nextFightBet
  }

  set loan(value: Loan){
    this._loan = value
  }
  get loan(): Loan{
    return this._loan
  }

  set readyForNextFight(value: boolean){
    this._readyForNextFight = value
    this.sendUpdate()
  }
  
  get readyForNextFight(): boolean{
    return this._readyForNextFight
  }

  sendUpdate(){
    this.managerUpdatedSubject.next(this.info)
  }



  addToLog(activityLogItem: ActivityLogItem){    
    this.activityLog.push(activityLogItem)
    this.sendUpdate()
  }
  


  borrowMoney(amount: number){
    this.money += amount
    this.loan = {
      ...this._loan, 
      debt: this._loan.debt += amount,
      amountPaidBackThisWeek: this._loan.amountPaidBackThisWeek -= amount
    }
    this.sendUpdate()
    //this.addToLog({message: `Borrowed ${amount} from the loan shark`})
  }
  paybackMoney(amount: number){
    this.money -= amount
    this.loan = {
      ...this._loan, 
      debt: this._loan.debt -= amount,
      amountPaidBackThisWeek: this._loan.amountPaidBackThisWeek += amount
    }
    this.sendUpdate()
  }


  
}