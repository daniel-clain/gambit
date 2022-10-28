import { Subject } from "rxjs";
import io from 'socket.io-client'
import { FrontToBackInterface } from "../../interfaces/front-to-back-interface.interface";
import { ServerGameUIState, ServerPreGameUIState } from "../../interfaces/front-end-state-interface";
import { runInAction } from "mobx";
import { frontEndState } from "../front-end-state/front-end-state";
import { connectToGameHost, resetClient } from "./front-end-service";


let socket: SocketIOClient.Socket
  
const clientToHostFunctions = {
  connectToHost: ({name, id}) => {
    console.log('connect fired');
    socket.emit('connectToHost', {name, id})
  },
  create: () => socket.emit('create'),
  testConnection: () => socket.emit('testConnection'),
  cancel: gameId => socket.emit('cancel', gameId),
  start: gameId => socket.emit('start', gameId),
  join: gameId => socket.emit('join', gameId),
  readyToStart: gameId => socket.emit('readyToStart', gameId),
  leave: gameId => socket.emit('leave', gameId),
  reJoin: gameId => socket.emit('reJoin', gameId),
  submitGlobalChat: message => socket.emit('submitGlobalChat', message),
  reset: ({name, id}) => {
    socket.emit('reset', {name, id})
  }
}

const clientToGameFunctions = {
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
  init(){
    const env = process.env.NODE_ENV
    console.log(`websocket service node env: ${process.env.NODE_ENV}`)

    
    if(env == 'development'){
      socket = io('http://localhost:6969', { transports: ["websocket"], secure: true, reconnection: true, rejectUnauthorized: false})

      
      
      socket.on('error', x => {
        console.log('error :>> ', x);
      })
      socket.on('reconnect', x => {
        console.log('reconnect :>> ', x);
      })
      socket.on('reconnect_error', x => {
        console.log('reconnect_error :>> ', x);
      })
      socket.on('reconnect_failed', x => {
        console.log('reconnect_failed :>> ', x);
      })
    } else {
      try{
      socket = io({secure: true, reconnection: true, rejectUnauthorized: false})
      }catch(e){
        console.log(e);
      }
    }
    
    try{
      socket.connect()
      
      socket.on('connect', x => {
        console.log('connect event :>> ', x);
        
        runInAction(() => {
          frontEndState.clientUIState.isConnectedToWebsocketServer = true
        })
        const {clientName} = frontEndState.clientUIState.clientPreGameUIState
        if(clientName){
          connectToGameHost()
        }
      })
      
      socket.on('disconnect', x => {
        console.log('disconnect :>> ', x);
        runInAction(() => {
          frontEndState.clientUIState.isConnectedToWebsocketServer = false
        })
      })
      
    } catch(e){
      console.log('e :>> ', e);
    }
  
    socket.on('To Client From Server - Lobby Ui', 
      (serverPreGameUIState: ServerPreGameUIState) => {
        runInAction(() => {
          frontEndState.serverUIState.serverPreGameUIState = serverPreGameUIState
          if(!frontEndState.clientUIState.isConnectedToGameHost){
            frontEndState.clientUIState.isConnectedToGameHost = true
          }
        })
      }
    )    
    socket.on('To Client From Server - Game Ui', 
      (serverGameUIState: ServerGameUIState) => {
        runInAction(() => {
          frontEndState.serverUIState.serverGameUIState = serverGameUIState
          frontEndState.clientUIState.clientPreGameUIState.hasGameData = true
        })
      }
    )
  },
  sendUpdate: {...clientToHostFunctions, ...clientToGameFunctions}
}