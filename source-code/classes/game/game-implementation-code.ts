import Fighter from "./fighter/fighter";
import { shuffle } from "../../helper-functions/helper-functions";

export default class GameImplementationCode{


  getFightersWithRandomNames(amount, randomNames: string[]): Fighter[]{
    return Array(amount).map(() => new Fighter(shuffle(randomNames).pop()))
  }

}