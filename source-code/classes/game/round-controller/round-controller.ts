import { Subject, merge } from 'rxjs';
import RoundStages from '../../../types/game/round-stages';
import Fight, { FightState } from '../fight/fight';
import { JobSeeker } from '../../../interfaces/game-ui-state.interface';
import Fighter from '../fighter/fighter';
import gameConfiguration from '../game-configuration';
import Game from '../game';
import { shuffle } from '../../../helper-functions/helper-functions';
import ManagerOptionsStage from './stages/manager-options-stage';
import PreFightNewsStage from './stages/pre-fight-news-stage';
import IStage from '../../../interfaces/game/stage';
import FightDayStage from './stages/fight-day-stage';
import PostFightReportStage from './stages/post-fight-report-stage';
import { RoundState } from '../../../interfaces/game/round-state';


export class RoundController {
  roundNumber: number
  private _activeStage: RoundStages
  activeJobSeekers: JobSeeker[]
  gameFinished: boolean
  activeFight: Fight

  roundStateUpdateSubject: Subject<RoundState> = new Subject()
  fightStateUpdatedSubject: Subject<FightState> = new Subject()

  managerOptionsStage: ManagerOptionsStage
  preFightNewsStage: PreFightNewsStage
  fightDayStage: FightDayStage
  postFightReportStage: PostFightReportStage


  constructor(private game: Game) {
    this.managerOptionsStage = new ManagerOptionsStage(game, this)
    this.preFightNewsStage = new PreFightNewsStage(game, this)
    this.fightDayStage = new FightDayStage(game, this)
    this.postFightReportStage = new PostFightReportStage(game, this)

    merge(
      this.managerOptionsStage.uIUpdateSubject,
      this.preFightNewsStage.uIUpdateSubject,
      this.fightDayStage.uIUpdateSubject,
      this.postFightReportStage.uIUpdateSubject
    ).subscribe(() => this.roundStateUpdateSubject.next(this.roundState))
  }

  startRound(number) {
    console.log(`starting round ${number}`);
    this.setUpRound(number)
      .then(() => this.doStage(this.managerOptionsStage))
      .then(() => this.doStage(this.preFightNewsStage))
      .then(() => this.doStage(this.fightDayStage))
      .then(() => this.doStage(this.postFightReportStage))
      .then(() => this.startRound(++number))
  }

  doStage(stage: IStage): Promise<any>{    
    console.log(`Stage: ${stage.name}`);
    this.activeStage = stage.name 
    stage.start()
    return new Promise(resolve => { 
      stage.finished.subscribe(() => {
        resolve()
      })
    });
  }

  private setUpRound(number) {
    this.roundNumber = number
    this.game.managers.forEach(manager => manager.resetForNewRound())
    this.setupRoundFight()
    this.setRoundJobSeekers()

    return Promise.resolve()
  }

  private setupRoundFight() {
    if (this.activeFight != null)
      this.activeFight.doTeardown()

    const numOfFighters = gameConfiguration.numberOfFightersPerFight
    const randomFighters: Fighter[] = []
    for (; randomFighters.length < numOfFighters;) {
      const randomIndex = Math.floor(Math.random() * this.game.fighters.length)
      const fighter: Fighter = this.game.fighters[randomIndex]
      const fighterIsAlreadySlected = randomFighters.some(randomFighter => randomFighter.name == fighter.name)
      if (!fighterIsAlreadySlected)
        randomFighters.push(fighter)
    }
    this.activeFight = new Fight(randomFighters)
    randomFighters.forEach(fighter => fighter.getPutInFight(this.activeFight))

    this.activeFight.fightStateUpdatedSubject.subscribe((fightState: FightState) => {
      this.fightStateUpdatedSubject.next(fightState)
    })
  }


  private setRoundJobSeekers() {
    const { numberOfJobSeekersPerRound } = gameConfiguration
    this.activeJobSeekers = shuffle(this.game.jobSeekers).reduce((jobSeekerArray, jobSeeker, index) => {
      if (index < numberOfJobSeekersPerRound)
        jobSeekerArray.push(jobSeeker)
      return jobSeekerArray
    }, [])
  }

  set activeStage(val){
    this._activeStage = val
    this.triggerRoundStateUpdate()
  }
  get activeStage(){
    return this._activeStage
  }

  triggerRoundStateUpdate(){
    this.roundStateUpdateSubject.next(this.roundState)
  }


  get roundState(): RoundState {
    return {
      number: this.roundNumber,
      stage: this.activeStage,
      activeJobSeekers: this.activeJobSeekers,
      gameFinished: this.gameFinished,
      managerOptionsTimeLeft: this.managerOptionsStage.timeLeft,
      activeFight: this.activeFight
    }
  }
}