import Coords from './fighter/coords';
import FacingDirection from '../../types/figher/facing-direction';
import FighterModelState from '../../types/figher/fighter-model-states';
import SoundTime from './fighter/sound-time';
import { Skin } from '../../types/figher/skin';
import Flanked from './fighter/flanked';

export default interface FighterFightState{
  name: string
  coords: Coords
  facingDirection: FacingDirection
  modelState: FighterModelState
  soundsMade: SoundTime[]
  onRampage: boolean,
  skin: Skin,
  flanked: Flanked
  strikingCenters: {front: Coords, back: Coords}
}