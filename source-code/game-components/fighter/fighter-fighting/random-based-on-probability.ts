
import { randomNumber, selectByProbability } from "../../../helper-functions/helper-functions";
import { ActionName } from "../../../types/fighter/action-name";

export type ActionProbability = {
  action: ActionName, 
  probability: number
}

export function selectRandomResponseBasedOnProbability(responseProbabilities: ActionProbability[]) {
  return selectByProbability(responseProbabilities.map(x => ({...x, option: x.action})))
}
