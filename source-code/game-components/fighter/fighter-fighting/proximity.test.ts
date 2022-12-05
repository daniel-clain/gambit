import Proximity, { directionWithinDegreesOfDirection, getDirectionOfPosition1ToPosition2 } from "./proximity";


describe('getDirectionOfPosition1ToPosition2', () => {
  it('should return the correct direction between 0 and 359', () => {
    const test1 = getDirectionOfPosition1ToPosition2(
      {x: 300, y: 300}, {x: 200, y: 300})
    expect(test1).toBe(270)

    const test2 = getDirectionOfPosition1ToPosition2(
      {x: 300, y: 300}, {x: 300, y: 400})
    expect(test2).toBe(0)

    const test3 = getDirectionOfPosition1ToPosition2(
      {x: 300, y: 300}, {x: 200, y: 200})
    expect(test3).toBe(225)

    const test4 = getDirectionOfPosition1ToPosition2(
      {x: 300, y: 300}, {x: 300, y: 300})
    expect(test4).toBe(0)

    const test5 = getDirectionOfPosition1ToPosition2(
      {x: 9, y: 202}, {x: 7, y: 202})
    expect(test5).toBe(270)
    
    const test6 = getDirectionOfPosition1ToPosition2(
      {x: 627, y: 122}, {x: 626, y: 242})
    expect(test6).toBe(0)
  });
});

describe('directionWithinDegreesOfDirection', () => {
  it('should return true test angle within specified degrees of specified angle', () => {
    const proximity = new Proximity(null)

    

    const test1 = directionWithinDegreesOfDirection(80, 90, 260)
    expect(test1).toBeFalsy()
    
    const test2 = directionWithinDegreesOfDirection(80, 90, 80)
    expect(test2).toBeTruthy()
    
    const test3 = directionWithinDegreesOfDirection(180, 90, 180)
    expect(test3).toBeTruthy()
    
    const test4 = directionWithinDegreesOfDirection(220, 90, 140)
    expect(test4).toBeFalsy()
    
    const test5 = directionWithinDegreesOfDirection(350, 90, 80)
    expect(test5).toBeFalsy()
    
    const test6 = directionWithinDegreesOfDirection(20, 180, 300)
    expect(test6).toBeTruthy()
    
    const test7 = directionWithinDegreesOfDirection(359, 90, 90)
    expect(test7).toBeFalsy()
    
    const test8 = directionWithinDegreesOfDirection(90, 90, 180)
    expect(test8).toBeFalsy()

    const test9 = directionWithinDegreesOfDirection(355, 40, 10)
    expect(test9).toBeTruthy()

    const test10 = directionWithinDegreesOfDirection(4, 20, 355)
    expect(test10).toBeTruthy()
  });
});