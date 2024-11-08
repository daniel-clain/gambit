import { VideoName } from "../client/videos/videos"
import {
  AbilityData,
  AbilityName,
} from "../game-components/abilities-general/ability"
import { ManagerInfo } from "../game-components/manager"
import { getProfessionalsAbilities } from "../game-components/professionals"
import { MatchupInfo } from "../game-components/week-controller/final-tournament/final-tournament"
import { ClientNameAndID, GameBeingCreated } from "../game-host/game-host.types"
import { randomNumberDigits } from "../helper-functions/helper-functions"
import { ManagerImage } from "../types/game/manager-image"
import { NewsItem } from "../types/game/news-item"
import { Profession } from "../types/game/profession"
import SkillLevel from "../types/game/skill-level.type"
import { GameFightUIState } from "../types/game/ui-fighter-state"
import { VictoryType } from "../types/game/victory-type"
import { WeekStage } from "../types/game/week-stage.type"
import ChatMessage from "./chat-message.interface"
import { Bet } from "./game/bet"
import { ActiveContract, GoalContract } from "./game/contract.interface"
import { GameInfo } from "./game/game-info"
import { PostFightReportItem } from "./game/post-fight-report-item"

export interface FrontEndState {
  serverUIState: ServerUIState
  clientUIState: ClientUIState
  updateCount: number
}

export class ServerUIState {
  serverGameUIState?: ServerGameUIState
  serverPreGameUIState?: ServerPreGameUIState
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

export class ServerGameUIState {
  disconnectedPlayerVotes: DisconnectedPlayerVote[] | null
  weekStage?: WeekStage
  hasGameDisplay: boolean
  displayManagerUIState?: DisplayManagerUiData
  playerManagerUIState?: ManagerUIState
  preFightNewsUIState: PreFightNewsUIState
  gameFightUIState: GameFightUIState
  selectedVideo?: SelectedVideo
  finalTournamentBoard?: FinalTournamentBoard
  enoughFightersForFinalTournament: boolean
  gameFinishedData?: GameFinishedData
}

export type SelectedVideo = {
  name: VideoName
  index: number
}

export type GameFinishedData = {
  winner: { name: string; victoryType: VictoryType }
  players: {
    name: string
    money: number
    managerImage: ManagerImage
    fighters: FighterInfo[]
  }[]
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

export interface ManagerDisplayInfo {
  name: string
  ready: boolean
  image: ManagerImage
  bet?: Bet
}

export interface DisplayManagerUiData {
  weekStage: WeekStage
  timeLeft: number
  managersDisplayInfo: ManagerDisplayInfo[]
  nextFightFighters: string[]
  jobSeekers: JobSeeker[]
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

export interface KnownFighterStat {
  lastKnownValue: any
  weeksSinceUpdated: number
}

export type StatsObj = {
  [Property in keyof FighterInfo]?: KnownFighterStat
}

export type FighterStatKey =
  | "strength"
  | "fitness"
  | "intelligence"
  | "aggression"
  | "numberOfFights"
  | "numberOfWins"
  | "manager"

export interface FighterInfo {
  name: string
  characterType: "Fighter"
  strength?: KnownFighterStat
  fitness?: KnownFighterStat
  intelligence?: KnownFighterStat
  aggression?: KnownFighterStat
  numberOfFights?: KnownFighterStat
  numberOfWins?: KnownFighterStat
  manager?: KnownFighterStat
  activeContract?: ActiveContract
  goalContract?: GoalContract
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
