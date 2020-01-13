import Flanking from "./flanking";
import Flanker from "../../../interfaces/game/fighter/flanker";

const flanking = new Flanking(null)
const flanker1: Flanker = {
  type: 'Fighter',
  position: 'Infront',
  name: 'Jim',
  direction: 200,
  distance: 200,
}
const flanker2: Flanker = {
  type: 'Fighter',
  position: 'Infront',
  name: 'Mark',
  direction: 100,
  distance: 100,
}
const flanker3: Flanker = {
  type: 'Edge',
  position: 'Behind',
  name: 'topRight',
  direction: 75,
  distance: 75,
}
const flanker4: Flanker = {
  type: 'Edge',
  position: 'Behind',
  name: 'topRight',
  direction: 50,
  distance: 50,
}
xdescribe('whichFlankersAreClosest', () => {
  it('should return the 2 closest flankers of whats passed in', () => {
    const {closest, secondClosest} = flanking.whichFlankersAreClosest([flanker3, flanker2, flanker1, flanker4])

    expect(closest.distance).toBe(50)
    expect(secondClosest.distance).toBe(75)
  });
});


describe('isFlankedBy2Directions', () => {
  it('should return true if directions are or opposite sides or if 2nd direction is more than 100deg of the 1st on either side', () => {
    const test1 = flanking.isFlankedBy2Directions(270, 80)
    expect(test1).toBeTruthy()

    const test2 = flanking.isFlankedBy2Directions(270, 170)
    expect(test2).toBeTruthy()

    // false because less than 100deg dif
    const test3 = flanking.isFlankedBy2Directions(270, 300)
    expect(test3).toBeFalsy()

    const test4 = flanking.isFlankedBy2Directions(20, 140)
    expect(test4).toBeTruthy()

    // false because less than 100deg dif
    const test5 = flanking.isFlankedBy2Directions(30, 120)
    expect(test5).toBeFalsy()

    const test6 = flanking.isFlankedBy2Directions(0, 170)
    expect(test6).toBeTruthy()

    // true because opposite
    const test7 = flanking.isFlankedBy2Directions(359, 0)
    expect(test7).toBeTruthy()
    const test8 = flanking.isFlankedBy2Directions(179, 180)
    expect(test8).toBeTruthy()
  });
});