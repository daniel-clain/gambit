import {ManagerInfo} from './../../../interfaces/game-ui-state.interface';
import {Bet} from './../../../interfaces/game/bet';
import {Subject} from 'rxjs';
import {FighterInfo, Employee, Loan} from '../../../interfaces/game-ui-state.interface';
import Fighter from "../fighter/fighter";
import { OptionNames, SelectedOptionInfo, IOptionProcessor } from './manager-options/manager-option';
import PlayerAction from '../../../interfaces/player-action';
import OptionsProcessor from './manager-options/manager-option';

export interface ManagerState{
  money: number
  actionPoints: number
  loan: Loan
  employees: Employee[]
  readyForNextFight: boolean
  retired: boolean
  fighters: Fighter[]
  storedOptions: SelectedOptionInfo[]
  knownFighters: FighterInfo[]
  nextFightBet: Bet
}

export default class Manager{ 
  private _money: number = 500
  private _actionPoints = 3
  private _loan: Loan = {
    debt: 0,
    weeksOverdue: 0
  }
  private _employees: Employee[] = []
  private _readyForNextFight: boolean
  private _retired: boolean
  private _fighters: Fighter[] = []
  private _storedOptions: SelectedOptionInfo[] = []
  private _knownFighters: FighterInfo[] = []
  private _nextFightBet: Bet
  private options: OptionNames[] = ['Research fighter', 'Offer contract', 'Train fighter', 'Dope fighter', 'Discover fighter']


  managerStateUpdatedSubject: Subject<ManagerState> = new Subject()
  managerErrorSubject: Subject<string> = new Subject()

  constructor(private _name: string){}

  get managerState(): ManagerState{
    return {
      money: this._money,
      actionPoints: this._actionPoints,
      fighters: this._fighters,
      knownFighters: this._knownFighters,
      nextFightBet: this._nextFightBet,
      employees: this._employees,
      loan: this._loan,
      readyForNextFight: this._readyForNextFight,
      storedOptions: this._storedOptions,
      retired: this._retired
    }
  }


  get info(): ManagerInfo{
    return {
      name: this.name,
      money: this.money,
      actionPoints: this.actionPoints,
      options: this.options
    }
  }

  get name(){return this._name}


  set money(val: number){
    this._money = val
    this.managerStateUpdatedSubject.next(this.managerState)
  }
  set actionPoints(val){
    this._actionPoints = val
    this.managerStateUpdatedSubject.next(this.managerState)
  }

  set nextFightBet(bet: Bet){
    if(this._nextFightBet != null){
      this._money += this._nextFightBet.amount
      this._nextFightBet = null
    }
    this._money -= bet.amount
    this._nextFightBet = bet
    this.managerStateUpdatedSubject.next(this.managerState)

  }
  get nextFightBet(): Bet{
    return this._nextFightBet
  }

  set loan(value: Loan){
    this._loan = value
  }

  set readyForNextFight(value: boolean){
    this._readyForNextFight = value
    this.managerStateUpdatedSubject.next(this.managerState)
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

  get storedOptions(): SelectedOptionInfo[]{
    return this._storedOptions
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

  
}