import Dimensions from "../../interfaces/game/fighter/dimensions"
import Coords from '../../interfaces/game/fighter/coords';
import { Edges } from "../../interfaces/game/fighter/edges";
import { Edge } from "../../interfaces/game/fighter/edge";
import EdgeCoord from "../../interfaces/game/fighter/edge-coord-distance";
import { getDistanceBetweenTwoPoints } from "../../helper-functions/helper-functions";
import EdgeCoordDistance from "../../interfaces/game/fighter/edge-coord-distance";

export default class Octagon {
  static edgeKeys: Edge[] = ['left', 'topLeft', 'top', 'topRight', 'right', 'bottomRight', 'bottom', 'bottomLeft']

  static points = {
    leftTop: { x: 11, y: 261 },
    topLeft: { x: 243, y: 355 },
    topRight: { x: 530, y: 355 },
    rightTop: { x: 755, y: 265 },
    rightBottom: { x: 782, y: 113 },
    bottomRight: { x: 562, y: 0 },
    bottomLeft: { x: 217, y: 0 },
    leftBottom: { x: 0, y: 113 }
  }
  static edges: Edges = {
    left: { point1: Octagon.points.leftTop, point2: Octagon.points.leftBottom },
    topLeft: { point1: Octagon.points.leftTop, point2: Octagon.points.topLeft },
    top: { point1: Octagon.points.topLeft, point2: Octagon.points.topRight },
    topRight: { point1: Octagon.points.topRight, point2: Octagon.points.rightTop },
    right: { point1: Octagon.points.rightTop, point2: Octagon.points.rightBottom },
    bottomRight: { point1: Octagon.points.rightBottom, point2: Octagon.points.bottomRight },
    bottom: { point1: Octagon.points.bottomLeft, point2: Octagon.points.bottomRight },
    bottomLeft: { point1: Octagon.points.bottomLeft, point2: Octagon.points.leftBottom }
  }
  static checkIfPointIsWithinOctagon(point): boolean {
    for (let edgeKey in this.edges) {
      if (!this.checkInsideEdgeForPoint(edgeKey as Edge, this.edges[edgeKey], point)) {
        return false
      }
    }
    return true
  }

  static checkIfFighterIsWithinOctagon(modelWidth: number, coords: Coords): boolean {
    
    for (let edgeKey of Octagon.edgeKeys) {
      let point: Coords = { ...coords }
      switch (edgeKey) {    
        case 'bottomLeft':
          point.x -= modelWidth*.4
          break;
        case 'left':
          point.x -= modelWidth*.5
          break;
        case 'topLeft':
          point.y += 10
          point.x -= modelWidth*.4
          break;
        case 'top':
          point.y += 20
          break;
        case 'topRight':
          point.y += 10
          point.x += modelWidth*.4
          break;
        case 'right':
          point.x += modelWidth*.5
          break;
        case 'bottomRight':
          point.x += modelWidth*.4
        break;    
      }
      if (!this.checkInsideEdgeForPoint(edgeKey, this.edges[edgeKey], point)) {
        return false
      }
    }
    return true

  }

  private static checkInsideEdgeForPoint(edgeKey: Edge, edgePoints, testPoint: Coords): boolean {
    const { point1, point2 } = edgePoints

    const m = (point1.y - point2.y) / (point1.x - point2.x)
    const b = point1.y - (m * point1.x)

    const yIfXPointWereOnTheLine = m * testPoint.x + b
    let test
    if (['bottomRight', 'bottom', 'bottomLeft'].some(keyName => keyName == edgeKey)) {
      test = testPoint.y - yIfXPointWereOnTheLine
    }
    else {
      test = yIfXPointWereOnTheLine - testPoint.y
    }

    let insideBoundaries: boolean
    if (test > 0)
      insideBoundaries = true
    else
      insideBoundaries = false

    return insideBoundaries
  }

