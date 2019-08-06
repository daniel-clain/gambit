import {Subject} from 'rxjs';
import {GameUiState} from '../../interfaces/game-ui-state.interface';
import ClientId from '../../types/client-id.type';
import ClientName from '../../types/client-name.type';
import { Socket } from 'socket.io';
import Manager, { ManagerState } from './manager/manager';
import { FightState } from './fight/fight';
import {RoundState, RoundController} from './round-controller';
import PlayerAction from '../../interfaces/player-action';
import OptionsProcessor from './manager/manager-options/manager-option';

export default class Player{
  
  private gameUiState: GameUiState = {
    fightUiState: {
      preFightNews: [],
      postFightReport: null,
      startCountdown: null,
      timeRemaining: null,
      fighters: []
    },
    managerUiState: {
      managerInfo: null,
      nextFightBet: null,
      managersFighters: [],
      knownFighters: [],
      employees: [],
      loan: null,
      readyForNextFight: false,
      actions: null,
      retired: null,
      managerOptionsTimeLeft: null,
      nextFightFighters: [],
      jobSeekers: [],
      notifications: []
    },
  }
  
  constructor(
    private socket: Socket, 
    private id: ClientId, 
    private name: ClientName,
    private roundController: RoundController,
    private manager: Manager,  
    private optionsProcessor: OptionsProcessor
  ){
    this.socket.on('Action From Player', this.handleActionsFromClient.bind(this))
    this.roundController.roundStateUpdateSubject.subscribe(this.receiveRoundUpdate.bind(this))
    this.roundController.fightStateUpdatedSubject.subscribe(this.receiveFightUpdate.bind(this))
    this.manager.managerStateUpdatedSubject.subscribe(this.receiveManagerUpdate.bind(this))
    this.gameUiState.managerUiState.name = manager.name
  }

  handleActionsFromClient(playerAction: PlayerAction){
    const {args} = playerAction
    switch(playerAction.name){
      case 'Option Confirmed': 
        this.optionsProcessor.processSelectedOption(args.optionInfo); break;
      case 'Bet On Fighter':
        this.manager.nextFightBet = {fighterName: args.fighterName, amount: args.betSize}; break;
      case 'Borrow Money':
        this.manager.borrowMoney(args.amount); break;
      case 'Payback Money':
        this.manager.paybackMoney(args.amount); break;
      case 'Toggle Ready':
        this.manager.readyForNextFight = args.ready; break;
    }
  }



  private receiveRoundUpdate(roundState: RoundState){ 
    const {managerUiState} = this.gameUiState
    managerUiState.managerOptionsTimeLeft = roundState.managerOptionsTimeLeft
    managerUiState.nextFightFighters = roundState.activeFight.fighters.map(
      fighter => fighter.getInfo())
    managerUiState.jobSeekers = roundState.activeJobSeekers
    this.emitGameUIStateUpdate()
  }

  private receiveFightUpdate(fightState: FightState){ 
    const {fightUiState} = this.gameUiState
    fightUiState.fighters = fightState.fighters
    fightUiState.startCountdown = fightState.startCountdown
    fightUiState.timeRemaining = fightState.timeRemaining

    this.emitGameUIStateUpdate()
  }


  private receiveManagerError(error: string){ 
    const {managerUiState} = this.gameUiState
    managerUiState.notifications.push(error)
  }

  private receiveManagerUpdate(managerState: ManagerState){ 
    const {managerUiState} = this.gameUiState
    managerUiState.actionPoints = managerState.actionPoints
    managerUiState.money = managerState.money
    managerUiState.managersFighters = managerState.fighters.map(f => f.getInfo())
    managerUiState.knownFighters = managerState.knownFighters
    managerUiState.nextFightBet = managerState.nextFightBet
    managerUiState.retired = managerState.retired
    managerUiState.readyForNextFight = managerState.readyForNextFight
    managerUiState.employees = managerState.employees
    managerUiState.loan = managerState.loan
    this.emitGameUIStateUpdate()
  }

  private emitGameUIStateUpdate(){
    this.socket.emit('Game UI State Update', this.gameUiState)
  }

}
