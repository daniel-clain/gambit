
import { random } from "../../../helper-functions/helper-functions";
import { PossibleActions } from "../../../types/figher/possible-actions";
import { PossibleAttackResponses } from "../../../types/figher/possible-attack-responses";


  const selectRandomResponseBasedOnProbability = <T = PossibleActions | PossibleAttackResponses>(responseProbabilities: {response: T, probability: number}[]): T => {
    
    const totalProbability: number = responseProbabilities.reduce(
      (totalProbability, responseProbability) => 
      totalProbability + responseProbability.probability, 0)

    const randomNum = random(totalProbability, true)
    let probabilityRange: number = 0;
    
    console.log('randomNum :', randomNum);
    for(let responseProbability of responseProbabilities){
      console.log(responseProbability.response + ': ' + responseProbability.probability);
    }


    for(let responseProbability of responseProbabilities){
      if(
        randomNum > probabilityRange &&
        randomNum <= probabilityRange + responseProbability.probability
      )
        return responseProbability.response
      else
      probabilityRange += responseProbability.probability
    }
  }

  export default selectRandomResponseBasedOnProbability