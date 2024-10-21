import Fighter from "../../game-components/fighter/fighter"
import Coords from "../../interfaces/game/fighter/coords"
import SoundTime from "../../interfaces/game/fighter/sound-time"
import { InterruptibleActionName } from "../fighter/action-name"
import FighterModelState from "../fighter/fighter-model-states"
import { Skin } from "../fighter/skin"

export type FightObject = {
  startTime: Date
  fighterTimeStamps: FighterTimeStamps[]
  paused: boolean
}

export type FighterTimeStamps = {
  time: Date
  fightersData: FightersData
}

type FightersData = {
  name: string
  coords: Coords
  modelState: FighterModelState
  soundsMade: SoundTime[]
  onRampage: boolean
  skin: Skin
  spirit: number
}

type GenericEffect = {
  sourceFighterName: string
  targetFighterName: string
  effectName: string
}

export type DecidedAction = {
  actionName: InterruptibleActionName
  sourceFighterName: string
  targetFighterName?: string
  duration: number
  effectOnComplete: (sourceFighter: Fighter, targetFighter?: Fighter) => void
}

export type FighterDelayedEffect = {
  sourceFighterName: string
  targetFighterName: string
  resolveTime: number
  actionName: string
  onResolve: <E extends GenericEffect>(e: E) => void
}
