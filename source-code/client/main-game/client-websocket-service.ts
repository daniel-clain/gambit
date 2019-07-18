import {GameUIState} from './../components/game-ui';

import * as io from 'socket.io-client'
import { Subject } from "rxjs";
import IWebsocketService from "../../interfaces/websocket-service.interface";
import PlayerAction from "../../interfaces/player-action";
import { ClientAction } from "../../interfaces/client-action";
import IGameFacade from '../../classes/game-facade/game-facade';
import { MainGameState, UIState } from './main-game';


export default class ClientWebsocketService implements IGameFacade{
  port = 33 
  socket: SocketIOClient.Socket
  isConnected: boolean
  playerId = '999'
  appStateUpdates: Subject<UIState> = new Subject()

  constructor(){
    this.setUpWebsockets()
  }  

  private setUpWebsockets(){    
    this.isConnected = true
    this.socket = io(`localhost:${this.port}`, {transports: ['websocket']}); 
    this.socket.on('disconnect', console.log)
    this.socket.on('App State Update', this.appStateUpdates.next)
    this.socket.on('Game State Update', this.gameStateUpdates.next)
  }

  sendClientAction(clientAction: ClientAction){
    clientAction.playerId = this.playerId
    this.socket.emit('Action From Client', clientAction)
  }

  sendPlayerAction(playerAction: PlayerAction){
    playerAction.playerId = this.playerId
    this.socket.emit('Action From Player', playerAction)
  }

  



}