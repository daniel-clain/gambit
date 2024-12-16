import {
  ClientNameAndID,
  GameBeingCreated,
} from "../backend/game-host/game-host.types"
import {
  AbilityData,
  AbilityName,
} from "../game-components/abilities-general/ability"
import { ManagerInfo } from "../game-components/manager"
import { getProfessionalsAbilities } from "../game-components/professionals"
import { MatchupInfo } from "../game-components/week-controller/final-tournament/final-tournament"
import { randomNumberDigits } from "../helper-functions/helper-functions"
import { ManagerImage } from "../types/game/manager-image"
import { NewsItem } from "../types/game/news-item"
import { Profession } from "../types/game/profession"
import SkillLevel from "../types/game/skill-level.type"
import { FightDayState, FightUiState } from "../types/game/ui-fighter-state"
import { PlayerInfo, Winner } from "../types/game/victory-and-loss"
import { VictoryType } from "../types/game/victory-type"
import { VideoName } from "../types/game/video-names"
import { WeekStage } from "../types/game/week-stage.type"
import ChatMessage from "./chat-message.interface"
import { Bet } from "./game/bet"
import { ActiveContract, GoalContract } from "./game/contract.interface"
import { GameInfo } from "./game/game-info"
import { PostFightReportItem } from "./game/post-fight-report-item"

export interface FrontEndState {
  serverUIState: ServerUIState
  clientUIState: ClientUIState
}

export class ServerUIState {
  serverGameUIState?: ServerGameUIState
  serverPreGameUIState?: ServerPreGameUIState
}

export class ServerGameUIState {
  disconnectedPlayerVotes: DisconnectedPlayerVote[] | null
  weekStage?: WeekStage
  hasGameDisplay: boolean
  displayManagerUiData?: DisplayManagerUiData
  playerManagerUIState?: ManagerUIState
  preFightNewsUIState: PreFightNewsUIState
  fightDayState?: FightDayState
  finalTournamentState?: TournamentState
  selectedVideo?: SelectedVideo
  enoughFightersForFinalTournament: boolean
  gameFinishedData?: GameFinishedData
}
export interface ServerPreGameUIState {
  connectedClients: ClientNameAndID[]
  gamesBeingCreated: GameBeingCreated[]
  globalChat: ChatMessage[]
  activeGames: GameInfo[]
  testConnection: number
}

export interface ClientGameUIState {
  clientManagerUIState: ClientManagerUIState
}

export interface ClientPreGameUIState {
  clientName?: string
  clientId?: string
  hasGameData?: boolean
}

export interface ClientUIState {
  gameAssetsLoaded: boolean
  isConnectedToGameHost: boolean
  isConnectedToWebsocketServer: boolean
  clientGameUIState: ClientGameUIState
  clientPreGameUIState: ClientPreGameUIState
}

export type AllManagerUIState = ClientManagerUIState & ManagerUIState

export type CardName =
  | "Loan Shark"
  | "Known Fighters"
  | "Known Managers"
  | "Ability"
  | "Fighter"
  | "Employee"
  | "Job Seeker"
  | "Manager"
  | "Manager Report"
  | "Win Options"
  | "Game Explanation"

export type Modal = {
  name: CardName
  data?: unknown
}

export class ClientManagerUIState {
  activeModal?: Modal
  selectListActive?: boolean
}

export type VictoryData = { name: string; victoryType: VictoryType }

export type TournamentState = {
  finalTournamentBoard: FinalTournamentBoard
  fightUiState?: FightUiState
}

export type SelectedVideo = {
  sourceManager: ManagerInfo
  name: VideoName
  index: number
}

export type GameFinishedData = {
  winner: Winner
  players: PlayerInfo[]
}

export class FinalTournamentBoard {
  showTournamentBoard: boolean
  finals: MatchupInfo
  semiFinals: MatchupInfo[]
  quarterFinals: MatchupInfo[]
}
/**
 * @prop startTime ISO date string
 */

export type ManagerWinnings = {
  managerName: string
  winnings: number
}
export interface ManagersBet {
  name: string
  bet?: Bet
  image: string
}
export interface FighterStateData {
  name: string
  sick: boolean
  hallucinating: boolean
  injured: boolean
  doping: boolean
  takingADive: boolean
  strength?: KnownFighterStat
  intelligence?: KnownFighterStat
  fitness?: KnownFighterStat
  aggression?: KnownFighterStat
  numberOfFights?: KnownFighterStat
  numberOfWins?: KnownFighterStat
}

export interface DisconnectedPlayerVote {
  disconnectedPlayer: ClientNameAndID
  playerVotesToDrop: PlayerVoteToDrop[]
}

export interface PlayerVoteToDrop {
  drop: boolean
  votingPlayer: ClientNameAndID
}

export interface PreFightNewsUIState {
  newsItem: NewsItem
}

export interface PostFightReportData {
  notifications: PostFightReportItem[]
}

export interface Loan {
  debt: number
  weeksOverdue: number
  amountPaidBackThisWeek: number
  isNew: boolean
}

export class Professional {
  abilities: AbilityName[]

  constructor(
    public profession: Profession,
    public skillLevel: SkillLevel = 1,
    public name: string = `test${randomNumberDigits(9)}`
  ) {
    this.abilities = getProfessionalsAbilities(profession)
  }
}

export interface JobSeeker {
  name: string
  characterType: "Job Seeker"
  type: "Fighter" | "Professional"
  profession?: Profession
  skillLevel?: SkillLevel
  abilities?: AbilityName[]
  goalContract?: GoalContract
}

export class Employee extends Professional {
  actionPoints: number = 1
  characterType: "Employee"
  constructor(
    public profession: Profession,
    public skillLevel: SkillLevel = 3,
    public name: string = `test${randomNumberDigits(9)}`,
    public activeContract: ActiveContract = {
      weeklyCost: 0,
      weeksRemaining: 100,
    }
  ) {
    super(profession, skillLevel, name)
  }
}

export type KnownFighterStat = {
  lastKnownValue: string | number | null
  weeksSinceUpdated: number
}

export type StatName =
  | "strength"
  | "fitness"
  | "intelligence"
  | "aggression"
  | "numberOfFights"
  | "numberOfWins"
  | "manager"
  | "publicityRating"

export type KnownFighterInfo = Omit<FighterInfo, "stats"> & {
  stats: Partial<Record<StatName, KnownFighterStat>>
}

export type FighterStatsInfo = Record<Exclude<StatName, "manager">, number> & {
  manager: string | null
}

export type FighterInfo = {
  name: string
  characterType: "Fighter"
  activeContract?: ActiveContract
  goalContract?: GoalContract
  stats: FighterStatsInfo
}

export interface ManagerUIState {
  managerInfo: ManagerInfo
  managerOptionsTimeLeft?: number
  jobSeekers: JobSeeker[]
  nextFightFighters: string[]
  delayedExecutionAbilities: AbilityData[]
  week: number
  otherPlayersReady: {
    name: string
    ready: boolean
  }[]
  thisManagerReady: boolean
}

export interface DisplayManagerUiData {
  timeLeft: number
  managersDisplayInfo: ManagerDisplayInfo[]
  nextFightFighters: string[]
  jobSeekers: JobSeeker[]
}
export interface ManagerDisplayInfo {
  name: string
  ready: boolean
  image: ManagerImage
}
