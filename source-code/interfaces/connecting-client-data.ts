
import ClientName from '../types/client-name.type';
import { Socket } from 'socket.io';
import ClientId from '../types/client-id.type';

export default interface ConnectingClientData{
  socket: Socket
  id: ClientId
  name: ClientName
}
