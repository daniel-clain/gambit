import { Subject, merge } from 'rxjs';
import RoundStages from '../../types/game/round-stage.type';
import Fight from '../fight/fight';
import { JobSeeker } from '../../interfaces/server-game-ui-state.interface';
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

  fightUiDataSubject: Subject<void> = new Subject()
  endOfRoundSubject: Subject<void> = new Subject()
  endOfManagerOptionsStageSubject: Subject<void> = new Subject()

  managerOptionsStage: ManagerOptionsStage
  preFightNewsStage: PreFightNewsStage
  fightDayStage: FightDayStage
  postFightReportStage: PostFightReportStage


  constructor(private game: Game, public triggerUpdate) {
    this.managerOptionsStage = new ManagerOptionsStage(this, game.managers)
    this.preFightNewsStage = new PreFightNewsStage(game, this)
    this.fightDayStage = new FightDayStage(this, game.managers)
    this.postFightReportStage = new PostFightReportStage(game, this)
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
      .then(() => doEndOfRoundReset(this, this.game.fighters, this.game.professionals))
      .then(() => this.startRound(++number))
  }

  doStage(stage: IStage): Promise<any>{    
    console.log(`Stage: ${stage.name}`);
    this.activeStage = stage.name 
    
    return stage.start()
  }

  private setUpRound(number) {
    this.roundNumber = number
    const {managers, professionals, fighters} = this.game
    setupNewRound(this, professionals, fighters, managers)
    updateManagersForNewRound(this, professionals, fighters, managers)
    return Promise.resolve()
  }

  set activeStage(val){
    this._activeStage = val
    this.game.messageSender.triggerUpdate()
  }
  get activeStage(){
    return this._activeStage
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