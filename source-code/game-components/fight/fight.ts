import FighterFightState from "../../interfaces/game/fighter-fight-state-info"
import { FighterInfo } from "../../interfaces/game-ui-state.interface"
import ManagerWinnings from "../../../manager-winnings"
import { Subject } from "rxjs"
import Fighter from "../fighter/fighter"
import gameConfiguration from "../game-configuration"
import { random } from "../../helper-functions/helper-functions"
import Octagon from "./octagon"
import Coords from '../../interfaces/game/fighter/coords';


export interface FightState{
  startCountdown: number
  timeRemaining: number
  report: FightReport
  fighters: FighterFightState[]
}
export interface FightReport{
  draw?: boolean
  remainingFighters?: FighterInfo[]
  winner?: FighterInfo
  managerWinnings?: ManagerWinnings[]
}

export default class Fight {
  private fightUpdateLoop

  private _report: FightReport = null
  private _timeRemaining: number = null
  private _startCountdown: number = null

  fightFinishedSubject: Subject<FightReport> = new Subject()
  fightStateUpdatedSubject: Subject<FightState> = new Subject()  
  

  private timer
  
  constructor(public fighters: Fighter[]) {    
    fighters.forEach(fighter => fighter.getPutInFight(this))
  }

  doTeardown(){
    this.fightStateUpdatedSubject.complete()
  }

  getOtherFightersInFight(thisFighter: Fighter){
    return this.fighters.filter((fighter: Fighter) => fighter.name != thisFighter.name)
  }

  watchForAWinner(){
    this.fightStateUpdatedSubject.subscribe(() => {
      const knockedOutFighters: Fighter[] = this.getFightersThatArentKnockedOut()
      if(knockedOutFighters.length == 1)
        this.declareWinner(knockedOutFighters[0])
    })
  }

  async start(){
    console.log('fight started');
    
    this.placeFighters()
    await this.fightCountdown()
    this.tellFightersToStartFighting()
    this.startFightUpdateLoop()
    this.watchForAWinner()
    const {maxFightDuration} = gameConfiguration.stageDurations
    this.timer = setTimeout(() => this.timesUp(), maxFightDuration * 1000)
  }

  set time(value: number){
    this._timeRemaining = value
    this.sendUiStateUpdate()
  }  

  private fightCountdown(): Promise<void>{
    return new Promise(resolve => {
      this.startCountdown = 1
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
    this.sendUiStateUpdate()
  }
  get startCountdown(){
    return this._startCountdown
  }

  startFightUpdateLoop(){
    this.fightUpdateLoop = setInterval(this.sendUiStateUpdate.bind(this), 10)
  }

  set report(value: FightReport){
    this._report = value
    this.sendUiStateUpdate()
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
    winningFighter.state.numberOfWins++
    console.log(`congratulations to ${winningFighter.name}, he is the winner!`);
    const fightReport: FightReport = {
      winner: winningFighter.getInfo(),
      draw: false
    }
    this.finishFight(fightReport)
  }

  private finishFight(fightReport){
    clearInterval(this.timer)
    clearInterval(this.fightUpdateLoop)
    this.fightFinishedSubject.next(fightReport)
    this.fighters.forEach(f => f.stopFighting())
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
      fighters: this.fighters.map(fighter => fighter.fighting.getState())
    }
  }


  private getFightersThatArentKnockedOut(){
    return this.fighters.reduce((fighters, fighter) => {
      const fighterNotKnockedOut: boolean = fighter.fighting.getState().modelState !== 'Knocked Out'
      if(fighterNotKnockedOut){
        fighters.push(fighter)
      }
      return fighters
    }, [])
  }

  private placeFighters(){    
    this.fighters.forEach((fighter: Fighter) => {
      let pos: Coords
      while(!pos || !Octagon.checkIfPointIsWithinOctagon(pos)){
        pos = {
          x: random(Octagon.getWidth()),
          y: random(Octagon.getHeight())
        }
      }
      fighter.fighting.setStartPosition(pos)
    })
  }


}