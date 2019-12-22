import Position from './fighter/position';
import FacingDirection from '../../types/figher/facing-direction';
import FighterModelState from '../../types/figher/fighter-model-states';

export default interface FighterFightStateInfo{
  name: string
  position: Position
  facingDirection: FacingDirection
  modelState: FighterModelState
}