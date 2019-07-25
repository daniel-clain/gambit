import {Subject} from 'rxjs';
import {ManagerUiState, FighterInfo} from './../../../interfaces/client-ui-state.interface';
import IManagerOption from "./managerOptions/manager-option";
import Fighter from "../fighter/fighter";
import { GetFighterSponsored } from "./managerOptions/get-fighter-sponsored";
import { TrainFighter } from "./managerOptions/train-fighter";
import { ResearchFighter } from "./managerOptions/research-fighter";
import FightScheduler from '../fight-scheduler/fight-scheduler';
import Player from '../player';

export default class Manager{  

  retired: boolean = false
  money: number = 500
  clientFighters: Fighter[] = []
  actionPoints = 3
  options: IManagerOption[] = [
    new GetFighterSponsored(),
    new ResearchFighter(),
    new TrainFighter()
  ]

  uiStateSubject: Subject<ManagerUiState> = new Subject()

  constructor(private player: Player, private fightScheduler: FightScheduler){
    this.fightScheduler.fightScheduleSubject.subscribe(() => this.onFightScheduleUpdate())
  }

  getUiState(): ManagerUiState{
    const {timeUntilNextFight, fights} = this.fightScheduler.fightSchedule
    const fightersInNextFight: FighterInfo[] = fights[0].fighters.map(
      (fighter: Fighter): FighterInfo => ({
        name: fighter.name,
        numberOfFights: fighter.numberOfFights,
        numberOfWins: fighter.numberOfWins,
        speed: fighter.attributes.speed,
        strength: fighter.attributes.strength
      })
    )


    const clientFighters: FighterInfo[] = this.clientFighters.map(
      (fighter: Fighter): FighterInfo => ({
        name: fighter.name,
        numberOfFights: fighter.numberOfFights,
        numberOfWins: fighter.numberOfWins,
        speed: fighter.attributes.speed,
        strength: fighter.attributes.strength
      })
    )
    const managerUiState: ManagerUiState = {
      timeUntilNextFight,
      money: this.money,
      actionPoints: this.actionPoints,
      clientFighters,
      fightersInNextFight,
      actionLog: []
    }
    return managerUiState
  }

  onFightScheduleUpdate(){
    this.player.managerUiUpdate(this.getUiState())
  }
}