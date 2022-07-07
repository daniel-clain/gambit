
import { Subject } from "rxjs";
import gameConfiguration from "../../../game-settings/game-configuration";
import IStage from "../../../interfaces/game/stage";
import { Manager } from "../../manager";
import { RoundStage } from "../../../types/game/round-stage.type";
import { check } from "../../../helper-functions/helper-functions";
import { Game } from "../../game";

export default class ManagerOptionsStage implements IStage {

  name: RoundStage = 'Manager Options'
  uIUpdateSubject: Subject<void> = new Subject()
  private endStage
  timeLeft
  private timeLeftInterval
  private timesUpTimer
  private baseDuration: number
  paused: boolean

  constructor(private game: Game){

    this.baseDuration = gameConfiguration.stageDurations.managerOptions
  }

  start(): Promise<void> {
    return new Promise(resolve => {
      this.endStage = resolve

      const duration = this.extendDuration()
            
      this.timeLeft = duration

      this.timeLeftInterval = this.setCountdownInterval()

      this.timesUpTimer = this.setTimesUpTimeout()
      
      
      if(this.paused)
        this.pause()

      this.game.has.roundController.triggerUIUpdate()
    })


  }
  

  private isReady = (manager: Manager) => manager.state.readyForNextFight

  private stageFinished(){
    this.timeLeft = null
    this.game.has.roundController.triggerUIUpdate()
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
      this.game.has.roundController.triggerUIUpdate();
      if(
        this.timeLeft == 0 || 
        this.game.has.managers.every(this.isReady)
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

  private extendDuration(){
    const {roundController, players} = this.game.has
    const extendedDuration = 
      check(roundController.roundNumber, x => [
        [x > 10, 10],
        [x > 15, 20],
        [x > 20, 40]
      ]) +
      check(roundController.activeFight.fighters, x => [
        [x == 3, 10],
        [x == 4, 30],
        [x > 4, 60]
      ]) +
      check(players.length, x => [
        [x == 3, 10],
        [x == 4, 30],
        [x > 4, 50]
      ])
    
    console.log('extendedDuration :>> ', extendedDuration);
    return this.baseDuration + extendedDuration
    
  }
};
