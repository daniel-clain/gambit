import { Edge } from "./edge";
import Coords from "./coords";

export default interface EdgeCoordDistance{
  edgeName: Edge
  coords: Coords
  distance: number
}