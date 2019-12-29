import PlayerNameAndId from './player-name-and-id';
import GameLobby from './game-lobby.interface';
import ChatMessage from './chat-message.interface';
import SkillLevel from '../types/skill-level.type';
import RoundStages from '../types/game/round-stages';
import { FightState } from '../game-components/fight/fight';
import { Contract, ActiveContract } from './game/contract.interface';
import Manager, { ManagerInfo } from '../game-components/manager/manager';
import { AbilityTarget, AbilityTargetType, AbilitySource, AbilitySourceType } from '../game-components/abilities/abilities';

export interface GameHostUiState{
  inGame: boolean
  connectedPlayers: PlayerNameAndId[]
  gameLobbies: GameLobby[]
  globalChat: ChatMessage[]
}
export interface GameUiState{
  roundStage: RoundStages,
  fightState: FightState,
  managerUiState: ManagerUiState
}

export interface Loan{
  debt: number
  weeksOverdue: number
}

export type EmployeeTypes = 'Lawyer' | 'Heavy' | 'Talent Scout' | 'Private Investigator' | 'Hitman' | 'Promoter' | 'Fitness Trainer' | 'Combat Tactics Trainer'


export interface JobSeeker extends AbilityTarget{
  name: string
  type: AbilityTargetType
  profession: EmployeeTypes
  skillLevel: SkillLevel
  goalContract: Contract
}

export class Employee implements AbilitySource{
  actionPoints = 1
  type: AbilitySourceType
  constructor(
    public name: string,
    public profession: EmployeeTypes,
    public skillLevel: SkillLevel,
    public activeContract: ActiveContract,
    public manager: Manager,
  ){}
}

export interface FighterInfo extends AbilityTarget{
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
  numberOfFights: number
  numberOfWins: number
  injured: boolean
  healthRating: number
  doping: boolean
  happyness: number
}

export interface ManagerUiState{
  managerInfo: ManagerInfo  
  managerOptionsTimeLeft: number
  jobSeekers: JobSeeker[]
  nextFightFighters: FighterInfo[]
  notifications: string[]
}

