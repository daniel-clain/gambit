import {ActionName } from "../../../types/fighter/action-name";
import FighterModelState from "../../../types/fighter/fighter-model-states";
import { Sound } from "../../../types/fighter/sound";
import { AnimationName } from "../../../types/fighter/animation-name";

export default interface Animation{
  name: AnimationName
  model?: FighterModelState
  sound?: Sound
  duration: number
}