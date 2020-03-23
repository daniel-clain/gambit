import * as io from 'socket.io-client'
import { Subject } from "rxjs";
import { MainGameData, PlayerManagerUiData, PlayerGameUiData, DisplayGameUiData } from '../interfaces/game-ui-state.interface';
import IUpdateCommunicatorUi from '../interfaces/update-communicator-ui.interface';
import PreGameAction from '../interfaces/client-action';
import ClientGameAction from '../types/client-game-actions';


export default class UpdateCommunicatorUiWebsocket implements IUpdateCommunicatorUi {
  receivePlayerGameUiData: Subject<PlayerGameUiData> = new Subject()
  receiveDisplayGameUiData: Subject<DisplayGameUiData> = new Subject()
  socket: SocketIOClient.Socket
  isConnected: boolean
  receiveMainGameData: Subject<MainGameData> = new Subject()
  port = process.env.WEBSOCKET_PORT
  websocketAddress = 'localhost'//'192.168.43.229'

  constructor(){
    console.log(process.env.WEBSOCKET_PORT);
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

  sendClientAction(clientAction: PreGameAction){
    this.socket.emit('Action From Client', clientAction)
  }

  sendGameAction( gameAction: ClientGameAction){
    this.socket.emit('Action From Player',  gameAction)
  }

  



}