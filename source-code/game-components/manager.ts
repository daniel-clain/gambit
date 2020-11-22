

import {Bet} from '../interfaces/game/bet';
import {Subject} from 'rxjs';
import {FighterInfo, Employee, Loan, KnownFighter} from '../interfaces/game-ui-state.interface';
import Fighter from "./fighter/fighter";
import gameConfiguration from '../game-settings/game-configuration';
import { AbilityName } from './abilities-reformed/ability';
import { ActivityLogItem } from '../types/game/activity-log-item';
import { GoalContract } from '../interfaces/game/contract.interface';
import { ManagerImage } from '../types/game/manager-image';
import { PostFightReportItem } from '../interfaces/game/post-fight-report-item';
import ClientAction from '../interfaces/client-action';
import ClientGameAction from '../types/client-game-actions';
import { Player } from '../interfaces/player-info.interface';

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

export default interface Manager{  
  name: string
  money: number
  abilities: AbilityName[]
  actionPoints: number
  fighters: Fighter[]
  knownFighters: KnownFighter[]
  loan: Loan
  nextFightBet: Bet
  employees: Employee[]
  readyForNextFight: boolean
  retired: boolean
  activityLog: ActivityLogItem[]
  otherManagers: KnownManager[]
  image: ManagerImage
  updateTrigger: Subject<Player>
  getInfo(): ManagerInfo
  addToLog(activityLogItem: ActivityLogItem): void
  postFightReportItems: PostFightReportItem[]
  receiveUpdate(clientAction: ClientAction)
}

export const createManager = (player): Manager => {

  const manager: Manager = ({
    name: player.name,
    readyForNextFight: false,
    abilities: ['Dope Fighter', 'Train Fighter', 'Research Fighter', 'Offer Contract'],
    money: gameConfiguration.manager.startingMoney,
    actionPoints: 1,
    fighters: [],
    knownFighters: [],
    employees: [],
    activityLog: [],
    postFightReportItems: [],
    image: 'Fat Man',
    nextFightBet: null,
    otherManagers: [],
    retired: false,
    loan: undefined,
    updateTrigger: new Subject<Player>(),
    addToLog: function(activityLogItem: ActivityLogItem){    
      this.activityLog.push(activityLogItem)
      this.updateTrigger.next(player)
    },
    receiveUpdate,
    getInfo: (): ManagerInfo => {
      let {fighters, ...rest} = manager

      return { 
        ...rest, 
        fighters: fighters.map(f => f.getInfo())
      }
    }

  })

  player.manager = manager
  return manager

  function borrowMoney(amount: number){
    manager.money += amount
      this.loan = {
        ...this.loan, 
        debt: this.debt += amount,
        amountPaidBackThisWeek: this.amountPaidBackThisWeek -= amount
      }
      manager.updateTrigger.next(player)
      //addToLog({message: `Borrowed ${amount} from the loan shark`})
  }
  
  function paybackMoney(amount: number){
    manager.money -= amount
    this.loan = {
      ...this.loan, 
      debt: this.debt -= amount,
      amountPaidBackThisWeek: this.amountPaidBackThisWeek += amount
    }
    manager.updateTrigger.next(player)
  }

  function receiveUpdate(gameAction: ClientGameAction){
    console.log('gameAction', gameAction)
    const {data} = gameAction
    switch( gameAction.name){
      case 'Bet On Fighter':
        manager.nextFightBet = data; break;
      case 'Borrow Money':
        borrowMoney(data.amount); break;
      case 'Payback Money':
        paybackMoney(data.amount); break;
      case 'Toggle Ready':
        manager.readyForNextFight = data.ready; break;
    }
  }

}
