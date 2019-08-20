import {AbilityData} from './abilities/abilities';
import {Subject} from 'rxjs';
import {GameUiState} from '../../interfaces/game-ui-state.interface';
import ClientId from '../../types/client-id.type';
import ClientName from '../../types/client-name.type';
import { Socket } from 'socket.io';
import Manager, { ManagerInfo } from './manager/manager';
import { FightState } from './fight/fight';
import {RoundState, RoundController} from './round-controller';
import PlayerAction from '../../interfaces/player-action';
import AbilityProcessor from './abilities/ability-processor';

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
    private abilityProcessor: AbilityProcessor
  ){
    this.socket.on('Action From Player', this.handleActionsFromClient.bind(this))

    this.roundController.roundStateUpdateSubject.subscribe(this.receiveRoundUpdate.bind(this))
    this.roundController.fightStateUpdatedSubject.subscribe(this.receiveFightUpdate.bind(this))
    this.manager.managerUpdatedSubject.subscribe(this.receiveManagerUpdate.bind(this))

    this.gameUiState.managerUiState.managerInfo = manager.info
  }

  handleActionsFromClient(playerAction: PlayerAction){
    const {args} = playerAction
    switch(playerAction.name){
      case 'Ability Confirmed': 
        this.handleAbilitySelected(args); break;
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
  handleAbilitySelected(selectedAbility: AbilityData){
    this.abilityProcessor.processSelectedAbility(selectedAbility)
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

  private receiveManagerUpdate(managerInfo: ManagerInfo){
    this.gameUiState.managerUiState.managerInfo = managerInfo
    this.emitGameUIStateUpdate()
  }

  private emitGameUIStateUpdate(){
    this.socket.emit('Game UI State Update', this.gameUiState)
  }

}
