import {Socket} from 'socket.io';
export default interface Player{
  name: string
  connected: boolean
  clientId: string
  gameId: string
}