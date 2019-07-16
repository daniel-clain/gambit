import Fighter from "./fighter/fighter";
import { shuffle } from "../../helper-functions/helper-functions";

export default class GameImplementationCode{

  randomNames=['Daniel', 'Tomasz', 'Hassan', 'Dardan', 'Alex', 'Angelo', 'Paul', 'Suleman', 'Mark', 'Mat', 'Mike']

  getFightersWithRandomNames(amount): Fighter[]{
    const randomNames = [...this.randomNames]
    return Array(amount).map(() => new Fighter(shuffle(randomNames).pop()))
  }

}