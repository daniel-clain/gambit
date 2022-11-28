import { Closeness } from "../../../../types/fighter/closeness";
import Fighter from "../../fighter";
import FighterFighting from "../../fighter-fighting/fighter-fighting";
import { fighterRetreatImplementation } from "../../fighter-fighting/fighter-retreat.i";
import Proximity, { add2Angles, closeRange, farRange, nearbyRange, strikingRange, toAngle } from "../../fighter-fighting/proximity";


const mockFighting = {
  movement: {
    coords: {x: undefined , y: undefined}
  }
} as FighterFighting
mockFighting.proximity = new Proximity(mockFighting)

const {
  publicProperties: {
  }, 
  privateProperties: {
    enemyBlockingDirection
  }
} = fighterRetreatImplementation(mockFighting)



let mockReturnEnemyDistance
mockFighting.proximity.getDistanceFromEnemyCenterPoint = jest.fn(
  () => mockReturnEnemyDistance
)
let mockReturnEnemyDirection
mockFighting.proximity.getDirectionOfEnemyCenterPoint = jest.fn(
  () => mockReturnEnemyDirection
)

describe('enemyBlockingDirection', () => {

  describe.each([
    {distance: closeRange, maxDegrees: 135 },
    {distance: nearbyRange, maxDegrees: 90 },
    {distance: farRange, maxDegrees: 45 }      
  ])
  (`when 
     - enemy distance $distance `,
  ({distance, maxDegrees}) => {
    
    describe.each([
      {scenario: 'within', modifier: .9, expected: true}, 
      {scenario: 'outside', modifier: 1.1, expected: false}
    ])
    (`- and; direction is $scenario ${maxDegrees}`, 
    ({modifier, expected}) => {

      const movingDirection = 90
      mockReturnEnemyDistance = distance
      mockReturnEnemyDirection = add2Angles(movingDirection, toAngle(maxDegrees * modifier))

      const returnVal = !!enemyBlockingDirection(null as Fighter, movingDirection)

      test(`expect return val to be ${expected}`, () => {
        expect(returnVal).toBe(expected)
      })
    })
  })
/* 

  test.skip(`
    when 
      - enemy is within close range
      - and; direction is within 135deg of direction from enemy
    expect 
      - return to be true
  `, () => {
    mockFighting.movement.coords = {y: 100, x: 100}
    enemy.fighting.movement.coords = {y: 100, x: 100 + closeRange*.99}
    
    const directionFromEnemy = mockFighting.proximity.getDirectionOfEnemyCenterPoint(enemy)
    const direction = add2Angles(directionFromEnemy, toAngle(135*.99))

    const returnVal = enemyBlockingDirection(enemy, direction)

    expect(returnVal).toBeTruthy()

  })
  
  test(`
    when 
      - enemy is within close range
      - and; direction is NOT within 135deg of direction from enemy
    expect 
      - return to be false
  `, () => {
    mockFighting.movement.coords = {y: 100, x: 100}
    enemy.fighting.movement.coords = {y: 100, x: 100 + closeRange*.99}
    
    const directionFromEnemy = mockFighting.proximity.getDirectionOfEnemyCenterPoint(enemy)
    const direction = add2Angles(directionFromEnemy, toAngle(135*1.01))

    const returnVal = enemyBlockingDirection(enemy, direction)

    expect(returnVal).toBeFalsy()

  }) */
})