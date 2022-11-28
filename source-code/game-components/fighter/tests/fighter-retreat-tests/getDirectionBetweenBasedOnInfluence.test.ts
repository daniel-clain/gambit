import FighterFighting from "../../fighter-fighting/fighter-fighting"
import { fighterRetreatImplementation } from "../../fighter-fighting/fighter-retreat.i"

const mockFighting = {} as FighterFighting


const {
  publicProperties: {
  }, 
  privateProperties: {
    getDirectionBetweenBasedOnInfluence
  }
} = fighterRetreatImplementation(mockFighting)


describe('getDirectionBetweenInfluencedByDistance', () => {
  
  test(`
    when 
      - direction1 is 90
      - and; direction2 is 180  
      - and; both influences are the same
    expect 
      - returned direction to be between 90 and 180
  `, () => {
    const returnDirection = getDirectionBetweenBasedOnInfluence(
      90, .5, 180, .5, 'attract'
    )
    expect(returnDirection).toBe(135)
  })

  test(`
    when 
      - direction1 is 90
      - and; direction2 is 180  
      - and; direction1 influence is 100%
      - and; direction2 influence is 0%
    expect 
      - returned direction to be 90
  `, () => {
    const returnDirection = getDirectionBetweenBasedOnInfluence(
      90, 1, 180, 0, 'attract'
    )
    expect(returnDirection).toBe(90)
  })

})