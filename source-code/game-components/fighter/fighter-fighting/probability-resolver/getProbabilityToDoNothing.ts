import FighterFighting from "../fighter-fighting";

export const getProbabilityToDoNothing = (fighting: FighterFighting): number => {
  const { logistics, movement, fighter } = fighting
  const { aggression, intelligence } = fighting.stats
  const { onARampage, takingADive} = fighter.state

  if(
    logistics.onARampage ||
    movement.moveActionInProgress
  )
    return 0

  let probability = 30
  
  probability -= aggression

  if(!onARampage && takingADive){
    probability += 30
  } else {
    probability -= intelligence * 2
  }
  

  if (probability < 0)
    probability = 0

  return probability

}