import {ActionName } from "../../../types/figher/action-name";
import FighterModelState from "../../../types/figher/fighter-model-states";
import { Sound } from "../../../types/figher/sound";
import { AnimationName } from "../../../types/figher/animation-name";

export default interface Animation{
  name: AnimationName
  model?: FighterModelState
  sound?: Sound
  duration: number
}