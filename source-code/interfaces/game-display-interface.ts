import {Socket} from 'socket.io';

export interface GameDisplay{
  name: string
  id: string
  socket: Socket
}