import { Subject } from 'rxjs';
import Fight from '../abilities-general/fight/fight';
import ManagerOptionsStage from './stages/manager-options-stage';
import PreFightNewsStage from './stages/pre-fight-news-stage';
import IStage from '../../interfaces/game/stage';
import FightDayStage from './stages/fight-day-stage';
import { WeekUIState } from '../../interfaces/game/week-state';
import { doEndOfWeekUpdates } from './end-of-week-updates';
import { setupNewWeek } from './new-week-setup';
import { Game } from '../game';
import { JobSeeker } from '../../interfaces/front-end-state-interface';
import { wait } from '../../helper-functions/helper-functions';
import gameConfiguration from '../../game-settings/game-configuration';

export class WeekController {
  weekNumber: number
  activeStage: IStage
  jobSeekers: JobSeeker[]
  activeFight: Fight
  lastFightFighters: string[] = []
  nextWeekIsEvent = false
  thisWeekIsEvent = false
  videos = gameConfiguration.videos

  fightUiDataSubject: Subject<void> = new Subject()
  endOfWeekSubject: Subject<void> = new Subject()
  endOfManagerOptionsStageSubject: Subject<void> = new Subject()

  managerOptionsStage: ManagerOptionsStage
  preFightNewsStage: PreFightNewsStage
  fightDayStage: FightDayStage


  constructor(private game: Game) {
    this.managerOptionsStage = new ManagerOptionsStage(this.game)
    this.preFightNewsStage = new PreFightNewsStage(this)
    this.fightDayStage = new FightDayStage(this.game)
  }

  startWeek(number) {
    let {abilityProcessor} = this.game.has
    this.setUpWeek(number)
      .then(() => this.doStage(this.managerOptionsStage))
      .then(() => abilityProcessor.executeAbilities('End Of Manager Options Stage'))
      .then(() => this.showVideo())
      .then(() => this.checkFinalTournament())
      .then(() => this.doStage(this.preFightNewsStage))
      .then(() => this.checkDefaultWinner())
      
      .then(() => this.doStage(this.fightDayStage))
      .then(() => abilityProcessor.executeAbilities('End Of Week'))
      .then(() => doEndOfWeekUpdates(this.game))
      .then(() => this.startWeek(++this.weekNumber))
      .catch(e => {
        console.log('catch! ', e);
        this.game.state.gameIsFinished = true
        this.triggerUIUpdate() 
        setTimeout(() => {
          this.game.functions.tearDownGame()          
        }, 20000);
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

  private setUpWeek(number) {

    this.weekNumber = number
    setupNewWeek(this.game)
    return Promise.resolve()
  }

  checkDefaultWinner(): Promise<any>{
    const {managers} = this.game.has
    const nonRetiredPlayers = managers.filter(m => !m.state.retired)
    console.log('checking default winner');
    if(nonRetiredPlayers.length == 1 && managers.length >1){
      const defaultWinner = nonRetiredPlayers[0]
      this.game.state.playerHasVictory = {
        name: defaultWinner.has.name,
        victoryType: 'Default Victory'
      }
      this.game.state.isShowingVideo = this.game.i.getSelectedVideo()
      this.triggerUIUpdate()
      return this.showVideo()
    }
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



  getWeekUIState = (): WeekUIState => {
    return {
      number: this.weekNumber,
      stage: this.activeStage.name,
      jobSeekers: this.jobSeekers,
      managerOptionsTimeLeft: this.managerOptionsStage.timeLeft,
      activeFight: this.activeFight
    }
  }
}