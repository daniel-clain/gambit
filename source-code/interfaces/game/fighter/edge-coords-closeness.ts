import { Edge } from "./edge";
import Coords from "./coords";
import { Closeness } from "../../../types/figher/closeness";

export default interface EdgeCoordsCloseness{
  edgeName: Edge
  coords: Coords
  closeness: Closeness
}