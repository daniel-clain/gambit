
import Fight from "../fight/fight";
import Fighter from "../fighter/fighter";
import { shuffle } from "../../../helper-functions/helper-functions";
import { Subject } from 'rxjs';

export interface FightSchedule{
  timeUntilNextFight: number
  fights: Fight[]
  fightActive: boolean
}

export default class FightScheduler{
  fightSchedule: FightSchedule = {
    timeUntilNextFight: null,
    fights: [],
    fightActive: false
  }

  fightScheduleSubject: Subject<void> = new Subject()

  constructor(private allFighters: Fighter[], private numberOfFightersPerFight: number){
    this.addNewFightToSchedule()
    this.startCountdownUntilNextFight()
  }  

  private startCountdownUntilNextFight(){
    const timeUntilNextFight = 40
    this.fightSchedule.timeUntilNextFight = timeUntilNextFight
    const nextFightCountdown = setInterval(() => {
      this.fightSchedule.timeUntilNextFight --  
      this.fightScheduleSubject.next()
    }, 1000)
    setTimeout(() => {
      clearInterval(nextFightCountdown)
      this.startFight()
    }, timeUntilNextFight * 1000)
  }

  private startFight(){
    const nextFight: Fight = this.fightSchedule.fights[0]
    nextFight.start()
    this.fightSchedule.fightActive = true
    nextFight.fightFinishedSubject.subscribe(() => {
      this.fightFinished()
    })
  }

  private fightFinished(){
    this.fightSchedule.fightActive = false
    this.fightSchedule.fights.shift()
    this.addNewFightToSchedule()
    this.startCountdownUntilNextFight()
  }
  
  private addNewFightToSchedule(){
    this.fightSchedule.fights.push(new Fight(this.selectFightFighters()))
  }
  private selectFightFighters(): Fighter[]{
    const selectedFighters: Fighter[] = []
    const shuffledFighters: Fighter[] = shuffle(this.allFighters)
    for(let i = 0; i < this.numberOfFightersPerFight; i++){
      selectedFighters.push(shuffledFighters[i])
    }
    return selectedFighters
  }

}