import {GameConfiguration} from './../game-configuration';
import {Bet} from './../../../interfaces/game/bet';
import {BetOnFighter} from './../manager/manager-options/manager-option';
import FighterState, {IFighterUIState} from './../fighter/fighter-state';
import {fighterModelImages} from './../../../client/images/fighter/fighter-model-images';
import {FightUiState, FighterInfo} from './../../../interfaces/game-ui-state.interface';
import {Subject, Subscription} from 'rxjs';

import FightUpdateLoop from "./fight-update-loop";
import Fighter from "../fighter/fighter";
import ArenaDimensions from "../../../interfaces/game/fighter/arena-dimensions";
import gameConfiguration from '../game-configuration';
import FighterModelImage from '../../../interfaces/game/fighter/fighter-model-image';
import { random } from '../../../helper-functions/helper-functions';
import ManagerWinnings from '../../../../manager-winnings';
import FighterFightStateInfo from '../../../interfaces/game/fighter-fight-state-info';

export interface FightState{
  startCountdown: number
  timeRemaining: number
  finished: boolean
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
  fighters: Fighter[] = []
  stageDurations

  _report: FightReport
  _finished: boolean
  _timeRemaining: number
  _startCountdown: number

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
    this.stageDurations = gameConfiguration.stageDurations
    //this.fightUpdateLoop = new FightUpdateLoop(this)

  }

  doTeardown(){
    this.fightStateUpdatedSubject.complete()
  }
  resetFighters(){

  }
  resetFight(){

  }

  getOtherFightersInFight(thisFighter: Fighter){
    return this.fighters.filter((fighter: Fighter) => fighter.name != thisFighter.name)
  }

  setupFighterEventListeners(){
    const fighterUpdateSubscriptions: Subscription[] = this.fighters.map(
      (fighter: Fighter) => {
      return fighter.state.fighterStateUpdatedSubject.subscribe(() => {
        this.sendUiStateUpdate()
        const fers: Fighter[] = this.getFightersThatArentKnockedOut()
        if(fers.length == 1)
          this.declareWinner(fers[0])
      })
    })
    this.fightFinishedSubject.subscribe(() => fighterUpdateSubscriptions.forEach(s => s.unsubscribe))
  }

  

  start(): Promise<FightReport>{
    console.log('fight started');
    this.setupFighterEventListeners()
    return this.startFight()
  }

  private startFight(): Promise<FightReport>{
    return new Promise(async (resolve, reject) => {
      
      console.log('fightEventStage');
      
      this.placeFighters()
      await this.fightCountdown()
      this.handleFighterUpdates()
      this.tellFightersToStartFighting()
      this.fightFinishedSubject.subscribe(resolve)

      this.timer = setTimeout(() => this.timesUp().then(resolve), this.stageDurations.fight)
      
    });
  }

  set timeRemaining(value: number){
    this._timeRemaining = value
    this.fightStateUpdatedSubject.next(this.fightState)
  }

  set startCountdown(value: number){
    this._startCountdown = value
    this.fightStateUpdatedSubject.next(this.fightState)
  }
  set report(value: FightReport){
    this._report = value
    this.fightStateUpdatedSubject.next(this.fightState)
  }
  set finished(value: boolean){
    this._finished = value
    this.fightStateUpdatedSubject.next(this.fightState)
  }

  timesUp(): Promise<FightReport>{
    const remainingFighters = this.getFightersThatArentKnockedOut().map(
      (fighter: Fighter) => fighter.getInfo()
    )
    const fightReport: FightReport = {
      remainingFighters,
      draw: true
    }
    console.log(`The fight was a draw between ${remainingFighters.map((f, i) => i == 0 ? f.name : ' and ' + f.name)}`);
    this.finishFight(fightReport)
    return Promise.resolve(fightReport)  
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
    this.fightFinishedSubject.complete()
    this.fighters.forEach(f => f.stopFighting())
  }

  fightCountdown(): Promise<void>{
    return new Promise(timesUp => setTimeout(timesUp, 3000))
  }

  private tellFightersToStartFighting(){
    this.fighters.forEach(f => f.startFighting())
  }

  sendUiStateUpdate(){
    this.fightStateUpdatedSubject.next(this.fightState)
  }

  get fightState(): FightState{
    return {
      startCountdown: this._startCountdown,
      timeRemaining: this._timeRemaining,
      report: this._report,
      finished: this._finished,
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
      fighter.state.position.x = random(this.arenaDimensions.width) + this.arenaDimensions.outFromLeft
      fighter.state.position.y = random(this.arenaDimensions.height - modelHeight) + this.arenaDimensions.upFromBottom + modelHeight
    })
  }


}