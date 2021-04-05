import Coords from "./coords";
import Fighter from "../../../game-components/fighter/fighter";

export default interface Flanker{
  type: 'Fighter' | 'Edge'
  name: string
  direction: number
  distance: number
  fighter?: Fighter
  coords: Coords
}