import { octagon } from "../../../fight/octagon"
import Fighter from "../../fighter"
import FighterFighting from "../../fighter-fighting/fighter-fighting"
import { fighterRetreatImplementation, maxNearEdgeDistance } from "../../fighter-fighting/fighter-retreat.i"
import Logistics from "../../fighter-fighting/logistics"
import Proximity, { getSmallestAngleBetween2Directions } from "../../fighter-fighting/proximity"




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


mockFighting.logistics = new Logistics(mockFighting)
console.log('flanked ', mockFighting.logistics.flanked)


const {
  publicProperties: {
    getDirectionBetweenFlankers
  },
  privateProperties: {
  }
} = fighterRetreatImplementation(mockFighting)



describe('getDirectionBetweenFlankers', () => {
  
  test(`
    when 
      - flankers are same distance below
      - and; equal distance on either side
    expect 
      - returned direction to be 180
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
      
      const returnedDirection = getDirectionBetweenFlankers()
      expect(returnedDirection).toBeGreaterThan(90)
      expect(returnedDirection).toBeLessThan(270)
      expect(returnedDirection).toBe(180)
  })
  test(`
    when 
      - flanker1 is closer than flanker2
    expect 
      - returned direction to be more away from flanker1 and more toward flanker 2
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

      const flanker1Direction = testFighter.fighting.proximity.getDirectionOfEnemyCenterPoint(flanker1)

      const flanker2Direction = testFighter.fighting.proximity.getDirectionOfEnemyCenterPoint(flanker2)

      const returnedDirection = getDirectionBetweenFlankers()
      expect(returnedDirection).not.toBe(180)
      
      const flanker1AngleDiff = getSmallestAngleBetween2Directions(returnedDirection, flanker1Direction).angleBetween
      const flanker2AngleDiff = getSmallestAngleBetween2Directions(returnedDirection, flanker2Direction).angleBetween


      expect(flanker1AngleDiff).toBeGreaterThan(flanker2AngleDiff)
  })
})