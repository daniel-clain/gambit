import { AbilityName, AbilityData } from "../game-components/abilities-general/ability"
import { ManagerInfo } from "../game-components/manager"
import { getProfessionalsAbilities } from "../game-components/professionals"
import { random } from "../helper-functions/helper-functions"
import { ClientNameAndID, GameBeingCreated } from "../game-host/game-host.types"
import { Angle } from "../types/game/angle"
import { ManagerImage } from "../types/game/manager-image"
import { NewsItem } from "../types/game/news-item"
import { Profession } from "../types/game/profession"
import { RoundStage } from "../types/game/round-stage.type"
import SkillLevel from "../types/game/skill-level.type"
import ChatMessage from "./chat-message.interface"
import { Bet } from "./game/bet"
import { GoalContract, ActiveContract } from "./game/contract.interface"
import Coords from "./game/fighter/coords"
import SoundTime from "./game/fighter/sound-time"
import { GameInfo } from "./game/game-info"
import { PostFightReportItem } from "./game/post-fight-report-item"
import FacingDirection from "../types/fighter/facing-direction"
import FighterModelState from "../types/fighter/fighter-model-states"
import { Skin } from "../types/fighter/skin"
import { VictoryType } from "../types/game/victory-type"
import { VideoName } from "../client/videos/videos"
import { MatchupInfo } from "../game-components/round-controller/final-tournament/final-tournament"
import Fight from "../game-components/abilities-general/fight/fight"

export interface FrontEndState {
  serverUIState: ServerUIState
  clientUIState: ClientUIState
}

export class ServerUIState{
  serverGameUIState: ServerGameUIState
  serverPreGameUIState: ServerPreGameUIState
}

export interface ServerPreGameUIState{
  connectedClients: ClientNameAndID[]
  gamesBeingCreated: GameBeingCreated[]
  globalChat: ChatMessage[]
  activeGames: GameInfo[]
  testConnection: number
}

export interface ClientGameUIState{
  clientManagerUIState: ClientManagerUIState
}

export interface ClientPreGameUIState {
  clientName: string
  clientId: string
}


export interface ClientUIState{
  clientGameUIState: ClientGameUIState
  clientPreGameUIState: ClientPreGameUIState
}

export type AllManagerUIState = ClientManagerUIState & ManagerUIState


export type CardName = 'Loan Shark' | 'Known Fighters' | 'Known Managers' | 'Ability' | 'Fighter' | 'Employee' | 'Job Seeker' | 'Manager' | 'Manager Report' | 'Win Options'



export class ActiveModal{
  name: CardName
  data?: any
}
export class ClientManagerUIState{
  activeModal: ActiveModal
  selectListActive: boolean
}

export type VictoryData = {name: string, victoryType: VictoryType}

export class ServerGameUIState{
  disconnectedPlayerVotes: DisconnectedPlayerVote[] = []
  roundStage: RoundStage = null
  displayManagerUIState?: DisplayManagerUiData
  playerManagerUIState?: ManagerUIState
  preFightNewsUIState: PreFightNewsUIState
  fightUIState: FightUIState
  selectedVideo: SelectedVideo
  finalTournamentBoard: FinalTournamentBoard
  enoughFightersForFinalTournament: boolean
  gameFinishedData: GameFinishedData
}

export type SelectedVideo = {
  name: VideoName
  index: number
}

export type GameFinishedData = {
  winner: {name: string, victoryType: VictoryType, image}
  players: {name: string, money: number}[]
}

export class FinalTournamentBoard{
  showTournamentBoard: boolean
  finals: MatchupInfo
  semiFinals: MatchupInfo[]
  quarterFinals: MatchupInfo[]
}


export interface FightUIState{
  startCountdown: number
  timeRemaining: number
  report: FightReport
  managersBets?: ManagersBet[]
  fighterFightStates: FighterFightState[]
  knownFighterStates?: FighterStateData[]
}
export interface FightReport{
  draw?: boolean
  winner?: FighterInfo
  managerWinnings?: ManagerWinnings[]
}
export type ManagerWinnings = {
  managerName: string
  winnings: number
}
export interface ManagersBet{
  name: string
  bet: Bet
  image: string
}
export interface FighterStateData{  
  name: string
  sick: boolean
  hallucinating: boolean
  injured: boolean
  doping: boolean
  strength: KnownFighterStat
  intelligence: KnownFighterStat
  fitness: KnownFighterStat
  aggression: KnownFighterStat
  numberOfFights: KnownFighterStat
  numberOfWins: KnownFighterStat
}

export default interface FighterFightState{
  name: string
  coords: Coords
  facingDirection: FacingDirection
  modelState: FighterModelState
  soundsMade: SoundTime[]
  onRampage: boolean,
  skin: Skin,
  retreatingFromFlanked: boolean
  strikingCenters: {front: Coords, back: Coords}
  spirit: number
  repositioning: boolean,
  direction: Angle
  trapped: boolean
}
export interface DisconnectedPlayerVote{
  disconnectedPlayer: ClientNameAndID
  playerVotesToDrop: PlayerVoteToDrop[]
}

export interface PlayerVoteToDrop {
  drop: boolean,
  votingPlayer: ClientNameAndID
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
  roundStage: RoundStage,
  timeLeft: number
  managersDisplayInfo: ManagerDisplayInfo[]
  nextFightFighters: string[]
  jobSeekers: JobSeeker[]
}


export interface Loan{
  debt: number
  weeksOverdue: number
  amountPaidBackThisWeek: number
  isNew: boolean
}


export class Professional{
  abilities: AbilityName[]

  constructor(
    public profession: Profession,
    public skillLevel: SkillLevel = 1,
    public name: string = `test${random(10000)}`
  ){
    this.abilities = getProfessionalsAbilities(profession)
  }
}

export interface JobSeeker{
  name: string
  type: 'Fighter' | 'Professional'
  profession?: Profession
  skillLevel?: SkillLevel
  abilities?: AbilityName[]
  goalContract?: GoalContract 
}


export class Employee extends Professional{
  actionPoints: number = 1
  constructor(
    public profession: Profession,
    public skillLevel: SkillLevel = 3,
    public name: string = `test${random(10000)}`,
    public activeContract: ActiveContract = {
      weeklyCost: 0, weeksRemaining: 100
    }
  ){
    super(profession, skillLevel, name)
  }
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
  nextFightFighters: string[]
  delayedExecutionAbilities: AbilityData[]
  round: number
}




