
import GameLobbyClient from './game-lobby-client.interface';
import ChatMessage from './chat-message.interface';

export default interface GameLobby{
  id: string
  creator: GameLobbyClient
  clients: GameLobbyClient[]
  gameChat: ChatMessage[]
}