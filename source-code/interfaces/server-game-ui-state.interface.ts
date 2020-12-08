import PlayerNameAndId from './player-name-and-id';
import SkillLevel from '../types/game/skill-level.type';
import { ActiveContract, GoalContract } from './game/contract.interface';
import { ManagerInfo } from '../game-components/manager';
import { Profession } from '../types/game/profession';
import { AbilityName, AbilityData } from '../game-components/abilities-reformed/ability';
import RoundStages from '../types/game/round-stage.type';
import { ManagerImage } from '../types/game/manager-image';
import { NewsItem } from '../types/game/news-item';
import { FightUiData } from './game/fight-ui-data';
import { Bet } from './game/bet';
import { PostFightReportItem } from './game/post-fight-report-item';


export interface oldDisplayGameUiData{
  disconnectedPlayerVotes: DisconnectedPlayerVote[]
  roundStage: RoundStages
  displayManagerUiData: DisplayManagerUiData
  preFightNewsUiData: PreFightNewsUiData
  fightUiData: FightUiData
}

export interface ServerGameUIState{
  disconnectedPlayerVotes: DisconnectedPlayerVote[]
  roundStage: RoundStages
  postFightReportData: PostFightReportData
  displayManagerUiData?: DisplayManagerUiData
  playerManagerUiData?: PlayerManagerUiData
  preFightNewsUiData: PreFightNewsUiData
  fightUiData: FightUiData
}

export interface DisconnectedPlayerVote{
  player: PlayerNameAndId
  playerVotesToDrop: {
    drop: boolean,
    disconnectedPlayer: PlayerNameAndId
  }[]
}



export interface PreFightNewsUiData{
  newsItem: NewsItem
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


export interface FighterInfo{
  name: string
  strength: KnownFighterStatValue
  fitness: KnownFighterStatValue
  intelligence: KnownFighterStatValue
  aggression: KnownFighterStatValue
  numberOfFights: KnownFighterStatValue
  numberOfWins: KnownFighterStatValue
  manager: KnownFighterStatValue
  activeContract: ActiveContract
  goalContract: GoalContract
  poisoned
}

export interface PlayerManagerUiData{
  managerInfo: ManagerInfo  
  managerOptionsTimeLeft: number
  jobSeekers: JobSeeker[]
  nextFightFighters: FighterInfo[]
  delayedExecutionAbilities: AbilityData[]
}

