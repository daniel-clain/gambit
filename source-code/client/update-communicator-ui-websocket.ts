import * as io from 'socket.io-client'
import { Subject } from "rxjs";
import PlayerAction from "../interfaces/player-action";
import ClientAction from "../interfaces/client-action";
import { MainGameData, PlayerManagerUiData, PlayerGameUiData, DisplayGameUiData } from '../interfaces/game-ui-state.interface';
import IUpdateCommunicatorUi from '../interfaces/update-communicator-ui.interface';


export default class UpdateCommunicatorUiWebsocket implements IUpdateCommunicatorUi {
  receivePlayerGameUiData: Subject<PlayerGameUiData> = new Subject()
  receiveDisplayGameUiData: Subject<DisplayGameUiData> = new Subject()
  port = 33 
  socket: SocketIOClient.Socket
  isConnected: boolean
  receiveMainGameData: Subject<MainGameData> = new Subject()

  websocketAddress = '192.168.0.3'

  constructor(){
    this.setUpWebsockets()
  }  

  private setUpWebsockets(){    
    this.isConnected = true
    this.socket = io(`${this.websocketAddress}:${this.port}`, {transports: ['websocket']}); 
    this.socket.on('disconnect', e => {
      console.log('e :', e);
    })
    this.socket.on('Main Game Data Update', (clientUIState: MainGameData) => this.receiveMainGameData.next(clientUIState))

    this.socket.on('Player Game UI Update', (playerGameUiData: PlayerGameUiData) => this.receivePlayerGameUiData.next(playerGameUiData))

    this.socket.on('Display Game UI Update', (displayGameUiData: DisplayGameUiData) => this.receiveDisplayGameUiData.next(displayGameUiData))
  }

  sendClientAction(clientAction: ClientAction){
    this.socket.emit('Action From Client', clientAction)
  }

  sendPlayerAction(playerAction: PlayerAction){
    this.socket.emit('Action From Player', playerAction)
  }

  



}