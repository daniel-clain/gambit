
import { Subject, Subscription } from "rxjs";
import Game from "../../game";
import { RoundController } from "../round-controller";
import Manager, { ManagerInfo } from "../../manager";
import gameConfiguration from "../../../game-settings/game-configuration";
import IStage from "../../../interfaces/game/stage";
import RoundStages from "../../../types/game/round-stages";

export default class ManagerOptionsStage implements IStage {

  name: RoundStages = 'Manager Options'
  uIUpdateSubject: Subject<void> = new Subject()
  finished: Subject<void>
  private allManagersReadySubject: Subject<void>
  private managerReadyStateSubscriptions: Subscription[]
  private _timeLeft: number
  private timeLeftInterval
  private timesUpTimer
  private duration
  paused: boolean

  constructor(private game: Game){
    this.duration = gameConfiguration.stageDurations.managerOptions
  }

  start(): void {
    this.finished = new Subject();

    this.setupManagersReadyStateWatchers()

    this.timeLeft = this.duration
    this.timeLeftInterval = setInterval(() => this.timeLeft --, 1000)
    this.timesUpTimer = setTimeout(this.stageFinished.bind(this), this.duration*1000);
    this.allManagersReadySubject.subscribe(this.stageFinished.bind(this))   
    if(this.paused)
      this.pause()
  }

  set timeLeft(val: number){
    this._timeLeft = val
    this.triggerUiUpdate()
  }

  get timeLeft(){
    return this._timeLeft
  }
  
  pause(){
      clearInterval(this.timeLeftInterval)
      clearTimeout(this.timesUpTimer)
      this.paused = true
  }

  unpause(){
      this.timeLeftInterval = setInterval(() => this.timeLeft--, 1000)
      this.timesUpTimer = setTimeout(this.stageFinished.bind(this), this.timeLeft*1000);
      this.paused = false
  }

  private stageFinished(){
    this.timeLeft = null
    clearInterval(this.timesUpTimer)
    clearInterval(this.timeLeftInterval)
    this.tearDownManagersReadyStateSubscriptions()
    this.finished.next()
    this.finished.complete()
  }
  
  private setupManagersReadyStateWatchers(){
    this.allManagersReadySubject = new Subject()
    this.managerReadyStateSubscriptions = this.game.managers.map((manager) => {
      return manager.managerUpdatedSubject.subscribe((managerInfo: ManagerInfo) => {
        if(managerInfo.readyForNextFight)
          this.checkIfAllManagersAreReady()
      })
    })
  }
  
  private tearDownManagersReadyStateSubscriptions(){
    this.allManagersReadySubject.complete()
    this.managerReadyStateSubscriptions.forEach(s => s.unsubscribe())
  }

  private checkIfAllManagersAreReady(){
    let allManagersReady: boolean = this.game.managers.reduce((returnVal: boolean, manager) => {
      if(returnVal == false)
        return false
      return manager.readyForNextFight
    }, true)

    if(allManagersReady){
      this.allManagersReadySubject.next()
    }
  }

  
  

  private triggerUiUpdate(){
    this.uIUpdateSubject.next()
  }

  
};
