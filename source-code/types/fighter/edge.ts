import Coords from "../../interfaces/game/fighter/coords"


export const edgeNames = ['left', 'topLeft', 'top', 'topRight', 'right', 'bottomRight', 'bottom', 'bottomLeft'] as const
export type Edge = typeof edgeNames[number]


export type EdgePoints = {  
  [key in Edge]: {point1: Coords, point2: Coords}
}

export type EdgeDistance = {
  edge: Edge
  distance: number
}