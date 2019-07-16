
import IManagerOption, { ManagerOptionNames } from "./manager-option";

export class GetFighterSponsored implements IManagerOption{
  name: ManagerOptionNames = 'Get fighter sponsored'
  cost: number = 20

  execute() {
    console.log('executing Get fighter sponsored');
  }


}