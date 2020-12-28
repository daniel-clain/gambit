import { Subject } from "rxjs";
import * as io from 'socket.io-client'
import { ServerGameUIState } from "../../interfaces/server-game-ui-state.interface";
import { FromClientToHost } from "../../server/game-host.types";
import { ServerPreGameUIState } from "../front-end-state/front-end-state";
import { FromClientToGame } from "./front-end-service-types";



export class WebsocketService{

  private port = process.env.WEBSOCKET_PORT
  private websocketAddress = 'localhost'//'192.168.43.229'
  private socket = io(`${this.websocketAddress}:${this.port}`, {transports: ['websocket']});

  onServerGameUIStateUpdate = new Subject<ServerGameUIState>()
  onServerPreGameUIStateUpdate = new Subject<ServerPreGameUIState>()

  private clientToGameFuntions: FromClientToGame = {
    toggleReady: () => this.socket.emit('toggleReady'),
    betOnFighter: bet => this.socket.emit('betOnFighter', bet),
    borrowMoney: amount => this.socket.emit('borrowMoney', amount),
    payBackMoney: amount => this.socket.emit('payBackMoney', amount),
    abilityConfirmed: ability => this.socket.emit('abilityConfirmed', ability),
    toggleDropPlayer: obj => this.socket.emit('toggleDropPlayer', obj)
  }
  
  private clientToHostFuntions: FromClientToHost = {
    create: () => this.socket.emit('create'),
    cancel: gameId => this.socket.emit('cancel', gameId),
    start: gameId => this.socket.emit('start', gameId),
    join: gameId => this.socket.emit('join', gameId),
    readyToStart: gameId => this.socket.emit('readyToStart', gameId),
    leave: gameId => this.socket.emit('leave', gameId),
    reJoin: gameId => this.socket.emit('reJoin', gameId),
    disconnect: reason => this.socket.emit('disconnect', reason),
    submitGlobalChat: message => this.socket.emit('submitGlobalChat', message),
  }


  constructor(){
    this.socket.on(
      'To Client From Server - Lobby Ui',
      this.onServerPreGameUIStateUpdate.next
    )    
    this.socket.on(
      'To Client From Server - Game Ui', 
      this.onServerGameUIStateUpdate.next
    )
  }

  connectToGameHost = () => {
    this.socket.connect()
  }
  sendUpdate = <FromClientToHost & FromClientToGame>{
    ...this.clientToHostFuntions,
    ...this.clientToGameFuntions
  }

  
  

  
}