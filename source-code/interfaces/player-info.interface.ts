import {Socket} from 'socket.io';
import Manager from '../game-components/manager';
export interface Player{
  name: string
  id: string
  socket: Socket
  manager?: Manager
}