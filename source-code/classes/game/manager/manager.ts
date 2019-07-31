
import {Bet} from './../../../interfaces/game/bet';
import {ICost} from './../../../interfaces/game/cost.interface';
import {Subject} from 'rxjs';
import {ManagerUiState, FighterInfo, LoanSharkData, Employee} from '../../../interfaces/game-ui-state.interface';
import Fighter from "../fighter/fighter";
import Player from '../player';
import { Contract } from '../../../interfaces/game/contract.interface';
import BetSize from '../../../types/bet-size.type';
import managerOptions, { IManagerOption } from './manager-options/manager-option';
import { IManagerAction } from './manager-action';
import { RoundController } from '../round-controller';

export default class Manager{  
  name = 'fag'
  retired: boolean
  money: number = 500
  clientFighters: Fighter[] = []
  actionPoints = 3
  options: IManagerOption[]
  knownFighters: FighterInfo[] = []
  nextFightBet: Bet
  loanSharkData: LoanSharkData
  employees: Employee[] = []
  ready: boolean
  actions: IManagerAction[] = []

  uiStateSubject: Subject<ManagerUiState> = new Subject()

  constructor(private roundController: RoundController){
    this.options = managerOptions
    this.roundController.timeUntilNextFightSubject.subscribe(this.onNextFightTimerUpdate.bind(this))
  }

  private getUiState(): ManagerUiState{

    const {timeUntilNextFight} = this.roundController

    const nextFightFighters = this.roundController.fight.fighters.map((fighter: Fighter) => fighter.getInfo())

    const managerUiState: ManagerUiState = {
      timeUntilNextFight,
      money: this.money,
      actionPoints: this.actionPoints,
      nextFightFighters,
      knownFighters: this.knownFighters,
      nextFightBet: this.nextFightBet,
      yourEmployees: this.employees,
      jobSeekers: this.roundController.jobSeekers,
      loanSharkData: this.loanSharkData,
      ready: this.ready,
      actions: this.actions
    }
    return managerUiState
  }

  addAction(action: IManagerAction){
    const {source, name} = action

    const managerOption: IManagerOption = this.options.find(
      (managerOption: IManagerOption) => managerOption.name == action.name)

    let cost: ICost = managerOption.getCost(source.type)
    if(name == 'Offer contract'){
      const contract: Contract = action.args.contract
      cost.money -= contract.initialCost
    }

    if(cost.money < this.money){
      console.log(`error, trying to add action but does not have enough money`);
      return
    }
    if(cost.actionPoints < this.actionPoints){
      console.log(`error, trying to add action but not enought action points`);
      return
    }

    this.actionPoints = this.actionPoints - cost.actionPoints
    this.money = this.money - cost.money
    this.actions.push(action)
    this.managerUiStateUpdated()
  }

  onNextFightTimerUpdate(){
    this.managerUiStateUpdated()
  }

  managerUiStateUpdated(){
    this.uiStateSubject.next(this.getUiState())
  }
  
/*removeAction(name: ManagerOptionNames, sourceName){
    const actionIndex = this.actions.findIndex((action: IMangerAction) => action.name == name && action.source.name == sourceName)
    if(actionIndex == -1){
      console.log(`error, tried to remove action (${name}) but didnt exist in list`);
      return
    }

    const action: IMangerAction = this.actions[actionIndex]
    const {source} = action

    const managerOption: ManagerOption = this.options.find(
      (managerOption: ManagerOption) => managerOption.name == action.name)

    let cost: ICost = managerOption.getCost(source.type)


    if(name == 'Offer contract'){
      const contract: Contract = action.args.contract
      cost.money += contract.initialCost
    }

    if(name == 'Bet on fighter'){
      const contract: Contract = action.args.contract
      cost.money += contract.initialCost
    }

    this.money += cost.money
    this.actionPoints += cost.actionPoints

    this.actions.splice(actionIndex, 1)
    
  } */

  betOnFigher(fighterName, betSize: BetSize){
    const fighter: Fighter = this.roundController.fight.fighters.find(
      (fighter: Fighter) => fighter.name == fighterName)

    if(fighter == undefined){
      console.log('error, tried to bet on fight that could not be found in the fight');
      return
    }
    this.nextFightBet = {
      fighterName: fighterName,
      size: betSize
    }
    this.managerUiStateUpdated()

  }

  borrowMoney(amount){
    this.loanSharkData.debt += amount
    this.managerUiStateUpdated()
  }
  paybackMoney(amount){
    this.loanSharkData.debt -= amount
    this.managerUiStateUpdated()

  }

  toggleReady(ready){
    this.ready = ready
    this.managerUiStateUpdated()
  }
  
}