import Fighter from "../../fighter";
import FighterFighting from "../../fighter-fighting/fighter-fighting";
import Logistics from "../../fighter-fighting/logistics";
import { farRange, strikingRange } from "../../fighter-fighting/proximity";


const mockFighting = {
  proximity: {}
} as FighterFighting

const logistics = new Logistics(mockFighting)

let mockDistanceVal

logistics.fighting.proximity.getDistanceFromEnemyCenterPoint = jest.fn(() => mockDistanceVal)

let mockEnemyAttackingVal

logistics.isEnemyAttacking = jest.fn(() => mockEnemyAttackingVal)

const mockEnemy = {} as Fighter

describe('getEnemyThreatPercentage', () => {

  function allResultsExpect(result){
    expect(result).not.toBeLessThan(0)
    expect(result).not.toBeGreaterThan(1)
  }

  test(`
    when: 
      - distance is half of far range
    expect:
      - return percentage to be more that 50%
  `, () => {
    mockDistanceVal = farRange * .5
    const result = logistics.getEnemyThreatPercentage(mockEnemy)
    expect(result).toBeGreaterThan(0.5)
    allResultsExpect(result)
  })

  describe('outside of range', () => {

    test(`
    when: 
    - distance is less that striking range
    expect:
    - return percentage to be 100%
    `, () => {
      mockDistanceVal = strikingRange * .99
      const result = logistics.getEnemyThreatPercentage(mockEnemy)
      expect(result).toBe(1)
      allResultsExpect(result)
    })
    
    test(`
    when: 
    - distance is greater than far range
    expect:
    - return percentage to be 0%
    `, () => {
      mockDistanceVal = farRange * 1.01
      const result = logistics.getEnemyThreatPercentage(mockEnemy)
      expect(result).toBe(0)
      allResultsExpect(result)
    })

  })
    
  describe('within edge of range', () => {

    test(`
      when: 
        - distance is within edge of far range
      expect:
        - return percentage to be between 0% and 5%
    `, () => {
      mockDistanceVal = farRange * .99
      const result = logistics.getEnemyThreatPercentage(mockEnemy)
      expect(result).toBeLessThan(0.02)
      allResultsExpect(result)
    })

    test(`
      when: 
        - distance is within edge of striking range
      expect:
        - return percentage to be between 95% and 100%
    `, () => {
      mockDistanceVal = strikingRange * 1.01
      const result = logistics.getEnemyThreatPercentage(mockEnemy)
      expect(result).toBeGreaterThan(0.98)
      allResultsExpect(result)
    })
  })
})
