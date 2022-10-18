import FighterFighting from "../fighter-fighting";

export const getProbabilityToDoNothing = (fighting: FighterFighting): number => {
  const { logistics, movement, fighter } = fighting
  const { aggression, intelligence } = fighting.stats
  const { onARampage, takingADive, hallucinating} = fighter.state

  if(
    logistics.onARampage ||
    movement.moveActionInProgress
  )
    return 0

  let probability = 30
  
  probability -= aggression * 3
  probability -= intelligence * 3

  if(!onARampage && (takingADive)){
    probability += 20
  }
  if(hallucinating){
    probability += 10
  } 
  

  if (probability < 0)
    probability = 0

  return probability

}