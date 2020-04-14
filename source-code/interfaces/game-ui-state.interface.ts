import PlayerNameAndId from './player-name-and-id';
import GameLobby from './game-lobby.interface';
import ChatMessage from './chat-message.interface';
import SkillLevel from '../types/game/skill-level.type';
import { ActiveContract, GoalContract } from './game/contract.interface';
import { ManagerInfo } from '../game-components/manager';
import { Profession } from '../types/game/profession';
import { AbilityName, AbilityData } from '../game-components/abilities-reformed/ability';
import RoundStages from '../types/game/round-stages';
import { ManagerImage } from '../types/game/manager-image';
import { NewsItem } from '../types/game/news-item';
import FighterFightState from './game/fighter-fight-state-info';
import { FightUiData } from './game/fight-ui-data';
import { Bet } from './game/bet';
import { PostFightReportItem } from './game/post-fight-report-item';

export interface MainGameData{
  inGame: boolean
  connectedPlayers: PlayerNameAndId[]
  gameLobbies: GameLobby[]
  globalChat: ChatMessage[]
}

export interface DisplayGameUiData{
  roundStage: RoundStages
  displayManagerUiData: DisplayManagerUiData
  preFightNewsUiData: PreFightNewsUiData
  fightUiData: FightUiData
}

export interface PlayerGameUiData{
  roundStage: RoundStages
  postFightReportData: PostFightReportData
  playerManagerUiData: PlayerManagerUiData
  preFightNewsUiData: PreFightNewsUiData
  fightUiData: FightUiData
}



export interface PreFightNewsUiData{
  newsItems: NewsItem[]
}

export interface PostFightReportData{
  notifications: PostFightReportItem[]
}

export interface ManagerDisplayInfo{
  name: string
  ready: boolean
  image: ManagerImage
  bet: Bet
}

export interface DisplayManagerUiData{  
  roundStage: RoundStages,
  timeLeft: number
  managersDisplayInfo: ManagerDisplayInfo[]
  nextFightFighters: string[]
  jobSeekers: JobSeekerInfo[]
}


export interface Loan{
  debt: number
  weeksOverdue: number
  amountPaidBackThisWeek: number
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
  goalContract: GoalContract  

}

export interface JobSeekerInfo{
  name: string, 
  type: Profession | 'Fighter'
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
  goalContract: GoalContract
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
  goalContract: GoalContract
}

export interface PlayerManagerUiData{
  managerInfo: ManagerInfo  
  managerOptionsTimeLeft: number
  jobSeekers: JobSeeker[]
  nextFightFighters: string[]
  delayedExecutionAbilities: AbilityData[]
}

