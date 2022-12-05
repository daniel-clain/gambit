import FighterFighting from "../fighter-fighting";

export const getProbabilityToDoNothing = (fighting: FighterFighting): number => {
  const { logistics, actions, fighter } = fighting
  const { aggression, intelligence } = fighting.stats
  const { takingADive, hallucinating} = fighter.state

  if(
    logistics.onARampage ||
    actions.currentInterruptibleAction
  )
    return 0

  let probability = 20
  
  probability -= aggression * 3

  if(!logistics.onARampage && (takingADive)){
    probability += 20
  }else{
    probability -= intelligence * 3

  }
  
  if(hallucinating){
    probability += 20
  } 

  if (probability < 0)
    probability = 0

  return probability

}