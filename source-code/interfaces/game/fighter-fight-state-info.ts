import Coords from './fighter/coords';
import FacingDirection from '../../types/figher/facing-direction';
import FighterModelState from '../../types/figher/fighter-model-states';
import SoundTime from './fighter/sound-time';
import { Skin } from '../../types/figher/skin';
import { Angle } from '../../types/game/angle';
import { KnownFighterStats } from '../server-game-ui-state.interface';

export default interface FighterFightState{
  name: string
  coords: Coords
  facingDirection: FacingDirection
  modelState: FighterModelState
  soundsMade: SoundTime[]
  onRampage: boolean,
  skin: Skin,
  retreatingFromFlanked: boolean
  strikingCenters: {front: Coords, back: Coords}
  spirit: number
  repositioning: boolean,
  direction: Angle
  trapped: boolean
  poisoned: boolean
  injured: boolean
  doped: boolean
  managerKnownStats: KnownFighterStats
}