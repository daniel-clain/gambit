import Proximity from "./proximity";



describe('isDirectionWithinDegreesOfDirection', () => {
  it('should return true test angle within specified degrees of specified angle', () => {
    const proximity = new Proximity(null)

    

    const test1 = proximity.isDirectionWithinDegreesOfDirection(80, 90, 260)
    expect(test1).toBeFalsy()
    
    const test2 = proximity.isDirectionWithinDegreesOfDirection(80, 90, 80)
    expect(test2).toBeTruthy()
    
    const test3 = proximity.isDirectionWithinDegreesOfDirection(180, 90, 180)
    expect(test3).toBeTruthy()
    
    const test4 = proximity.isDirectionWithinDegreesOfDirection(220, 90, 140)
    expect(test4).toBeFalsy()
    
    const test5 = proximity.isDirectionWithinDegreesOfDirection(350, 90, 80)
    expect(test5).toBeFalsy()
    
    const test6 = proximity.isDirectionWithinDegreesOfDirection(20, 180, 300)
    expect(test6).toBeTruthy()
    
    const test7 = proximity.isDirectionWithinDegreesOfDirection(359, 90, 90)
    expect(test7).toBeFalsy()
    
    const test8 = proximity.isDirectionWithinDegreesOfDirection(90, 90, 180)
    expect(test8).toBeFalsy()

    const test9 = proximity.isDirectionWithinDegreesOfDirection(355, 40, 10)
    expect(test9).toBeTruthy()

    const test10 = proximity.isDirectionWithinDegreesOfDirection(4, 20, 355)
    expect(test10).toBeTruthy()
  });
});