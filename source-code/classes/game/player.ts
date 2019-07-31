import {Subject} from 'rxjs';
import {GameUiState, FightUiState, ManagerUiState} from '../../interfaces/game-ui-state.interface';
import ClientId from '../../types/client-id.type';
import ClientName from '../../types/client-name.type';
import { Socket } from 'socket.io';
import PlayerAction from '../../interfaces/player-action';
import Manager from './manager/manager';
import { RoundController } from './round-controller';

export default class Player{

  
  private gameUiState: GameUiState = {
    fightUiState: null,
    managerUiState: null,
  }
  
  constructor(private manager: Manager, private socket: Socket, private _id: ClientId, private _name: ClientName, private roundController: RoundController){
    this.socket.on('Action From Player', this.handlePlayerAction.bind(this))
    this.manager.uiStateSubject.subscribe(this.receiveManagerUiUpdate.bind(this))
    this.roundController.fightUiStateSubject.subscribe(this.receiveFightUiUpdate.bind(this))
  }


  get id(){
    return this._id
  }
  get name(){
    return this._name
  }

  private receiveFightUiUpdate(fightEventState: FightUiState){ 
    this.gameUiState.fightUiState = fightEventState
    this.emitGameUIStateUpdate()
  }

  private receiveManagerUiUpdate(managerOptionsState: ManagerUiState){ 
    this.gameUiState.managerUiState = managerOptionsState
    this.emitGameUIStateUpdate()
  }

  private emitGameUIStateUpdate(){
    this.socket.emit('Game UI State Update', this.gameUiState)
  }

  private handlePlayerAction(playerAction: PlayerAction){
    const {args} = playerAction
    switch(playerAction.name){
      case 'Add Manager Action': 
        this.manager.addAction(playerAction.args); break;
      case 'Bet On Fighter':
        this.manager.betOnFigher(args.fighterName, args.betSize); break;
      case 'Borrow Money':
        this.manager.borrowMoney(args.amount); break;
      case 'Payback Money':
        this.manager.paybackMoney(args.amount); break;
      case 'Toggle Ready':
        this.manager.toggleReady(args.ready); break;
    }
  }
}
