import {Socket} from 'socket.io';
export interface PlayerInfo{
  name: string
  id: string
  socket: Socket
}