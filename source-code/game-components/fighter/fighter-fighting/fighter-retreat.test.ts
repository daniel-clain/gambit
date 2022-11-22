import { Edge } from "../../../types/fighter/edge"
import { Angle } from "../../../types/game/angle"
import { octagon } from "../../fight/octagon"
import FighterFighting from "./fighter-fighting"
import { fighterRetreatImplementation } from "./fighter-retreat.i"
import { add2Angles, getSmallestAngleBetween2Directions, subtractAngle2FromAngle1, validateAngle } from "./proximity"


const {point1, point2} = octagon.edges.right
const yAverage = (point1.y + point2.y)/2
const xAverage = (point1.x + point2.x)/2

const mockFighting = {
  logistics:{flanked: undefined},
  movement: {coords: {x: xAverage - 50, y: yAverage}}
} as FighterFighting

const {
  publicProperties: {
    getDirectionInfluencedByNearEdge
  }, 
  privateProperties: {
    getDistanceFromEdge,
    getDirectionOfEdgeCornerClosestToDirection
  }
} = fighterRetreatImplementation(mockFighting)

describe('getDirectionInfluencedByNearEdge', () => {
  
  test(`
    when: called, 
    expect: private functions to be called with with expected values
  `, () => {
    const directionFromFlanked: Angle =  110
    const nearEdgeInDirection: Edge = 'right'

    getDirectionInfluencedByNearEdge(directionFromFlanked, nearEdgeInDirection)
    expect(getDistanceFromEdge).toBeCalledWith([])
    expect(getDirectionOfEdgeCornerClosestToDirection).toBeCalled()
  })

  test(`
    when 
      - distanceFromEdge is less than maxDistanceNearEdge 
      - and; distanceFromEdge is more than withinAgainstEdgeDistance, 
    expect 
      - returnDirection to be between alongEdgeDirection and retreatDirection
  `, () => {
    const directionFromFlanked: Angle =  110
    const nearEdgeInDirection: Edge = 'right'

    const returnDirection = getDirectionInfluencedByNearEdge(directionFromFlanked, nearEdgeInDirection)
    expect(returnDirection).toBeGreaterThan(directionFromFlanked)
    expect(returnDirection).toBeLessThan(180)
  })

  test(`
    when 
      - distance is halfway to edge
    expect 
      - direction should be half influenced by edge direction
  `, () => {
    
    const directionFromFlanked: Angle =  110
    const nearEdgeInDirection: Edge = 'right'

    const returnDirection = getDirectionInfluencedByNearEdge(directionFromFlanked, nearEdgeInDirection)

    expect(returnDirection).toBe(130)
  })  


})
