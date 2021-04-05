import FighterFighting from "../fighter-fighting";

export const getProbabilityToDoNothing = (fighting: FighterFighting): number => {
  const { logistics, movement } = fighting
  const { aggression, intelligence } = fighting.stats

  if(
    logistics.onARampage ||
    movement.moveActionInProgress
  )
    return 0

  let probability = 30

  probability -= intelligence * 2
  probability -= aggression

  if (probability < 0)
    probability = 0

  return probability

}