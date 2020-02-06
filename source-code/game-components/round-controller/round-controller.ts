import { Subject, merge } from 'rxjs';
import RoundStages from '../../types/game/round-stages';
import Fight, { FightState } from '../fight/fight';
import { JobSeeker } from '../../interfaces/game-ui-state.interface';
import Game from '../game';
import ManagerOptionsStage from './stages/manager-options-stage';
import PreFightNewsStage from './stages/pre-fight-news-stage';
import IStage from '../../interfaces/game/stage';
import FightDayStage from './stages/fight-day-stage';
import PostFightReportStage from './stages/post-fight-report-stage';
import { RoundState } from '../../interfaces/game/round-state';
import { updateManagersForNewRound } from './new-round-manager-update';
import { doEndOfRoundReset } from './end-of-round-reset';
import { setupNewRound } from './new-round-setup';


export class RoundController {
  roundNumber: number
  private _activeStage: RoundStages
  jobSeekers: JobSeeker[]
  activeFight: Fight
  lastFightFighters: string[] = []

  roundStateUpdateSubject: Subject<RoundState> = new Subject()
  fightStateUpdatedSubject: Subject<FightState> = new Subject()
  endOfRoundSubject: Subject<void> = new Subject()
  endOfManagerOptionsStageSubject: Subject<void> = new Subject()

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
    ).subscribe(() => this.triggerRoundStateUpdate())
  }

  startRound(number) {
    console.log(`starting round ${number}`);
    this.setUpRound(number)
      .then(() => this.doStage(this.managerOptionsStage))
      .then(() => this.endOfManagerOptionsStageSubject.next())
      .then(() => this.doStage(this.preFightNewsStage))
      .then(() => this.doStage(this.fightDayStage))
      .then(() => this.doStage(this.postFightReportStage))
      .then(() => this.endOfRoundSubject.next())
      .then(() => doEndOfRoundReset(this.game))
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
    setupNewRound(this.game)
    updateManagersForNewRound(this.game)
    return Promise.resolve()
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
      jobSeekers: this.jobSeekers,
      managerOptionsTimeLeft: this.managerOptionsStage.timeLeft,
      activeFight: this.activeFight
    }
  }
}