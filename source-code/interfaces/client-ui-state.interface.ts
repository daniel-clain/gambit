
import ClientName from '../types/client-name.type';
import ClientId from '../types/client-id.type';
import CreatedGame from '../server/game-lobby';
import PlayerNameAndId from './player-name-and-id';
import GameLobby from '../server/game-lobby';
import ChatMessage from './chat-message.interface';
export default interface ClientUIState{
  gameHost: GameHostState
  game: GameState
}

export interface GameHostState{
  connectedPlayers: PlayerNameAndId[],
  gameLobbies: GameLobby[],
  globalChat: ChatMessage[],
}

export interface GameStateGeneral{
  players: PlayerNameAndId[],
  gameChat: ChatMessage[],
  fightActive: boolean,
  timeTillNextFight: number,
}

export interface GameState{
  players: PlayerNameAndId[],
  gameChat: ChatMessage[],
  fightActive: boolean,
  timeTillNextFight: number,
  fightEvent: FightEventState,
  managerOptions: ManagerOptionsState
}

export interface FightEventState{
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

export interface ManagerOptionsState{
  money: null,
  actionPoints: null,
  clientFighters: [],
  fightersInNextFight: FighterInfo[],
  activeBet: {
    fighterName: null,
    betAmount: null,
  },
  actionLog: []
}

export interface FighterInfo{
  name: ClientName,
  numberOfFights: number,
  numberOfWins: number,
  strength: number,
  speed: number
}

