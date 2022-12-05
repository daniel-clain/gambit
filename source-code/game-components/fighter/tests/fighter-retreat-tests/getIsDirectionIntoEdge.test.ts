import { octagon } from "../../../fight/octagon";
import FighterFighting from "../../fighter-fighting/fighter-fighting";
import { fighterRetreatImplementation } from "../../fighter-fighting/fighter-retreat.i";
import Proximity, { getDirectionOfPosition1ToPosition2 } from "../../fighter-fighting/proximity";

let mockFighterCoords
const mockFighting = {
  movement: {
    coords: mockFighterCoords
  },
  fighter: {
    skin: 'Default'
  }
} as FighterFighting


mockFighting.proximity = new Proximity(mockFighting)
const {
  publicProperties: {
    getIsDirectionIntoEdge
  }, 
  privateProperties: {
  }
} = fighterRetreatImplementation(mockFighting)

  test(`
    when: 
      - persist direction is up along top right edge
      - and; in top right corner
    expect: 
      - return value to be true
  `, () => {
    const {persistDirection, topCornerCoords} = setup()
    const {x, y} = topCornerCoords
    mockFighterCoords = {x: x-5, y: y-5}

    const returnValue = getIsDirectionIntoEdge(persistDirection)
    
    expect(returnValue)

    /* implementation */

    function setup(){
      
      const {point1, point2} = octagon.edges['topRight']
      const [topPoint, bottomPoint] = point1.y > point2.y ? [point1, point2] : [point2, point1]
      const cornerDirection = getDirectionOfPosition1ToPosition2(bottomPoint, topPoint)
      return {persistDirection: cornerDirection, topCornerCoords: topPoint}
    }
  })