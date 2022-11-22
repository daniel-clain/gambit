import { Edge } from "../../../types/fighter/edge";
import Coords from "./coords";

export default interface EdgeCoordDistance{
  edgeName: Edge
  coords: Coords
  distance: number
}