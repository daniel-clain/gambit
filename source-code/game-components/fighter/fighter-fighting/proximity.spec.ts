import Proximity from "./proximity";

describe('isDirectionWithin90DegreesOfDirection', () => {
  it('should return true for opposite angles within 90 degrees of eachother', () => {
    const proximity = new Proximity(null)

    const test1 = proximity.isDirectionWithin90DegreesOfDirection(80, 260)
    expect(test1).toBeFalsy()
    
    const test2 = proximity.isDirectionWithin90DegreesOfDirection(80, 80)
    expect(test2).toBeTruthy()
    
    const test3 = proximity.isDirectionWithin90DegreesOfDirection(180, 180)
    expect(test3).toBeTruthy()
    
    const test4 = proximity.isDirectionWithin90DegreesOfDirection(220, 140)
    expect(test4).toBeTruthy()
    
    const test5 = proximity.isDirectionWithin90DegreesOfDirection(350, 80)
    expect(test5).toBeTruthy()
    
    const test6 = proximity.isDirectionWithin90DegreesOfDirection(20, 300)
    expect(test6).toBeTruthy()
    
    const test7 = proximity.isDirectionWithin90DegreesOfDirection(359, 90)
    expect(test7).toBeFalsy()
    
    const test8 = proximity.isDirectionWithin90DegreesOfDirection(90, 181)
    expect(test8).toBeFalsy()

    const test9 = proximity.isDirectionWithin90DegreesOfDirection(270, 181)
    expect(test9).toBeTruthy()

    const test10 = proximity.isDirectionWithin90DegreesOfDirection(275, 5)
    expect(test10).toBeTruthy()
  });
});