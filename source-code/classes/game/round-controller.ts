import {Subject} from 'rxjs';


import RoundStages from '../../types/game/round-stages';
import gameConfiguration, { GameConfiguration } from './game-configuration';
import Fight from './fight/fight';
import { FightUiState, JobSeeker } from '../../interfaces/game-ui-state.interface';
import Fighter from './fighter/fighter';
import { shuffle } from '../../helper-functions/helper-functions';
export class RoundController{
  number: number
  stage: RoundStages
  jobSeekers: JobSeeker[]
  stageDurations: any
  timeUntilNextFight: number
  timeUntilNextFightSubject: Subject<number> = new Subject()
  fight: Fight
  fightUiStateSubject: Subject<FightUiState> = new Subject()
  private fighters: Fighter[]
  gameConfiguration: GameConfiguration
  //test

  constructor(){
    this.gameConfiguration = gameConfiguration
    this.stageDurations = this.gameConfiguration.stageDurations
    

    const {numberOfFighters, fighterNames} = this.gameConfiguration
    this.fighters = this.getFightersWithRandomNames(numberOfFighters, fighterNames)
  }

  startRound(number){
    this.number = number
    Promise.resolve()
    .then(this.setUpRound.bind(this))
    .then(this.managerOptionsStage.bind(this))
    .then(this.preFightNewsStage.bind(this))
    .then(this.fightDayStage.bind(this))
    .then(this.postFightReportStage.bind(this))
    .then(() => this.startRound(number++))
  }

  private setUpRound(){
    const numOfFighters = this.gameConfiguration.numberOfFightersPerFight
    console.log('xnumOfFighters :', numOfFighters);
    const randomFighters: Fighter[] = []
    for(;randomFighters.length < numOfFighters;console.log('ding')){
      const random = Math.random()
      console.log('random :', random);
      const randomIndex = Math.floor(Math.random() * this.fighters.length)
      console.log('randomIndex :', randomIndex);
      const fighter: Fighter = this.fighters[randomIndex]
      const fighterIsAlreadySlected = randomFighters.some(randomFighter => randomFighter.name == fighter.name)

      if(!fighterIsAlreadySlected)
        console.log('adding fighter');
        randomFighters.push(fighter)
    }

    this.fight = new Fight(randomFighters)
  }

  private managerOptionsStage(){

    this.timeUntilNextFight = this.stageDurations.managerOptions
    this.timeUntilNextFightSubject.next(this.timeUntilNextFight)
    const fightCountdownInterval = setInterval(() => {
      this.timeUntilNextFight --
      this.timeUntilNextFightSubject.next(this.timeUntilNextFight)
    }, 1000
    )
    console.log(`Round ${this.number}. Stage 'Manager Options', `);
    return this.stageDuration(this.stageDurations.managerOptions)
    .then(() => clearInterval(fightCountdownInterval))
  }
  private preFightNewsStage(){
    return this.stageDuration(this.stageDurations.eachNewsSlide)
  }
  private fightDayStage(){
    return this.stageDuration(this.stageDurations.maxFightDuration)
  }
  private postFightReportStage(){
    return this.stageDuration(this.stageDurations.postFightReport)
  }

  stageDuration(duration): Promise<void>{
    return new Promise((resolve, reject) => {
      setTimeout(resolve, duration*1000)
    });
  }

  private getFightersWithRandomNames(amount, randomNames: string[]): Fighter[]{
    const shuffledNames: string[] = shuffle(randomNames)
    const newFighters: Fighter[] = []
    for(;newFighters.length < amount;)
      newFighters.push(new Fighter(shuffledNames.pop()))

    return newFighters
  }
}