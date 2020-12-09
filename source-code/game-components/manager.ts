

import {Bet} from '../interfaces/game/bet';
import {Subject} from 'rxjs';
import {FighterInfo, Employee, Loan} from '../interfaces/server-game-ui-state.interface';
import Fighter from "./fighter/fighter";
import gameConfiguration from '../game-settings/game-configuration';
import { AbilityName } from './abilities-reformed/ability';
import { ActivityLogItem } from '../types/game/activity-log-item';
import { ManagerImage } from '../types/game/manager-image';
import { PostFightReportItem } from '../interfaces/game/post-fight-report-item';
import ClientAction from '../interfaces/client-action';
import ClientGameAction from '../types/client-game-actions';
import { Player } from '../interfaces/player-info.interface';

export interface KnownManager{
  name: string
  activityLogs: ActivityLogItem[]
  image: ManagerImage
}

export interface ManagerInfo extends KnownManager{
  name: string
  money: number
  abilities: AbilityName[]
  actionPoints: number
  yourFighters: FighterInfo[]
  knownFighters: FighterInfo[]
  loan: Loan
  nextFightBet: Bet
  employees: Employee[]
  readyForNextFight: boolean
  retired: boolean
  otherManagers: KnownManager[]
  activityLogs: ActivityLogItem[]
  image: ManagerImage
}

export default interface Manager{  
  name: string
  money: number
  abilities: AbilityName[]
  actionPoints: number
  fighters: Fighter[]
  knownFighters: FighterInfo[]
  loan: Loan
  nextFightBet: Bet
  employees: Employee[]
  readyForNextFight: boolean
  retired: boolean
  activityLogs: ActivityLogItem[]
  otherManagers: KnownManager[]
  image: ManagerImage
  getInfo(): ManagerInfo
  addToLog(activityLogItem: ActivityLogItem): void
  postFightReportItems: PostFightReportItem[]
  receiveUpdate(clientAction: ClientAction)
}

export const createManager = (player: Player, triggerUpdate: (player: Player) => void): Manager => {

  const manager: Manager = ({
    name: player.name,
    readyForNextFight: false,
    abilities: ['Dope Fighter', 'Train Fighter', 'Research Fighter', 'Offer Contract'],
    money: gameConfiguration.manager.startingMoney,
    actionPoints: 1,
    fighters: [],
    knownFighters: [],
    employees: [],
    activityLogs: [],
    postFightReportItems: [],
    image: 'Fat Man',
    nextFightBet: null,
    otherManagers: [],
    retired: false,
    loan: {debt: 0, weeksOverdue: 0, amountPaidBackThisWeek: 0},
    addToLog: function(activityLogItem: ActivityLogItem){    
      this.activityLogs.push(activityLogItem)
      triggerUpdate(player)
    },
    receiveUpdate,
    getInfo: (): ManagerInfo => {
      let {fighters, ...rest} = manager

      return { 
        ...rest, 
        yourFighters: fighters.map(f => f.getInfo())
      }
    }

  })

  player.manager = manager
  return manager

  function borrowMoney(amount: number){
    manager.money += amount
    manager.loan = {
      ...manager.loan, 
      debt: manager.loan.debt += amount,
      amountPaidBackThisWeek: manager.loan.amountPaidBackThisWeek -= amount
    }
  }
  
  function paybackMoney(amount: number){
    manager.money -= amount
    manager.loan = {
      ...manager.loan, 
      debt: manager.loan.debt -= amount,
      amountPaidBackThisWeek: manager.loan.amountPaidBackThisWeek += amount
    }
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
    
    triggerUpdate(player)
  }

}
