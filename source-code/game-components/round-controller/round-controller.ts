import { Subject } from 'rxjs';
import Fight from '../fight/fight';
import ManagerOptionsStage from './stages/manager-options-stage';
import PreFightNewsStage from './stages/pre-fight-news-stage';
import IStage from '../../interfaces/game/stage';
import FightDayStage from './stages/fight-day-stage';
import { RoundUIState } from '../../interfaces/game/round-state';
import { updateManagersForNewRound } from './new-round-manager-update';
import { doEndOfRoundReset } from './end-of-round-reset';
import { setupNewRound } from './new-round-setup';
import { Game } from '../game';
import { JobSeeker } from '../../interfaces/front-end-state-interface';

export class RoundController {
  roundNumber: number
  activeStage: IStage
  jobSeekers: JobSeeker[]
  activeFight: Fight
  lastFightFighters: string[] = []

  fightUiDataSubject: Subject<void> = new Subject()
  endOfRoundSubject: Subject<void> = new Subject()
  endOfManagerOptionsStageSubject: Subject<void> = new Subject()

  managerOptionsStage: ManagerOptionsStage
  preFightNewsStage: PreFightNewsStage
  fightDayStage: FightDayStage


  constructor(private game: Game) {
    this.managerOptionsStage = new ManagerOptionsStage(this, this.game.has.managers)
    this.preFightNewsStage = new PreFightNewsStage(this)
    this.fightDayStage = new FightDayStage(this, this.game.has.managers)
  }

  startRound(number) {
    let {abilityProcessor} = this.game.has
    this.setUpRound(number)
      .then(() => this.doStage(this.managerOptionsStage))
      .then(() => abilityProcessor.executeAbilities('End Of Manager Options Stage'))
      .then(() => this.doStage(this.preFightNewsStage))
      .then(() => this.doStage(this.fightDayStage))
      .then(() => abilityProcessor.executeAbilities('End Of Round'))
      .then(() => doEndOfRoundReset(this, this.game.has.fighters, this.game.has.professionals))
      .then(() => this.startRound(++number))
  }

  doStage(stage: IStage): Promise<any>{    
    this.activeStage = stage
    return stage.start()
  }

  triggerUIUpdate(){
    this.game.functions.triggerUIUpdate()
  }

  private setUpRound(number) {

    this.roundNumber = number
    const {managers, professionals, fighters} = this.game.has
    setupNewRound(this, professionals, fighters, managers)
    updateManagersForNewRound(this, professionals, fighters, managers)
    this.triggerUIUpdate()
    return Promise.resolve()
  }



  getRoundUIState = (): RoundUIState => {
    return {
      number: this.roundNumber,
      stage: this.activeStage.name,
      jobSeekers: this.jobSeekers,
      managerOptionsTimeLeft: this.managerOptionsStage.timeLeft,
      activeFight: this.activeFight
    }
  }
}