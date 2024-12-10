import Coords from "../../interfaces/game/fighter/coords"
import { Edge, EdgePoints } from "../../types/fighter/edge"
import { Angle } from "../../types/game/angle"
import {
  getDirectionOfPosition1ToPosition2,
  getDistanceBetweenTwoPoints,
} from "../fighter/fighter-fighting/proximity"

const points = {
  leftTop: { x: 16, y: 261 },
  topLeft: { x: 248, y: 355 },
  topRight: { x: 535, y: 355 },
  rightTop: { x: 760, y: 265 },
  rightBottom: { x: 793, y: 113 },
  bottomRight: { x: 567, y: 0 },
  bottomLeft: { x: 223, y: 0 },
  leftBottom: { x: 0, y: 113 },
}
const edges: EdgePoints = {
  left: { point1: points.leftTop, point2: points.leftBottom },
  topLeft: { point1: points.leftTop, point2: points.topLeft },
  top: { point1: points.topLeft, point2: points.topRight },
  topRight: { point1: points.topRight, point2: points.rightTop },
  right: { point1: points.rightTop, point2: points.rightBottom },
  bottomRight: { point1: points.rightBottom, point2: points.bottomRight },
  bottom: { point1: points.bottomLeft, point2: points.bottomRight },
  bottomLeft: { point1: points.bottomLeft, point2: points.leftBottom },
}

function getClosestCoordsOnAnEdgeFromAPoint(
  edgeName: Edge,
  point: Coords
): Coords {
  const { point1, point2 } = edges[edgeName]
  return getClosestCoordsOnASlopeFromAPoint({ point1, point2 }, point)
}

function getClosestCoordsOnASlopeFromAPoint(
  slopePoints: { point1: Coords; point2: Coords },
  point: Coords
): Coords {
  const { point1, point2 } = slopePoints

  const slope = getSlopeBetween2Points(point1, point2)
  const yInterceptOnSlope = getYInterceptOnSlope(slope, point1)

  const m = slope
  const b = yInterceptOnSlope
  const { x, y } = point

  const closestPointOnSlope: Coords = {
    x: (y * m + x - b * m) / (m * m + 1),
    y: (y * (m * m) + x * m + b) / (m * m + 1),
  }

  return closestPointOnSlope
}

function isPointOutsideOfEdge(edgeName: Edge, point: Coords): boolean {
  const closestPointOnSlope: Coords = getClosestCoordsOnAnEdgeFromAPoint(
    edgeName,
    point
  )

  switch (edgeName) {
    case "topLeft":
    case "left":
    case "bottomLeft":
      return point.x < closestPointOnSlope.x
    case "topRight":
    case "right":
    case "bottomRight":
      return point.x > closestPointOnSlope.x
    case "top":
      return point.y > closestPointOnSlope.y
    case "bottom":
      return point.y < closestPointOnSlope.y
  }
}

function getSlopeBetween2Points(point1, point2) {
  const rise = point1.y - point2.y
  const run = point1.x - point2.x
  return rise / run
}

function getYInterceptOnSlope(slope, pointOnSlope) {
  const { x, y } = pointOnSlope
  const m = slope
  return y - m * x
}

function getDistanceFromEdge(edgeName: Edge, point: Coords) {
  const closestPointOnSlope: Coords = getClosestCoordsOnAnEdgeFromAPoint(
    edgeName,
    point
  )
  return getDistanceBetweenTwoPoints(closestPointOnSlope, point)
}

function getDirectionToClosestEdge(point: Coords): Angle {
  const closestEdge = getClosestEdge(point)
  const closestPointOnClosestEdge: Coords = getClosestCoordsOnAnEdgeFromAPoint(
    closestEdge,
    point
  )
  return getDirectionOfPosition1ToPosition2(point, closestPointOnClosestEdge)
}

function getClosestEdge(point: Coords): Edge {
  let closestEdge: { edgeName: Edge; distance: number }
  for (let edgeKey in edges) {
    const edgeName = edgeKey as Edge
    const distance = getDistanceFromEdge(edgeName, point)
    if (!closestEdge || distance < closestEdge.distance)
      closestEdge = { edgeName, distance }
  }
  return closestEdge.edgeName
}

function getDistanceOfClosestEdge(point: Coords): number {
  const closestEdge = getClosestEdge(point)
  const closestPointOnEdge: Coords = getClosestCoordsOnAnEdgeFromAPoint(
    closestEdge,
    point
  )
  return getDistanceBetweenTwoPoints(point, closestPointOnEdge)
}

export const octagon = {
  edges,
  points,
  getDistanceOfClosestEdge,
  getClosestCoordsOnASlopeFromAPoint,
  isPointOutsideOfEdge,
  getDistanceFromEdge,
  getClosestCoordsOnAnEdgeFromAPoint,
  getClosestEdge,
  getDirectionToClosestEdge,
}
