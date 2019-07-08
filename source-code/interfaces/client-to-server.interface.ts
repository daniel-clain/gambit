import { ClientToServerName } from '../types/clientToServerNames.type';

export interface ClientToServer{
  name: ClientToServerName
  clientId?: string
  gameId?: string
  data?: any
  transactionId?: number
}