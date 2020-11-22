import {Socket} from 'socket.io';
import Manager from '../game-components/manager';
export interface Player{
  name: string
  id: string
  socketObj: Socket
  gameDisplayId?: string
  manager?: Manager
}