import Coords from './fighter/coords';
import FacingDirection from '../../types/figher/facing-direction';
import FighterModelState from '../../types/figher/fighter-model-states';
import SoundTime from './fighter/sound-time';
import { Skin } from '../../types/figher/skin';
import Direction360 from '../../types/figher/direction-360';

export default interface FighterFightState{
  name: string
  coords: Coords
  facingDirection: FacingDirection
  modelState: FighterModelState
  soundsMade: SoundTime[]
  onRampage: boolean,
  skin: Skin,
  flanked: boolean
  strikingCenters: {front: Coords, back: Coords}
  spirit: number
  repositioning: boolean,
  direction: Direction360
}