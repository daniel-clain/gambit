
import * as io from 'socket.io-client'
import { Subject } from "rxjs";
import IWebsocketService from "../../interfaces/websocket-service.interface";
import PlayerAction from "../../interfaces/player-action";
import { ClientAction } from "../../interfaces/client-action";
import { PreGameUIState } from "./pre-game";
import { GameUIProps } from '../components/game-ui';
import IGameFacade from '../../classes/game-facade/game-facade';


export default class ClientWebsocketService implements IGameFacade{
  port = 33 
  socket: SocketIOClient.Socket
  isConnected: boolean
  playerId = '999'
  preGameStateUpdates: Subject<PreGameUIState> = new Subject()
  gameStateUpdates: Subject<GameUIProps> = new Subject()

  constructor(){
    this.setUpWebsockets()
  }  

  private setUpWebsockets(){    
    this.isConnected = true
    this.socket = io(`localhost:${this.port}`, {transports: ['websocket']}); 
    this.socket.on('disconnect', console.log)
    this.socket.on('PreGame State Update', this.preGameStateUpdates.next)
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