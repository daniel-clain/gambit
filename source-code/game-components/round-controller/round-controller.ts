import { Subject } from 'rxjs';
import Fight from '../abilities-general/fight/fight';
import ManagerOptionsStage from './stages/manager-options-stage';
import PreFightNewsStage from './stages/pre-fight-news-stage';
import IStage from '../../interfaces/game/stage';
import FightDayStage from './stages/fight-day-stage';
import { RoundUIState } from '../../interfaces/game/round-state';
import { doEndOfRoundUpdates } from './end-of-round-updates';
import { setupNewRound } from './new-round-setup';
import { Game } from '../game';
import { JobSeeker } from '../../interfaces/front-end-state-interface';
import TryToWinVideoStage from './stages/try-to-win-video-stage';
import { FinalTournament } from './final-tournament/final-tournament';

export class RoundController {
  roundNumber: number
  activeStage: IStage
  jobSeekers: JobSeeker[]
  activeFight: Fight
  lastFightFighters: string[] = []
  nextWeekIsEvent = false
  thisWeekIsEvent = false

  fightUiDataSubject: Subject<void> = new Subject()
  endOfRoundSubject: Subject<void> = new Subject()
  endOfManagerOptionsStageSubject: Subject<void> = new Subject()

  managerOptionsStage: ManagerOptionsStage
  preFightNewsStage: PreFightNewsStage
  tryToWinVideo: TryToWinVideoStage
  fightDayStage: FightDayStage


  constructor(private game: Game) {
    this.managerOptionsStage = new ManagerOptionsStage(this, this.game.has.managers)
    this.preFightNewsStage = new PreFightNewsStage(this)
    this.fightDayStage = new FightDayStage(this, this.game.has.managers)
    this.tryToWinVideo = new TryToWinVideoStage(this.game)
  }

  startRound(number) {
    let {abilityProcessor} = this.game.has
    this.setUpRound(number)
      .then(() => this.doStage(this.managerOptionsStage))
      .then(() => abilityProcessor.executeAbilities('End Of Manager Options Stage'))
      .then(() => this.checkTryToWin())
      .then(() => this.checkFinalTournament())
      .then(() => this.doStage(this.preFightNewsStage))
      .then(() => this.doStage(this.fightDayStage))
      .then(() => abilityProcessor.executeAbilities('End Of Round'))
      .then(() => doEndOfRoundUpdates(this.game))
      .then(() => this.startRound(++this.roundNumber))
      .catch(e => {
        console.log('catch! ', e);
      })
  }

  doStage(stage: IStage): Promise<any>{    
    this.activeStage = stage
    this.triggerUIUpdate()
    return stage.start()
  }

  triggerUIUpdate(){
    this.game.functions.triggerUIUpdate()
  }

  private setUpRound(number) {

    this.roundNumber = number
    setupNewRound(this.game)
    return Promise.resolve()
  }

  checkTryToWin(): Promise<void>{
    return new Promise(async(resolve, reject) => {
      const {playerHasVictory} = this.game.state
      if(playerHasVictory){
        await this.doStage(this.tryToWinVideo)
        reject('player has victory')
      }
      else resolve()
    });

  }

  checkFinalTournament(): Promise<void>{
    return new Promise((resolve, reject) => {
      const {finalTournament} = this.game.state
      if(!finalTournament) resolve()
      reject('final tournament')

      finalTournament.startTournament()
      
    });
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