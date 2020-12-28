import { ConnectedClient } from '../server/game-host';

export default interface ChatMessage{
  player: ConnectedClient
  message: string
}