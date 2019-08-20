import {AbilityNames, AbilitySource, AbilityTarget, AbilityTargetType, AbilitySourceType} from './../classes/game/abilities/abilities';

import {Bet} from './game/bet';
import PlayerNameAndId from './player-name-and-id';
import GameLobby from './game-lobby.interface';
import ChatMessage from './chat-message.interface';
import SkillLevel from '../types/skill-level.type';
import { FightReport } from '../classes/game/fight/fight';
import FighterFightStateInfo from './game/fighter-fight-state-info';
import { ActiveContract, Contract } from './game/contract.interface';
import Manager, { ManagerInfo } from '../classes/game/manager/manager';

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
  managerOptionsTimeLeft: number
  jobSeekers: JobSeeker[]
  nextFightFighters: FighterInfo[]
  notifications: string[]
}

