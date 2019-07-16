import GameFacade from "./game-facade";
import * as io from 'socket.io-client'
import SocketIOClient from 'socket.io-client'
import { ClientUIState } from "./client";
import ActionFromClient from "../interfaces/player-action";
import { Subject } from "rxjs";
import IWebsocketService from "../interfaces/websocket-service.interface";
import PlayerAction from "../interfaces/player-action";
import { ClientAction } from "../interfaces/client-action";


export default class ClientWebsocketService implements IWebsocketService{
  port = 33 
  socket: SocketIOClient.Socket
  isConnected: boolean
  playerId = '999'

  uIStateUpdateSubject: Subject<ClientUIState> = new Subject()

  constructor(){
    this.setUpWebsockets()
  }  

  private setUpWebsockets(){    
    this.socket = io(`localhost:${this.port}`, {transports: ['websocket']}); 
    this.socket.on('connect', () => this.isConnected = true)
    this.socket.on('UI State Update', uIStateUpdate => this.uIStateUpdateSubject.next(uIStateUpdate))
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