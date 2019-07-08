import { ServerToClientName } from '../types/serverToClientName.type';

export interface ServerToClient{

  name: ServerToClientName
  data?: any
  transactionId?: number
}