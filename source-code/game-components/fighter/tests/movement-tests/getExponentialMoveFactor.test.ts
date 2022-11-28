import FighterFighting from "../../fighter-fighting/fighter-fighting"
import FighterTimers from "../../fighter-fighting/fighter-timers"
import Movement from "../../fighter-fighting/movement"
import { Timer } from "../../fighter-fighting/timer"

const mockFighting = {} as FighterFighting
mockFighting.movement = new Movement(mockFighting)
mockFighting.timers = new FighterTimers(mockFighting)

const moveTimer = mockFighting.timers.get('move action')

let mockTimeElapsed: number
jest
  .spyOn(moveTimer, 'timeElapsed', 'get')
  .mockImplementation(() => mockTimeElapsed);



describe('getExponentialMoveFactor', () => {
  test(`
    when: 
      - move timer time elapsed is 1sec
    expect:
      - return value to be 295
  `, () => {
    
    mockTimeElapsed = 1000
    const returnVal = mockFighting.movement.getExponentialMoveFactor(500)
    expect(returnVal).toBe(295)

  })
  test(`
  when: 
    - move timer time elapsed is 2secs
  expect:
    - return value to be 120
  `, () => {
    
    mockTimeElapsed = 2000
    const returnVal = mockFighting.movement.getExponentialMoveFactor(500)
    expect(returnVal).toBe(120)
  })
  test(`
  when: 
    - move timer time elapsed is 2.5secs
  expect:
    - return value to be 50
  `, () => {
    
    mockTimeElapsed = 2500
    const returnVal = mockFighting.movement.getExponentialMoveFactor(500)
    expect(returnVal).toBe(50)
  })
})