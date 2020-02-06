import Coords from "./coords";
import Direction360 from "../../../types/figher/direction-360";
import Fighter from "../../../game-components/fighter/fighter";

export default interface Flanker{
  type: 'Fighter' | 'Edge'
  name: string
  direction: Direction360
  distance: number
  fighter?: Fighter
  coords: Coords
}