import FighterFighting from "../fighter-fighting";

export const getProbabilityToPunch = (fighting: FighterFighting, generalAttackProbability: number): number =>{
  const { intelligence } = fighting.stats
  const { logistics, proximity, fighter } = fighting
  const closestEnemy = logistics.closestRememberedEnemy

  if(fighter.state.hallucinating) return 1

  let probability = 20

  probability += generalAttackProbability

  
  if(!logistics.enemyHasLowStamina(closestEnemy))
    probability += 5 + intelligence


  if(fighter.state.hallucinating && 
    !proximity.enemyWithinStrikingRange(closestEnemy)){
    probability *= .1
  }

  if (probability < 0)
    probability = 0

  return probability
}