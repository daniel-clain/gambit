
import { Subject, Subscription } from "rxjs";
import { RoundController } from "../round-controller";
import gameConfiguration from "../../../game-settings/game-configuration";
import IStage from "../../../interfaces/game/stage";
import { Manager } from "../../manager";
import { RoundStage } from "../../../types/game/round-stage.type";

export default class ManagerOptionsStage implements IStage {

  name: RoundStage = 'Manager Options'
  uIUpdateSubject: Subject<void> = new Subject()
  private endStage
  timeLeft
  private timeLeftInterval
  private timesUpTimer
  private duration
  paused: boolean

  constructor(private roundController: RoundController, private managers: Manager[]){

    this.duration = gameConfiguration.stageDurations.managerOptions
  }

  start(): Promise<void> {
    return new Promise(resolve => {
      this.endStage = resolve
            
      this.timeLeft = this.duration 

      this.timeLeftInterval = this.setCountdownInterval()

      this.timesUpTimer = this.setTimesUpTimeout()
      
      
      if(this.paused)
        this.pause()

      this.roundController.triggerUIUpdate()
    })


  }
  

  private isReady = (manager: Manager) => manager.state.readyForNextFight

  private stageFinished(){
    this.timeLeft = null
    this.roundController.triggerUIUpdate()
    clearInterval(this.timesUpTimer)
    clearInterval(this.timeLeftInterval)
    
    if(!this.endStage){
      debugger
    }
    this.endStage()
  }

  setCountdownInterval(){
    return setInterval(() => {
      this.timeLeft --
      this.roundController.triggerUIUpdate();
      if(
        this.timeLeft == 0 || 
        this.managers.every(this.isReady)
      ){
        this.stageFinished()
      }
    }, 1000)
  }

  setTimesUpTimeout(){
    return setTimeout(this.stageFinished.bind(this), this.timeLeft*1000)
  }


  
  pause(){
    clearInterval(this.timeLeftInterval)
    clearTimeout(this.timesUpTimer)
    this.paused = true
  }

  unpause(){
      this.timeLeftInterval = this.setCountdownInterval()
      this.timesUpTimer = this.setTimesUpTimeout()
      this.paused = false
  }
  
};
