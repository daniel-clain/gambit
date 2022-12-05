import { Angle } from "../../../../types/game/angle"
import { octagon } from "../../../fight/octagon"
import FighterFighting from "../../fighter-fighting/fighter-fighting"
import { fighterRetreatImplementation, maxNearEdgeDistance } from "../../fighter-fighting/fighter-retreat.i"
import Proximity, { getDirectionOfPosition1ToPosition2, getFighterModelDimensions } from "../../fighter-fighting/proximity"

const {point1, point2} = octagon.edges.right
const yAverage = (point1.y + point2.y)/2
const xAverage = (point1.x + point2.x)/2



const mockFighting = {
  modelState: 'Idle',
  fighter: {skin: 'Default'},
  logistics:{flanked: undefined},
  movement: {coords: {x: xAverage - 50, y: yAverage}}
} as FighterFighting

mockFighting.proximity = new Proximity(mockFighting)

const {
  publicProperties: {
    getNearEdgeInDirection
  },
  privateProperties: {
  }
} = fighterRetreatImplementation(mockFighting)

const modelWidth = getFighterModelDimensions(mockFighting.fighter, 'Idle').width 

const xThreshold = xAverage - maxNearEdgeDistance - modelWidth * .5 

const edgeCoords = octagon.getClosestCoordsOnAnEdgeFromAPoint('right', mockFighting.movement.coords)

const directionOfEdge = getDirectionOfPosition1ToPosition2(mockFighting.movement.coords, edgeCoords)



describe('getNearEdgeInDirection', () => {
  
  test(`
    when 
      - retreatDirection is 90
      - and; right edge is within near distance 
    expect 
      - returned edge to be 'right'
  `, () => {
    mockFighting.movement.coords.x = xThreshold + 10
    expect(getNearEdgeInDirection(90)).toBe('right')
  })

  
  test(`
    when 
      - retreatDirection is 90
      - and; right edge is NOT within near distance 
    expect 
      - returned edge to be undefined
  `, () => {
    mockFighting.movement.coords.x = xThreshold - 10
    expect(getNearEdgeInDirection(90)).toBe(undefined)
  })

  
  test(`
    when 
      - retreatDirection is just within the boundary
      - and; right edge is within near distance 
    expect 
      - returned edge to be 'right'
  `, () => {
    mockFighting.movement.coords.x = xThreshold + 10
    let testDirection = directionOfEdge - 44 as Angle
    expect(getNearEdgeInDirection(testDirection)).toBe('right')

    testDirection = directionOfEdge + 44 as Angle
    expect(getNearEdgeInDirection(testDirection)).toBe('right')
  })

  test(`
    when 
      - retreatDirection is outside 45 0f edge direction
      - and; right edge is within near distance 
    expect 
      - returned edge to be 'undefined'
  `, () => {

    mockFighting.movement.coords.x = xThreshold + 10   

    let testDirection = directionOfEdge - 46 as Angle    
    expect(getNearEdgeInDirection(testDirection)).toBe(undefined)

    testDirection = directionOfEdge + 46 as Angle    
    expect(getNearEdgeInDirection(testDirection)).toBe(undefined)
  })
})