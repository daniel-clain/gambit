import {AbilitySourceType, AbilityTarget, AbilityTargetType} from './../abilities/abilities';

import {Bet} from './../../../interfaces/game/bet';
import {Subject} from 'rxjs';
import {FighterInfo, Employee, Loan} from '../../../interfaces/game-ui-state.interface';
import Fighter from "../fighter/fighter";
import { AbilitySource } from '../abilities/abilities';


export interface ManagerInfo{
  name: string
  money: number
  actionPoints: number
  fighters: FighterInfo[]
  knownFighters: FighterInfo[]
  loan: Loan
  nextFightBet: Bet
  employees: Employee[]
  readyForNextFight: boolean
  retired: boolean
}
export default class Manager implements AbilitySource, AbilityTarget{
  private _money: number = 500
  private _actionPoints: number = 1
  private _fighters: Fighter[] = []
  private _knownFighters: FighterInfo[] = []
  private _nextFightBet: Bet
  private _employees: Employee[] = []
  private _loan: Loan
  private _readyForNextFight: boolean
  private _retired: boolean

  type: any = 'Manager'

  managerUpdatedSubject: Subject<ManagerInfo> = new Subject()
  managerErrorSubject: Subject<string> = new Subject()

  constructor(private _name: string){}

  get info(): ManagerInfo{
    return {
      name: this._name,
      money: this._money,
      actionPoints: this._actionPoints,
      fighters: this._fighters.map(fighter => fighter.getInfo()),
      knownFighters: this._knownFighters,
      nextFightBet: this._nextFightBet,
      employees: this._employees,
      loan: this._loan,
      readyForNextFight: this._readyForNextFight,
      retired: this._retired
    }
  }


  get name(): string{
    return this._name
  }


  set money(val: number){
    this._money = val
    this.managerUpdatedSubject.next(this.info)
  }
  set actionPoints(val){
    this._actionPoints = val
    this.managerUpdatedSubject.next(this.info)
  }

  set nextFightBet(bet: Bet){
    if(this._nextFightBet != null){
      this._money += this._nextFightBet.amount
      this._nextFightBet = null
    }
    this._money -= bet.amount
    this._nextFightBet = bet
    this.managerUpdatedSubject.next(this.info)

  }
  get nextFightBet(): Bet{
    return this._nextFightBet
  }

  set loan(value: Loan){
    this._loan = value
  }

  set readyForNextFight(value: boolean){
    this._readyForNextFight = value
    this.managerUpdatedSubject.next(this.info)
  }
  
  get readyForNextFight(): boolean{
    return this._readyForNextFight
  }

  get knownFighters(): FighterInfo[]{
    return this._knownFighters
  }

  set knownFighters(value: FighterInfo[]){
    this._knownFighters = value
  }

  get fighters(): Fighter[]{
    return this._fighters
  }

  get employees(){return this._employees}
  

  resetForNewRound(){
    this.nextFightBet = {
      fighterName: null,
      amount: null
    }
    this.readyForNextFight = false
    this.actionPoints = 3
  }


  borrowMoney(amount: number){
    this._money += amount
    this.loan = {...this._loan, debt: this._loan.debt += amount}
  }
  paybackMoney(amount: number){
    this._money -= amount
    this.loan = {...this._loan, debt: this._loan.debt -= amount}
  }

  addEmployee(Employee){

  }

  
}