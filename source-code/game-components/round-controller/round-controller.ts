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
import { wait } from '../../helper-functions/helper-functions';
import gameConfiguration from '../../game-settings/game-configuration';

export class RoundController {
  roundNumber: number
  activeStage: IStage
  jobSeekers: JobSeeker[]
  activeFight: Fight
  lastFightFighters: string[] = []
  nextWeekIsEvent = false
  thisWeekIsEvent = false
  videos = gameConfiguration.videos

  fightUiDataSubject: Subject<void> = new Subject()
  endOfRoundSubject: Subject<void> = new Subject()
  endOfManagerOptionsStageSubject: Subject<void> = new Subject()

  managerOptionsStage: ManagerOptionsStage
  preFightNewsStage: PreFightNewsStage
  fightDayStage: FightDayStage


  constructor(private game: Game) {
    this.managerOptionsStage = new ManagerOptionsStage(this.game)
    this.preFightNewsStage = new PreFightNewsStage(this)
    this.fightDayStage = new FightDayStage(this.game)
  }

  startRound(number) {
    let {abilityProcessor} = this.game.has
    this.setUpRound(number)
      .then(() => this.doStage(this.managerOptionsStage))
      .then(() => abilityProcessor.executeAbilities('End Of Manager Options Stage'))
      .then(() => this.showVideo())
      .then(() => this.checkFinalTournament())
      .then(() => this.doStage(this.preFightNewsStage))
      .then(() => this.doStage(this.fightDayStage))
      .then(() => abilityProcessor.executeAbilities('End Of Round'))
      .then(() => doEndOfRoundUpdates(this.game))
      .then(() => this.startRound(++this.roundNumber))
      .catch(e => {
        console.log('catch! ', e);
        this.game.state.gameIsFinished = true
        this.game.functions.tearDownGame()
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

  showVideo(): Promise<void>{
    return new Promise(async(resolve, reject) => {
      const {state} = this.game
      if(!state.isShowingVideo){
        return resolve()
      }
      const videoDuration = this.videos.find(v => {
        return v.name == state.isShowingVideo.name
      })
      .videos[state.isShowingVideo.index].duration

      await wait(videoDuration*1000)
      state.isShowingVideo = undefined 
      if(state.playerHasVictory){
        reject('player has victory')
      }
      else if (state.playerHasFailedVictory) {
        state.playerHasFailedVictory = null
        resolve()
      }
      else resolve()
    });

  }

  checkFinalTournament(): Promise<void>{
    return new Promise(async (resolve, reject) => {
      const {state:{finalTournament}, has:{managers}} = this.game
      if(!finalTournament) resolve()
      else {
        await finalTournament.startTournament()
        await this.showVideo().catch(reject)
        
      }      
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

function showVideo(type: any) {
  
}
