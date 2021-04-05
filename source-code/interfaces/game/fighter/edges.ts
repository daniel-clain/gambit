import Coords from "./coords";

export interface Edges{
  
  left: {point1: Coords, point2: Coords}
  topLeft: {point1: Coords, point2: Coords}
  top: {point1: Coords, point2: Coords}
  topRight: {point1: Coords, point2: Coords}
  right: {point1: Coords, point2: Coords}
  bottomRight: {point1: Coords, point2: Coords}
  bottom: {point1: Coords, point2: Coords}
  bottomLeft: {point1: Coords, point2: Coords}
}