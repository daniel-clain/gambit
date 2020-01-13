import {ActionName } from "../../../types/figher/action-name";
import FighterModelState from "../../../types/figher/fighter-model-states";
import { Sound } from "../../../types/figher/sound";

export default interface Action{
  name: ActionName
  model?: FighterModelState
  sound?: Sound
  effect?: () => void
  getDuration: () => number
  cooldown?: number
  afterEffect?: () => any
}