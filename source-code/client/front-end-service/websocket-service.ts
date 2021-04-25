import { Subject } from "rxjs";
import io from 'socket.io-client'
import { FrontToBackInterface } from "../../interfaces/front-to-back-interface.interface";
import { ServerGameUIState, ServerPreGameUIState } from "../../interfaces/front-end-state-interface";


let socket: SocketIOClient.Socket
//const port = process.env.WEBSOCKET_PORT
//const websocketAddress = 'localhost'//'192.168.43.229'


  
const clientToHostFuntions = {
  connectToHost: ({name, id}) => socket.emit('connectToHost', {name, id}),
  create: () => socket.emit('create'),
  cancel: gameId => socket.emit('cancel', gameId),
  start: gameId => socket.emit('start', gameId),
  join: gameId => socket.emit('join', gameId),
  readyToStart: gameId => socket.emit('readyToStart', gameId),
  leave: gameId => socket.emit('leave', gameId),
  reJoin: gameId => socket.emit('reJoin', gameId),
  disconnect: reason => socket.emit('disconnect', reason),
  submitGlobalChat: message => socket.emit('submitGlobalChat', message),
}

const clientToGameFuntions = {
  toggleReady: () => socket.emit('toggleReady'),
  betOnFighter: bet => socket.emit('betOnFighter', bet),
  borrowMoney: amount => socket.emit('borrowMoney', amount),
  payBackMoney: amount => socket.emit('payBackMoney', amount),
  abilityConfirmed: ability => socket.emit('abilityConfirmed', ability),
  toggleDropPlayer: obj => {
    socket.emit('toggleDropPlayer', obj)
  }
}  


export const websocketService: FrontToBackInterface = {
  onServerPreGameUIStateUpdate: new Subject<ServerPreGameUIState>(),  
  onServerGameUIStateUpdate: new Subject<ServerGameUIState>(),
  init(){
    const env = process.env.NODE_ENV
    console.log(`websocket service node env: ${process.env.NODE_ENV}`)
    if(env == 'development'){
      socket = io('localhost:6969', { transports: ["websocket"]})
    } else {
      socket = io()
    }
    /* 
    console.log(`client socket object initialized for ${websocketAddress}:${port}. connecting....`); */
    socket.connect()
  
    socket.on('To Client From Server - Lobby Ui', 
      (serverPreGameUIState: ServerPreGameUIState) => {
        this.onServerPreGameUIStateUpdate.next(serverPreGameUIState)
      }
    )    
    socket.on('To Client From Server - Game Ui', 
      (serverGameUIState: ServerGameUIState) => {
        this.onServerGameUIStateUpdate.next(serverGameUIState)
      }
    )
  },
  sendUpdate: {...clientToHostFuntions, ...clientToGameFuntions}
}