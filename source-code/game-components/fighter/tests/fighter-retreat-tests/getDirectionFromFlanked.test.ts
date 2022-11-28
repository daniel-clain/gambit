import { octagon } from "../../../fight/octagon";
import Fighter from "../../fighter";
import FighterFighting from "../../fighter-fighting/fighter-fighting";
import { fighterRetreatImplementation, maxNearEdgeDistance } from "../../fighter-fighting/fighter-retreat.i";
import Logistics from "../../fighter-fighting/logistics";
import Proximity, { getSmallestAngleBetween2Directions } from "../../fighter-fighting/proximity";


const {point1, point2} = octagon.edges.top
const topEdgeY = (point1.y + point2.y)/2
const topEdgeXMiddle = (point1.x + point2.x)/2


const mockFighting = {
  modelState: 'Idle',
  fighter: {skin: 'Default'},
  movement: {coords: {x: undefined, y: undefined}}
} as FighterFighting

const testFighter = {
  name: 'test fighter',
  fighting: mockFighting
} as Fighter

mockFighting.proximity = new Proximity(mockFighting)
mockFighting.logistics = new Logistics(mockFighting)


mockFighting.movement.coords.y = topEdgeY - maxNearEdgeDistance + 10


const flanker1 = {
  fighting: {
    enemyTargetedForAttack: testFighter,
    movement: {
      coords: {x: undefined , y: undefined}
    },
    proximity : undefined
  }
} as Fighter
flanker1.fighting.proximity = new Proximity(flanker1.fighting)

const flanker2 = {
  fighting: {
    enemyTargetedForAttack: testFighter,
    movement: {
      coords: {x: undefined , y: undefined}
    },
    proximity : undefined
  }
} as Fighter

flanker2.fighting.proximity = new Proximity(flanker2.fighting)



jest
  .spyOn(Logistics.prototype, 'flanked', 'get')
  .mockImplementation(() => ({flankers: [flanker1, flanker2]}));



const {
  publicProperties: {
    getDirectionFromFlanked
  },
  privateProperties: {
  }
} = fighterRetreatImplementation(mockFighting)

describe('getDirectionFromFlanked', () => {

  test(`
    when 
      - flankers are same distance below
      - and; equal distance on either side
    expect 
      - returned direction to be between 0
  `, () => {

    testFighter.fighting.movement.coords = {
      x: topEdgeXMiddle,
      y: topEdgeY - (maxNearEdgeDistance * .9)
    }
    flanker1.fighting.movement.coords = {
      x: topEdgeXMiddle - 40,
      y: testFighter.fighting.movement.coords.y - 40
    }
    flanker2.fighting.movement.coords = {
      x: topEdgeXMiddle + 40,
      y: testFighter.fighting.movement.coords.y - 40
    }
    const returnedDirection = getDirectionFromFlanked()
    expect(returnedDirection).toBe(0)
  })


  
  test(`
    when 
      - flanker1 is closer than flanker2
    expect 
      - returned direction should be closer to away from flanker1 direction and further from away from flanker2 direction
  `, () => {
      testFighter.fighting.movement.coords = {
        x: topEdgeXMiddle,
        y: topEdgeY - (maxNearEdgeDistance * .9)
      }
      flanker1.fighting.movement.coords = {
        x: topEdgeXMiddle - 30,
        y: testFighter.fighting.movement.coords.y - 30
      }
      flanker2.fighting.movement.coords = {
        x: topEdgeXMiddle + 50,
        y: testFighter.fighting.movement.coords.y - 50
      }

      const directionFromFlanker1 = testFighter.fighting.proximity.getDirectionOfEnemyCenterPoint(flanker1, true)

      const directionFromFlanker2 = testFighter.fighting.proximity.getDirectionOfEnemyCenterPoint(flanker2, true)

      const returnedDirection = getDirectionFromFlanked()
      expect(returnedDirection).not.toBe(0)
      
      const flanker1AngleDiff = getSmallestAngleBetween2Directions(returnedDirection, directionFromFlanker1).angleBetween
      const flanker2AngleDiff = getSmallestAngleBetween2Directions(returnedDirection, directionFromFlanker2).angleBetween


      expect(flanker1AngleDiff).toBeLessThan(flanker2AngleDiff)
  })
})