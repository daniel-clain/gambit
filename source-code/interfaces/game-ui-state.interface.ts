import PlayerNameAndId from './player-name-and-id';
import GameLobby from './game-lobby.interface';
import ChatMessage from './chat-message.interface';
import SkillLevel from '../types/skill-level.type';
import RoundStages from '../types/game/round-stages';
import { FightState } from '../game-components/fight/fight';
import { Contract, ActiveContract } from './game/contract.interface';
import { ManagerInfo } from '../game-components/manager/manager';
import { Profession } from '../types/game/profession';
import { AbilityName, AbilityData } from '../game-components/abilities-reformed/ability';

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


export interface Professional{
  name: string
  profession: Profession
  skillLevel: SkillLevel
  abilities: AbilityName[]
}

export interface JobSeeker{
  name: string
  type: 'Fighter' | 'Professional'
  profession?: Profession
  skillLevel?: SkillLevel
  abilities?: AbilityName[]
  goalContract: Contract  

}

export interface Employee extends Professional{
  actionPoints: number
  activeContract: ActiveContract
}

export interface KnownFighterStatValue{
  lastKnownValue: any,
  roundsSinceUpdated: number
}

export interface KnownFighterStats{

  strength: KnownFighterStatValue
  fitness: KnownFighterStatValue
  intelligence: KnownFighterStatValue
  aggression: KnownFighterStatValue
  numberOfFights: KnownFighterStatValue
  numberOfWins: KnownFighterStatValue
  manager: KnownFighterStatValue
}



export interface KnownFighter{
  name: string
  knownStats: KnownFighterStats
}

export interface FighterInfo{
  name: string
  strength: number
  fitness: number
  intelligence: number
  aggression: number
  numberOfFights: number
  numberOfWins: number
  manager: string
  activeContract: ActiveContract
}

export interface ManagerUiState{
  managerInfo: ManagerInfo  
  managerOptionsTimeLeft: number
  jobSeekers: JobSeeker[]
  nextFightFighters: string[]
  delayedExecutionAbilities: AbilityData[]
}

