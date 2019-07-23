
import ConnectedClient from './connected-client';
import GameLobbyClient from '../interfaces/game-lobby-client.interface';

export default interface GameLobby{
  id: string
  creator: GameLobbyClient
  clients: GameLobbyClient[]
  gameChat: []
}