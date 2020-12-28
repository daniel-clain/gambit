
import { Subject, Subscription } from "rxjs";
import { RoundController } from "../round-controller";
import gameConfiguration from "../../../game-settings/game-configuration";
import IStage from "../../../interfaces/game/stage";
import RoundStages from "../../../types/game/round-stage.type";
import { Manager } from "../../manager";

export default class ManagerOptionsStage implements IStage {

  name: RoundStages = 'Manager Options'
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
      
      
      this.timeLeft = 999999999999 //this.duration 


      this.timeLeftInterval = setInterval(() => {
        this.timeLeft --

        if(
          this.timeLeft == 0 || 
          this.managers.every(this.isReady)
        ){
          this.stageFinished()
        }
        //this.roundController.triggerUpdate()
      }, 1000)


      this.timesUpTimer = setTimeout(
        this.stageFinished.bind(this), this.duration*1000
      )
      
      
      if(this.paused)
        this.pause()
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
  
};
