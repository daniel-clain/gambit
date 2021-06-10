import { Edge } from "./edge";
import Coords from "./coords";
import { Closeness } from "../../../types/fighter/closeness";

export default interface EdgeCoordsCloseness{
  edgeName: Edge
  coords: Coords
  closeness: Closeness
}