import { getDirectionOfPosition2FromPosition1 } from "./helper-functions";

describe('getDirectionOfPosition2FromPosition1', () => {
  it('should return the correct direction between 0 and 359', () => {
    const test1 = getDirectionOfPosition2FromPosition1(
      {x: 300, y: 300}, {x: 200, y: 300})
    expect(test1).toBe(270)

    const test2 = getDirectionOfPosition2FromPosition1(
      {x: 300, y: 300}, {x: 300, y: 400})
    expect(test2).toBe(0)

    const test3 = getDirectionOfPosition2FromPosition1(
      {x: 300, y: 300}, {x: 200, y: 200})
    expect(test3).toBe(225)

    const test4 = getDirectionOfPosition2FromPosition1(
      {x: 300, y: 300}, {x: 300, y: 300})
    expect(test4).toBe(0)

    const test5 = getDirectionOfPosition2FromPosition1(
      {x: 9, y: 202}, {x: 7, y: 202})
    expect(test5).toBe(270)
    
    const test6 = getDirectionOfPosition2FromPosition1(
      {x: 627, y: 122}, {x: 626, y: 242})
    expect(test6).toBe(0)
  });
});