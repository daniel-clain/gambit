import * as io from 'socket.io-client'
import { Subject } from "rxjs";
import PlayerAction from "../../interfaces/player-action";
import ClientAction from "../../interfaces/client-action";
import { GameUiState, GameHostUiState } from '../../interfaces/game-ui-state.interface';
import IUpdateCommunicatorUi from '../../interfaces/update-communicator-ui.interface';


export default class UpdateCommunicatorUiWebsocket implements IUpdateCommunicatorUi {
  receiveGameUiStateUpdate: Subject<GameUiState> = new Subject()
  port = 33 
  socket: SocketIOClient.Socket
  isConnected: boolean
  gameHostUiStateUpdate: Subject<GameHostUiState> = new Subject()

  websocketAddress = '192.168.0.12'

  constructor(){
    this.setUpWebsockets()
  }  

  private setUpWebsockets(){    
    this.isConnected = true
    this.socket = io(`${this.websocketAddress}:${this.port}`, {transports: ['websocket']}); 
    this.socket.on('disconnect', e => {
      console.log('e :', e);
    })
    this.socket.on('Game Host UI State Update', (clientUIState: GameHostUiState) => this.gameHostUiStateUpdate.next(clientUIState))
    this.socket.on('Game UI State Update', (gameUiState: GameUiState) => this.receiveGameUiStateUpdate.next(gameUiState))
  }

  sendClientAction(clientAction: ClientAction){
    this.socket.emit('Action From Client', clientAction)
  }

  sendPlayerAction(playerAction: PlayerAction){
    this.socket.emit('Action From Player', playerAction)
  }

  



}