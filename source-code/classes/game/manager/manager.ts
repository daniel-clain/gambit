import IManagerOption from "./managerOptions/manager-option";
import Fighter from "../fighter/fighter";
import { GetFighterSponsored } from "./managerOptions/get-fighter-sponsored";
import { TrainFighter } from "./managerOptions/train-fighter";
import { ResearchFighter } from "./managerOptions/research-fighter";

export default class Manager{  
  playerId: string
  retired: boolean = false
  money: number = 500
  sponsoredFighters: Fighter[] = []
  actionPoints = 3
  options: IManagerOption[] = [
    new GetFighterSponsored(),
    new ResearchFighter(),
    new TrainFighter()
  ]

  constructor(playerId: string){
    this.playerId = playerId
  }
}