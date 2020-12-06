
import GameLobbyClient from './game-candidate-client.interface';
import ChatMessage from './chat-message.interface';

export default interface GameCandidate{
  id: string
  creator: GameLobbyClient
  clients: GameLobbyClient[]
  gameChat: ChatMessage[]
}