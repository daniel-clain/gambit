
import * as io from 'socket.io-client'
import ClientAction from '../../../interfaces/client-action';


export interface BackEndConnection{
  onUpdateReceived(func): void
  sendUpdate<T extends ClientAction>(update: T): void
  sendMessage
}

const port = process.env.WEBSOCKET_PORT
const websocketAddress = 'localhost'//'192.168.43.229'
const socket = io(`${websocketAddress}:${port}`, {transports: ['websocket']});

export const backEndConnection: BackEndConnection = {
  sendUpdate: (update) => (
    socket.emit('To Server From Client', update)
  ),
  onUpdateReceived: (func: (name: string, data: any) => void) => {
    socket.on('To Client From Server - Lobby Ui', data => {
      func('To Client From Server - Lobby Ui', data)
    })
    socket.on('To Client From Server - Game Ui', data => {
      func('To Client From Server - Game Ui', data)
    })
  },
  sendMessage: (key, data?) => {
    socket.emit(key, data)
  }
}