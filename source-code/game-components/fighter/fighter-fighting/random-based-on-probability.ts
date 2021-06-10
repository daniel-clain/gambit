
import { random } from "../../../helper-functions/helper-functions";
import { ActionName } from "../../../types/fighter/action-name";

export function selectRandomResponseBasedOnProbability(responseProbabilities: [ActionName, number][]): ActionName {

  const totalProbability: number = responseProbabilities.reduce(
    (totalProbability, responseProbability) =>
      totalProbability + responseProbability[1] | 0, 0)

  const randomNum = random(totalProbability, true)
  let probabilityRange: number = 0;

  /* console.log('randomNum :', randomNum);
  for (let responseProbability of responseProbabilities) {
    console.log(responseProbability[0] + ': ' + responseProbability[1]);
  } */

  for (let responseProbability of responseProbabilities) {
    if (
      randomNum > probabilityRange &&
      randomNum <= probabilityRange + responseProbability[1]
    )
      return responseProbability[0]
    else
      probabilityRange += responseProbability[1]
  }
}
