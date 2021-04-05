import FighterFighting from "../fighter-fighting";
import { getProbabilityForGeneralAttack } from "./getProbabilityForGeneralAttack";

export const getProbabilityToPunch = (fighting: FighterFighting): number  =>{
  const { intelligence } = fighting.stats
  const { logistics, proximity } = fighting
  const closestEnemy = proximity.getClosestRememberedEnemy()


  let probability = 20

  probability += getProbabilityForGeneralAttack(fighting)

  
  if(!logistics.enemyHasLowStamina(closestEnemy))
    probability += 5 + intelligence

  if (probability < 0)
    probability = 0

  return probability
}