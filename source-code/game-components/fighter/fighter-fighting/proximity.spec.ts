import Proximity from "./proximity";
import Fighter from "../fighter";
import Coords from "../../../interfaces/game/fighter/coords";
import Direction360 from "../../../types/figher/direction-360";
import { fighterModelImages } from "../../../client/images/fighter/fighter-model-images";

describe('proximity', () => {
  const fighterBob = new Fighter('Bob')
  const fighterFred = new Fighter('Fred')
  const bobProximity = new Proximity(fighterBob.fighting)


  it('should return distance between 2 fighters', () => {
    fighterBob.fighting.coords = {x: 100, y: 0}
    fighterFred.fighting.coords = {x: 0, y: 0}
    const halfFredWidth = fighterModelImages.find(modelImage => modelImage.modelState == fighterFred.fighting.modelState).dimensions.width / 2
    const distance = bobProximity.getFighterDistanceAway(fighterFred)
    expect(distance).toBe(100 - halfFredWidth)    
  })

  

  
  it('should return degrees direction of point 2 from point 1', () => {
    
    fighterBob.fighting.coords = {x: 300, y: 100}
    fighterFred.fighting.coords = {x: 100, y: 300}
    const direction: Direction360 = bobProximity.getDirectionOfPosition2FromPosition1(
      fighterBob.fighting.coords,
      fighterFred.fighting.coords
    )
    expect(direction).toBe(315)    
  })

  it('should return degrees direction passed fighter from this fighter', () => {
    
    fighterBob.fighting.coords = {x: 300, y: 500}
    fighterFred.fighting.coords = {x: 100, y: 300}
    const direction: Direction360 = bobProximity.getDirectionOfFighter(
      fighterFred
    )
    expect(direction).toBe(225)   

    const direction2: Direction360 = bobProximity.getDirectionOfFighter(
      fighterFred, true
    )
    expect(direction2).toBe(45)  
  })

})