  static getAllEdgeDistanceAndCoordOnClosestEdge(testPoint: Coords, modelWidth: number): EdgeCoordDistance[] {
    const edgeDistanceAndCoords: EdgeCoordDistance[] = []
    let edgeName: Edge
    for (edgeName of Octagon.edgeKeys) {
      let point: Coords = { ...testPoint }
      switch (edgeName) {    
        case 'bottomLeft':
          point.x -= modelWidth*.4
          break;
        case 'left':
          point.x -= modelWidth*.5
          break;
        case 'topLeft':
          point.y += 10
          point.x -= modelWidth*.4
          break;
        case 'top':
          point.y += 20
          break;
        case 'topRight':
          point.y += 10
          point.x += modelWidth*.4
          break;
        case 'right':
          point.x += modelWidth*.5
          break;
        case 'bottomRight':
          point.x += modelWidth*.4
        break;    
      }


      const { distance, coords } = this.getClosestDistanceAndCoordOnEdge(point, edgeName)
      edgeDistanceAndCoords.push({ distance, coords, edgeName })
    }

    return edgeDistanceAndCoords
  }

  static getClosestDistanceAndCoordOnEdge(testPoint: Coords, edgeName: Edge): { distance: number, coords: Coords } {

    const { point1, point2 } = Octagon.edges[edgeName]


    let smallestDistance: number
    let smallestDistanceCoords: Coords
    let biggestX
    let smallestX
    if (point1.x > point2.x) {
      biggestX = point1.x
      smallestX = point2.x
    }
    else {
      biggestX = point2.x
      smallestX = point1.x
    }



    if (edgeName == 'top' || edgeName == 'bottom') {
      const coordsOnEdge = { x: testPoint.x, y: point1.y }
      let distanceFromEdge
      if (edgeName == 'top')
        distanceFromEdge = point1.y - testPoint.y
      else
        distanceFromEdge = testPoint.y - point1.y
      return { distance: distanceFromEdge, coords: coordsOnEdge }
    }
    if (edgeName == 'left' || edgeName == 'right') {
      const xOnSide = this.getSideXBasedOnYPercentage(point1, point2, testPoint)
      const coordsOnEdge = { x: xOnSide, y: testPoint.y }
      let distanceFromEdge
      if (edgeName == 'left')
        distanceFromEdge = testPoint.x - point1.x
      else
        distanceFromEdge = point1.x - testPoint.x
      return { distance: distanceFromEdge, coords: coordsOnEdge }
    }


    for (let x = smallestX; x < biggestX; x++) {
      const y = Octagon.getYOnSlopeBasedOnX(x, { point1, point2 })
      const distance = getDistanceBetweenTwoPoints(testPoint, { x, y })
      if (!smallestDistance || distance < smallestDistance) {
        smallestDistance = distance
        smallestDistanceCoords = { x, y }
      }
    }

    return { distance: smallestDistance, coords: smallestDistanceCoords }

  }

  static getSideXBasedOnYPercentage(point1: Coords, point2: Coords, testPoint: Coords) {

    let biggestX
    let smallestX
    if (point1.x > point2.x) {
      biggestX = point1.x
      smallestX = point2.x
    }
    else {
      biggestX = point2.x
      smallestX = point1.x
    }

    let biggestY
    let smallestY
    if (point1.y > point2.y) {
      biggestY = point1.y
      smallestY = point2.y
    }
    else {
      biggestY = point2.y
      smallestY = point1.y
    }

    const sideRange = biggestY - smallestY

    const xRange = biggestX - smallestX

    const testPointYAmountInRange = testPoint.y - smallestY

    const percentageOfYAmountInRange = testPointYAmountInRange / sideRange

    const xValueInXRangeBasedOnYPercentage = xRange * percentageOfYAmountInRange

    return xValueInXRangeBasedOnYPercentage + smallestX

  }

  static getYOnSlopeBasedOnX(x, points) {
    const { point1, point2 } = points

    const m = (point1.y - point2.y) / (point1.x - point2.x)
    const b = point1.y - (m * point1.x)
    const y = m * x + b
    return y
  }

  static getHeight() {
    let height
    for (const key in this.points) {
      const point = this.points[key]
      if (!(height > point.y))
        height = point.y
    }
    return height
  }
  static getWidth() {
    let width
    for (const key in this.points) {
      const point = this.points[key]
      if (!(width > point.x))
        width = point.x
    }
    return width
  }

};
