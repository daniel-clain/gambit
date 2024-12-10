import Fighter from "../../game-components/fighter/fighter"
import {
  FighterInfo,
  FighterStateData,
  ManagersBet,
  ManagerWinnings,
} from "../../interfaces/front-end-state-interface"
import Coords from "../../interfaces/game/fighter/coords"
import { ActionName, AfflictionActions } from "../fighter/action-name"
import FacingDirection from "../fighter/facing-direction"
import FighterModelState from "../fighter/fighter-model-states"
import { Skin } from "../fighter/skin"
import { Sound } from "../fighter/sound"
import { Angle } from "./angle"
export type Result = "draw" | { winner: Fighter }
export type ResultInfo = "draw" | { winner: FighterInfo }

export type FightUiState = {
  startTime: string
  paused: boolean
  fightTimeStep: number
  result: ResultInfo
  fightersSchedule: FighterSchedule[]
  commentarySchedule: CommentarySchedule[]
  maxFightDuration: number
  lastTimeStep: number
}

export type CommentarySchedule = { commentary: string; startTimeStep: number }

export type FightDayState = {
  managersWinnings?: ManagerWinnings[]
  knownFighterStateData?: FighterStateData[]
  managersBets: ManagersBet[]
  fightUiState: FightUiState
}

export type FighterSchedule = {
  fighterName: string
  fighterTimeStamps: FighterUiTimeStamp[]
}
/**
 * @prop miliseconds
 */
export type FighterUiTimeStamp = {
  startTimeStep: number
  actionName: ActionName
  uiFighterState: FighterUiState
  soundMade?: Sound
}

export type FighterUiState = {
  coords: Coords
  modelState: FighterModelState
  onARampage: boolean
  energyState: "high" | "low" | undefined
  skin: Skin
  spirit: number
  facingDirection: FacingDirection
  affliction: AfflictionActions | undefined
  debuggingState: {
    energy: number
    maxEnergy: number
    stamina: number
    maxStamina: number
    movingDirection: Angle
    flanked: boolean
  }
}

export type FighterAction = {
  actionName: ActionName
  duration: number
  onResolve?: () => void
  soundMade?: Sound
  modelState?: FighterModelState
  commentary?: string
}

export type FightQueueAction = Omit<
  FighterAction,
  "duration" | "modelState"
> & {
  sourceFighter: Fighter
  resolveTime: number
}
