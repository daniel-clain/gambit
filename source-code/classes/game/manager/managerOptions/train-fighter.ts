
import IManagerOption, { ManagerOptionNames } from "./manager-option";

export class TrainFighter implements IManagerOption{
  name: ManagerOptionNames = 'Train fighter'
  cost: number = 20

  
  execute() {
    console.log('executing Train fighter');
  }


}