import {Socket} from 'socket.io';
import Player from './player';

export default interface ServerPlayer extends Player{
  socket: Socket
}