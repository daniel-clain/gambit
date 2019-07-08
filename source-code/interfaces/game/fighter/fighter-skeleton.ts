
import Position from "./position";
import { FighterModelState } from "../../../types/figher/fighter-model-states";
import FacingDirection from "../../../types/figher/facing-direction";

export default interface FighterSkeleton{
  name: string
  position: Position
  modelState: FighterModelState
  facingDirection: FacingDirection
}