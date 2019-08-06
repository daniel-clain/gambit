
import {Bet} from './game/bet';
import PlayerNameAndId from './player-name-and-id';
import GameLobby from './game-lobby.interface';
import ChatMessage from './chat-message.interface';
import SkillLevel from '../types/skill-level.type';
import { ManagerAction } from '../classes/game/manager/manager-action';
import { FightReport } from '../classes/game/fight/fight';
import FighterFightStateInfo from './game/fighter-fight-state-info';
import { OptionNames } from '../classes/game/manager/manager-options/manager-option';
import { ActiveContract, Contract } from './game/contract.interface';

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
  preFightNews: string[]
  postFightReport: FightReport
  startCountdown: number
  timeRemaining: number
  fighters: FighterFightStateInfo[]
}
export interface Loan{
  debt: number
  weeksOverdue: number
}

export type EmployeeTypes = 'Lawyer' | 'Heavy' | 'Talent Scout' | 'Private Investigator' | 'Hitman' | 'Promoter' | 'Fitness Trainer' | 'Combat Tactics Trainer'

export interface Employee{
  name: string
  type: EmployeeTypes
  skillLevel: SkillLevel
  actionPoints: number
  options: OptionNames[]
  contract: ActiveContract
}

export interface JobSeeker{
  name: string
  type: EmployeeTypes
  skillLevel: SkillLevel
  options: OptionNames[]
  offeredContract: Contract
}

export interface ManagerInfo{
  name: string
  money: number
  actionPoints: number
  options: OptionNames[]

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
  managerInfo: ManagerInfo
  nextFightBet: Bet
  managersFighters: FighterInfo[]
  knownFighters: FighterInfo[]
  employees: Employee[]
  loan: Loan
  readyForNextFight: boolean
  actions: ManagerAction[]
  retired: boolean
  managerOptionsTimeLeft: number
  jobSeekers: JobSeeker[]
  nextFightFighters: FighterInfo[]
  notifications: string[]
}

