import { Observable } from "rxjs";
import Fight from "../fight/fight";
import Fighter from "../fighter/fighter";
import { shuffle } from "../../../helper-functions/helper-functions";

interface FightSchedule{
  fights: Fight[]
}

export default class FightScheduler{
  private fightSchedule: Fight[] = []
  private fightScheduleInterval
  private numberOfFightersPerFight = 2
  fightScheduleSubject: Observable<FightSchedule> = new Observable((subscriber) => {

  })
  constructor(private allFighters: Fighter[]){
    this.startSchedulingFights()
  }
  
  addFighterToFight(righterRef: Fighter){
    this.fightSchedule[0].fighters.push(righterRef)
  }
  private startSchedulingFights(){
    this.fightScheduleInterval = setInterval(this.addNewFightToSchedule())
  }
  private addNewFightToSchedule(){
    this.fightSchedule.push(new Fight(this.selectFightFighters()))
  }
  selectFightFighters(): Fighter[]{
    return shuffle(this.allFighters)
  }
}