
import { Subject, Subscription } from "rxjs"
import Fighter from "../fighter/fighter"
import gameConfiguration from "../../game-settings/game-configuration"
import { getPointGivenDistanceAndDirectionFromOtherPoint } from "../../helper-functions/helper-functions"
import Octagon from "./octagon"
import Coords from '../../interfaces/game/fighter/coords';
import { FightReport } from "../../interfaces/game/fight-report"
import { FightUiData } from "../../interfaces/game/fight-ui-data"
import Game from "../game"
import Manager from "../manager"
import { ManagersBet } from "../../interfaces/game/managers-bet"
import { Angle } from "../../types/game/angle"



export default class Fight {
  private fightUpdateLoop

  private _report: FightReport = null
  private timeRemaining: number = null
  private _startCountdown: number = null

  fightFinishedSubject: Subject<FightReport> = new Subject()
  fightUiDataSubject: Subject<FightUiData> = new Subject()  

  unpauseSubject: Subject<void> = new Subject()
  paused = false
  

  private timesUpTimer
  private timeRemainingInterval
  
  constructor(public fighters: Fighter[], public game: Game ) {    
    fighters.forEach(fighter => fighter.getPutInFight(this))
  }

  doTeardown(){
    this.fightUiDataSubject.complete()
  }

  getOtherFightersInFight(thisFighter: Fighter){
    return this.fighters.filter((fighter: Fighter) => fighter.name != thisFighter.name)
  }

  watchForAWinner(){
    const watchForWinnerSubscription: Subscription = this.fightUiDataSubject.subscribe(() => {
      const remainingFighters: Fighter[] = this.getFightersThatArentKnockedOut()
      if(remainingFighters.length == 1){
        watchForWinnerSubscription.unsubscribe()
        this.declareWinner(remainingFighters[0])
      }
    })
  }

  async start(){
    console.log('fight started');
    
    this.startFightUpdateLoop()
    this.placeFighters()
    await this.fightCountdown()
    this.tellFightersToStartFighting()
    this.watchForAWinner()
    const {maxFightDuration} = gameConfiguration.stageDurations
    this.timeRemaining = maxFightDuration
    this.timeRemainingInterval = setInterval(() => this.timeRemaining--, 1000)
    this.timesUpTimer = setTimeout(() => this.timesUp(), maxFightDuration * 1000)
    if(this.paused)
      this.pause()
  }
  
  

  pause(){
    clearInterval(this.timeRemainingInterval)
    clearTimeout(this.timesUpTimer)
    this.paused = true
  }

  unpause(){
    this.timeRemainingInterval = setInterval(() => this.timeRemaining--, 1000)
    this.timesUpTimer = setTimeout(() => this.timesUp(), this.timeRemaining * 1000)
    this.paused = false
    this.unpauseSubject.next()
  }

  waitForUnpause(): Promise<void>{
    return new Promise(resolve => {
      const subscription = this.unpauseSubject.subscribe(() => {
        subscription.unsubscribe()
        resolve()
      })
    });
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
    this._startCountdown = value
    this.sendUiStateUpdate()
  }
  get startCountdown(){
    return this._startCountdown
  }

  startFightUpdateLoop(){
    this.fightUpdateLoop = setInterval(this.sendUiStateUpdate.bind(this), 5)
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
    this.report = fightReport
    this.timeRemaining = 0
    clearTimeout(this.timesUpTimer)
    clearInterval(this.timeRemainingInterval)

    
    setTimeout(() => {
      clearInterval(this.fightUpdateLoop)
      this.fightFinishedSubject.next(fightReport)
    }, 2000)
    this.fighters.forEach(f => {
      f.stopFighting()
      f.state.numberOfFights ++
    })
  }

  private tellFightersToStartFighting(){
    this.fighters.forEach(f => f.startFighting())
  }

  sendUiStateUpdate(){
    this.fightUiDataSubject.next(this.fightUiData)
  }

  get fightUiData(): FightUiData{
    return {
      startCountdown: this._startCountdown,
      timeRemaining: this.timeRemaining,
      report: this._report,
      fighters: this.fighters.map(fighter => fighter.fighting.getState()),
      managersBets: !this.game ? undefined : this.game.managers.map((manager: Manager): ManagersBet => {
        return {
          name: manager.name,
          managerImage: manager.image,
          bet: manager.nextFightBet
        }
      })
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
    const angleBetweenEachFighter = 360 / this.fighters.length
    const distanceFromCenter = 150
    const centerPoint: Coords = {
      x: (Octagon.edges.right.point1.x - Octagon.edges.left.point1.x) / 2,
      y: (Octagon.edges.top.point1.y - Octagon.edges.bottom.point1.y) / 2
    }

    this.fighters.forEach((fighter: Fighter, index) => {
      let angle: Angle = 90 + angleBetweenEachFighter * index
      if(angle >= 360)
        angle -= 360
      fighter.fighting.movement.coords = getPointGivenDistanceAndDirectionFromOtherPoint(centerPoint, distanceFromCenter, angle)
    })
  }



}