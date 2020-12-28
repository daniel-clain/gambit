import SkillLevel from '../types/game/skill-level.type';
import { ActiveContract, GoalContract } from './game/contract.interface';
import { ManagerInfo } from '../game-components/manager';
import { Profession } from '../types/game/profession';
import { AbilityName, AbilityData } from '../game-components/abilities-reformed/ability';
import RoundStages from '../types/game/round-stage.type';
import { ManagerImage } from '../types/game/manager-image';
import { NewsItem } from '../types/game/news-item';
import { FightUIState } from './game/fight-ui-data';
import { Bet } from './game/bet';
import { PostFightReportItem } from './game/post-fight-report-item';
import { ClientNameAndID } from '../server/game-host.types';


export class ServerGameUIState{
  disconnectedPlayerVotes: DisconnectedPlayerVote[] = []
  roundStage: RoundStages = null
  postFightReportData: PostFightReportData
  displayManagerUIState?: ManagerUIState
  playerManagerUIState?: ManagerUIState
  preFightNewsUIState: PreFightNewsUIState
  FightUIState: FightUIState
}

export interface DisconnectedPlayerVote{
  player: ClientNameAndID
  playerVotesToDrop: {
    drop: boolean,
    disconnectedPlayer: ClientNameAndID
  }[]
}



export interface PreFightNewsUIState{
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

export interface KnownFighterStat{
  lastKnownValue: any,
  roundsSinceUpdated: number
}


export interface FighterInfo{
  name: string
  strength: KnownFighterStat
  fitness: KnownFighterStat
  intelligence: KnownFighterStat
  aggression: KnownFighterStat
  numberOfFights: KnownFighterStat
  numberOfWins: KnownFighterStat
  manager: KnownFighterStat
  activeContract: ActiveContract
  goalContract: GoalContract
}

export interface ManagerUIState{
  managerInfo: ManagerInfo  
  managerOptionsTimeLeft: number
  jobSeekers: JobSeeker[]
  nextFightFighters: FighterInfo[]
  delayedExecutionAbilities: AbilityData[]
}

