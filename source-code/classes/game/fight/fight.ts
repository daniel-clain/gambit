
import {fighterModelImages} from './../../../client/images/fighter/fighter-model-images';
import {FighterInfo} from './../../../interfaces/game-ui-state.interface';
import {Subject, Subscription} from 'rxjs';

import FightUpdateLoop from "./fight-update-loop";
import Fighter from "../fighter/fighter";
import ArenaDimensions from "../../../interfaces/game/fighter/arena-dimensions";
import gameConfiguration from '../game-configuration';
import FighterModelImage from '../../../interfaces/game/fighter/fighter-model-image';
import { random } from '../../../helper-functions/helper-functions';
import ManagerWinnings from '../../../../manager-winnings';
import FighterFightStateInfo from '../../../interfaces/game/fighter-fight-state-info';
import Octagon from '../../../client/components/fight-ui/octagon';
import Position from '../../../interfaces/game/fighter/position';

export interface FightState{
  startCountdown: number
  timeRemaining: number
  report: FightReport
  fighters: FighterFightStateInfo[]
}
export interface FightReport{
  draw?: boolean
  remainingFighters?: FighterInfo[]
  winner?: FighterInfo
  managerWinnings?: ManagerWinnings[]
}

export default class Fight {
  private fightUpdateLoop: FightUpdateLoop
  private fighterUpdateSubscriptions: Subscription[]
  fighters: Fighter[] = []

  private _report: FightReport = null
  private _timeRemaining: number = null
  private _startCountdown: number = null

  fightFinishedSubject: Subject<FightReport> = new Subject()
  fightStateUpdatedSubject: Subject<FightState> = new Subject()
  
  arenaDimensions: ArenaDimensions = {
    width: 600,
    height: 330,
    upFromBottom: 293,
    outFromLeft: 317
  }

  private timer
  
  constructor(fighters: Fighter[]) {
    this.fighters = fighters
  }

  doTeardown(){
    this.fightStateUpdatedSubject.complete()
  }

  getOtherFightersInFight(thisFighter: Fighter){
    return this.fighters.filter((fighter: Fighter) => fighter.name != thisFighter.name)
  }

  setupFighterEventListeners(){
    this.fighterUpdateSubscriptions = this.fighters.map(
      (fighter: Fighter) => {
      return fighter.state.fighterStateUpdatedSubject.subscribe(() => {
        this.sendUiStateUpdate()
        const fers: Fighter[] = this.getFightersThatArentKnockedOut()
        if(fers.length == 1)
          this.declareWinner(fers[0])
      })
    })
  }

  async start(){
    console.log('fight started');
    this.setupFighterEventListeners()
    
    this.placeFighters()
    this.handleFighterUpdates()
    await this.fightCountdown()
    this.tellFightersToStartFighting()
    const {maxFightDuration} = gameConfiguration.stageDurations
    this.timer = setTimeout(() => this.timesUp(), maxFightDuration * 1000)
    //this.fighters[0].state.knockedOut = true
  }

  set timeRemaining(value: number){
    this._timeRemaining = value
    this.fightStateUpdatedSubject.next(this.fightState)
  }  

  private fightCountdown(): Promise<void>{
    return new Promise(resolve => {
      this.startCountdown = 3
      const countdownInterval = setInterval(() => {
        this.startCountdown --
        if(this.startCountdown == 0){
          clearInterval(countdownInterval)
          resolve()
        }
      }, 1000)
    })
  }

  set startCountdown(value: number){
    console.log('value :', value);
    this._startCountdown = value
    this.fightStateUpdatedSubject.next(this.fightState)
  }
  get startCountdown(){
    return this._startCountdown
  }

  set report(value: FightReport){
    this._report = value
    this.fightStateUpdatedSubject.next(this.fightState)
  }

  timesUp(){
    const remainingFighters = this.getFightersThatArentKnockedOut().map(
      (fighter: Fighter) => fighter.getInfo()
    )
    const fightReport: FightReport = {
      remainingFighters,
      draw: true
    }
    console.log(`The fight was a draw between ${remainingFighters.map((f, i) => i == 0 ? f.name : ' and ' + f.name)}`);
    this.finishFight(fightReport)
  }

  declareWinner(winningFighter: Fighter){
    winningFighter.attributes.numberOfWins++
    console.log(`congratulations to ${winningFighter.name}, he is the winner!`);
    const fightReport: FightReport = {
      winner: winningFighter.getInfo(),
      draw: false
    }
    this.finishFight(fightReport)
  }

  private finishFight(fightReport){
    this.fightFinishedSubject.next(fightReport)
    console.log('unsubscribing from fighter updates');
    this.fighterUpdateSubscriptions.forEach((s: Subscription) => s.unsubscribe())
    this.fightFinishedSubject.complete()
    this.fighters.forEach(f => f.stopFighting())
  }

  private tellFightersToStartFighting(){
    this.fighters.forEach(f => f.startFighting())
  }

  sendUiStateUpdate(){
    console.log(' send ui state update triggered');
    //this.fightStateUpdatedSubject.next(this.fightState)
  }

  get fightState(): FightState{
    return {
      startCountdown: this._startCountdown,
      timeRemaining: this._timeRemaining,
      report: this._report,
      fighters: this.fighters.map(f => f.getFighterFightStateInfo())
    }
  }

  private handleFighterUpdates(){
      
  }

  private getFightersThatArentKnockedOut(){
    return this.fighters.filter(f => !f.state.knockedOut)
  }

  private placeFighters(){    
    this.fighters.forEach((fighter: Fighter) => {
      const modelHeight: number = fighterModelImages.find((image: FighterModelImage) => image.modelState == 'Idle').dimensions.height
      let pos: Position
      console.log(Octagon.balls());
      while(!pos || !Octagon.checkIfPointIsWithinOctagon(pos)){
        pos = {
          x: random(Octagon.getWidth()),
          y: random(Octagon.getHeight())
        }
        console.log('pos :', pos);
      }
      fighter.state.position = pos
    })
  }


}