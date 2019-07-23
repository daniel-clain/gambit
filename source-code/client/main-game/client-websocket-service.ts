import * as io from 'socket.io-client'
import { Subject } from "rxjs";
import IWebsocketService from "../../interfaces/websocket-service.interface";
import PlayerAction from "../../interfaces/player-action";
import { ClientAction } from "../../interfaces/client-action";
import ClientUIState from '../../interfaces/client-ui-state.interface';


export default class ClientWebsocketService {
  port = 33 
  socket: SocketIOClient.Socket
  isConnected: boolean
  cientUIStateUpdate: Subject<ClientUIState> = new Subject()

  constructor(){
    this.setUpWebsockets()
  }  

  private setUpWebsockets(){    
    this.isConnected = true
    this.socket = io(`localhost:${this.port}`, {transports: ['websocket']}); 
    this.socket.on('disconnect', console.log)
    this.socket.on('UI State Update', (clientUIState: ClientUIState) => this.cientUIStateUpdate.next(clientUIState))
    //this.socket.on('Game State Update', this.gameStateUpdates.next)
  }

  sendClientAction(clientAction: ClientAction){
    this.socket.emit('Action From Client', clientAction)
  }

  sendPlayerAction(playerAction: PlayerAction){

    this.socket.emit('Action From Player', playerAction)
  }

  



}