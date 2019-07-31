import {Bet} from './game/bet';

import ClientName from '../types/client-name.type';
import ClientId from '../types/client-id.type';
import CreatedGame from './game-lobby.interface';
import PlayerNameAndId from './player-name-and-id';
import GameLobby from './game-lobby.interface';
import ChatMessage from './chat-message.interface';
import Fighter from '../classes/game/fighter/fighter';
import SkillLevel from '../types/skill-level.type';
import { IManagerAction } from '../classes/game/manager/manager-action';

export interface GameHostUiState{
  inGame: boolean
  connectedPlayers: PlayerNameAndId[]
  gameLobbies: GameLobby[]
  globalChat: ChatMessage[]
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

export interface LoanSharkData{
  debt: number
  weeksOverdue: number
}


export type EmployeeTypes = 'Lawyer' | 'Heavy' | 'Talent Scout' | 'Private Investigator' | 'Hitman' | 'Promoter' | 'Fitness Trainer' | 'Combat Tactics Trainer'
export interface Employee{
  name: string
  type: EmployeeTypes
  skillLevel: SkillLevel
  actionPoints: number
  contract: {
    costPerWeek: number
    weeksRemaining: number
  }
}

export interface JobSeeker{
  name: string
  type: string
  skillRating: number
  offeredTerms: {
    weeks: number
    costPerWeek: number
  }
}
export interface FighterInfo{
  lastUpdated: number
  name: string
  inNextFight?: boolean
  isPlayersFighter?: boolean
  strength: number
  speed: number
  intelligence: number
  aggression: number
  manager: string
  publicityRating: number
  endurance: number
  numberOfFights: number
  numberOfWins: number
  injured: boolean
  healthRating: number
  doping: boolean
  happyness: number
}

export interface ManagerUiState{
  money: number
  actionPoints: number
  timeUntilNextFight: number
  nextFightBet: Bet
  nextFightFighters: FighterInfo[]
  knownFighters: FighterInfo[]
  yourEmployees: Employee[]
  jobSeekers: JobSeeker[]
  loanSharkData: LoanSharkData
  ready: boolean
  actions: IManagerAction[]
}

