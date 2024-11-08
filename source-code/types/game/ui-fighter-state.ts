import Fighter from "../../game-components/fighter/fighter"
import {
  FighterInfo,
  FighterStateData,
  ManagersBet,
  ManagerWinnings,
} from "../../interfaces/front-end-state-interface"
import Coords from "../../interfaces/game/fighter/coords"
import { ActionName } from "../fighter/action-name"
import FacingDirection from "../fighter/facing-direction"
import FighterModelState from "../fighter/fighter-model-states"
import { Skin } from "../fighter/skin"
import { Sound } from "../fighter/sound"
export type Result = "draw" | { winner: Fighter }
export type ResultInfo = "draw" | { winner: FighterInfo }

export type FightUIState = {
  startTime: string
  paused: boolean
  fightTimeStep: number
  result: ResultInfo
  fightersSchedule: FighterSchedule[]
  maxFightDuration: number
  lastTimeStep: number
}

export type GameFightUIState = FightUIState & {
  managersWinnings?: ManagerWinnings[]
  knownFighterStateData?: FighterStateData[]
  managersBets: ManagersBet[]
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
}

export type FighterAction = {
  actionName: ActionName
  duration: number
  onResolve?: () => void
  soundMade?: Sound
  modelState?: FighterModelState
}

export type FightQueueAction = Omit<
  FighterAction,
  "duration" | "modelState"
> & {
  sourceFighter: Fighter
  resolveTime: number
}
