import IManagerOption, { ManagerOptionNames } from "./manager-option";



export class ResearchFighter implements IManagerOption{
  name: ManagerOptionNames = 'Research fighter'
  cost: number = 0
  
  execute() {
    console.log('executing Research fighter');
  }
}