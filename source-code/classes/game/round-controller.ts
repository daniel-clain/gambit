import {Subject, Subscription} from 'rxjs';
import RoundStages from '../../types/game/round-stages';
import Fight, { FightReport, FightState } from './fight/fight';
import { JobSeeker } from '../../interfaces/game-ui-state.interface';
import Fighter from './fighter/fighter';
import gameConfiguration, { StageDurations } from './game-configuration';
import ManagerWinnings from '../../../manager-winnings';
import Game from './game';
import Manager, { ManagerInfo } from './manager/manager';
import { Bet } from '../../interfaces/game/bet';
import { timer, shuffle } from '../../helper-functions/helper-functions';

export interface RoundState{
  number: number
  stage: RoundStages
  managerOptionsTimeLeft: number
  gameFinished: boolean
  activeJobSeekers: JobSeeker[]
  activeFight: Fight
}
export class RoundController{
  _roundNumber: number
  _stage: RoundStages
  _activeJobSeekers: JobSeeker[]
  _gameFinished: boolean
  _managerOptionsTimeLeft: number
  _activeFight: Fight

  stageDurations: StageDurations
  roundStateUpdateSubject: Subject<RoundState> = new Subject()
  fightStateUpdatedSubject: Subject<FightState> = new Subject()
  private allManagersReadySubject: Subject<void> = new Subject()
  
  constructor(private game: Game){
    this.stageDurations = gameConfiguration.stageDurations
  }

  startRound(number){
    this.setUpRound(number)
    .then(this.managerOptionsStage.bind(this))
    .then(this.preFightNewsStage.bind(this))
    .then(this.fightDayStage.bind(this))
    .then(this.processManagerBets.bind(this))
    .then(this.postFightReportStage.bind(this))
    .then(() => this.startRound(number++))
  }

  private setUpRound(number){
    this._roundNumber = number
    this.setupRoundFight()
    this.setRoundJobSeekers()

    return Promise.resolve()
  }

  setupRoundFight(){
    const numOfFighters = gameConfiguration.numberOfFightersPerFight
    const randomFighters: Fighter[] = []
    for(;randomFighters.length < numOfFighters;){
      const randomIndex = Math.floor(Math.random() * this.game.fighters.length)
      const fighter: Fighter = this.game.fighters[randomIndex]
      const fighterIsAlreadySlected = randomFighters.some(randomFighter => randomFighter.name == fighter.name)


      if(!fighterIsAlreadySlected)
        randomFighters.push(fighter)
    }

    if(this._activeFight != null)
      this._activeFight.doTeardown()
    this._activeFight = new Fight(randomFighters)
    //this.nextFightFighters = this.fight.fighters.map(f => f.getInfo())
    this._activeFight.fightStateUpdatedSubject.subscribe(
      this.fightStateUpdatedSubject.next.bind(this))
  }
  
  
  setRoundJobSeekers(){
    const {numberOfJobSeekersPerRound} = gameConfiguration
    this._activeJobSeekers = shuffle(this.game.jobSeekers).reduce((accumulator, jobSeeker, index) => {
      if(index < numberOfJobSeekersPerRound)
        accumulator.push(jobSeeker)
      return accumulator
    },[])
    
  }

  private managerOptionsStage(): Promise<void>{
    return new Promise<void>(resolve => {
      const managerStateSubscriptions = this.subscribeToManagersReadyState()
      console.log(`Round ${this._roundNumber}. Stage 'Manager Options', `);

      this.managerOptionsTimeLeft = this.stageDurations.managerOptions
      const managerOptionsTimeLeftInterval = setInterval(() => this.managerOptionsTimeLeft --, 1000)

      let endOfStageTimeout = timer(this.stageDurations.managerOptions)  

      const managerStageFinished = () => {
        this.managerOptionsTimeLeft = null
        managerStateSubscriptions.forEach(s => s.unsubscribe())
        clearInterval(managerOptionsTimeLeftInterval)
        resolve()
      }

      endOfStageTimeout.then(managerStageFinished)      

      this.allManagersReadySubject.subscribe(managerStageFinished)  
    })
  }

  subscribeToManagersReadyState(): Subscription[]{
    return this.game.managers.map((manager) => {
      return manager.managerUpdatedSubject.subscribe((managerInfo: ManagerInfo) => {
        if(managerInfo.readyForNextFight)
          this.checkIfAllManagersAreReady()
      })
    })

  }

  checkIfAllManagersAreReady(){
    let allManagersReady: boolean = this.game.managers.reduce((returnVal: boolean, manager) => {
      if(returnVal == false)
        return false
      return manager.readyForNextFight
    }, true)

    if(allManagersReady){
      this.allManagersReadySubject.next()
    }

  }



  private preFightNewsStage(fightReport: FightReport): Promise<void>{
    console.log('pre fight news');
    return this.stageDuration(0)
    /* this.fight.uiState.preFightNews = this.preFightNews
    this.sendUiStateUpdate()

    return this.stageDuration(this.stageDurations.eachNewsSlide * this.preFightNews.length) */
  }

  private async fightDayStage(): Promise<FightReport>{
    return new Promise(resolve => {
      console.log('fight day');

      this._activeFight.start()

      this._activeFight.fightStateUpdatedSubject.subscribe(
        (fightState: FightState) => {
          console.log('fight update');
        }
      )

      this._activeFight.fightFinishedSubject.subscribe(
        (fightReport: FightReport) => {
          console.log('fight finished');
          resolve(fightReport)
        }
      )
    });
  }

  

  stageDuration(duration): Promise<void>{
    return new Promise((resolve, reject) => {
      setTimeout(resolve, duration*1000)
    });
  }
  
  processManagerBets(fightReport: FightReport): FightReport{
    const {winner} = fightReport

    if(winner){
      const managerWinnings: ManagerWinnings[] = this.game.managers.map(
        (manager: Manager) => {
        let winnings = 0
        const managersBet: Bet = manager.nextFightBet
        if(managersBet.fighterName == winner.name){
          winnings += managersBet.amount*1.6+50
        }
        if(manager.fighters.find((f: Fighter) => f.name == winner.name)){
          winnings +=100
          winnings *= (winner.publicityRating*5+100)/100 
        }
        console.log(`${manager.name} just won ${winnings}`);
        manager.money += winnings        
        
        return {
          managerName: manager.name,
          winnings
        }
      })
    }
    return fightReport
  }


  private postFightReportStage(fightReport: FightReport){
    console.log('post fight reportc');
    return this.stageDuration(0)/* 
    return this.stageDuration(this.stageDurations.postFightReport) */
  }

  set roundNumber(value: number){
    this._roundNumber = value
    this.roundStateUpdateSubject.next(this.roundState)
  }

  set managerOptionsTimeLeft(value: number){
    this._managerOptionsTimeLeft = value
    this.roundStateUpdateSubject.next(this.roundState)
  }

  get managerOptionsTimeLeft(){
    return this._managerOptionsTimeLeft
  }



  get roundState(): RoundState{
    return {
      number: this._roundNumber,
      stage: this._stage,
      activeJobSeekers: this._activeJobSeekers,
      gameFinished: this._gameFinished,
      managerOptionsTimeLeft: this._managerOptionsTimeLeft,
      activeFight: this._activeFight
    }
  }
}