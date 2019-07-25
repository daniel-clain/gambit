
import ClientName from '../types/client-name.type';
import ClientId from '../types/client-id.type';
import CreatedGame from './game-lobby.interface';
import PlayerNameAndId from './player-name-and-id';
import GameLobby from './game-lobby.interface';
import ChatMessage from './chat-message.interface';
import Fighter from '../classes/game/fighter/fighter';
export default interface ClientUIState{
  gameHostUiState: GameHostUiState
  gameUiState: GameUiState
}

export interface GameHostUiState{
  connectedPlayers: PlayerNameAndId[],
  gameLobbies: GameLobby[],
  globalChat: ChatMessage[],
}


export interface GameUiState{
  fightUiState: FightUiState,
  managerUiState: ManagerUiState
}

export interface FightUiState{
  startCountdown: null,
  timeRemaining: null,
  fighters: [
    {
      knockedOut: false,
      name: null,
      position: null,
      facingDirection: null,
      action: null
    }
  ]
}

export interface ManagerUiState{
  timeUntilNextFight: number,
  money: number,
  actionPoints: number,
  clientFighters: FighterInfo[],
  fightersInNextFight: FighterInfo[],
  actionLog: string[]
}



export interface FighterInfo{
  name: ClientName,
  numberOfFights: number,
  numberOfWins: number,
  strength: number,
  speed: number
}

