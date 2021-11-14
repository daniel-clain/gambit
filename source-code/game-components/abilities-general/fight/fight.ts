
import { Subject, Subscription } from "rxjs"
import Fighter from "../../fighter/fighter"
import gameConfiguration from "../../../game-settings/game-configuration"
import { getPointGivenDistanceAndDirectionFromOtherPoint } from "../../../helper-functions/helper-functions"
import Octagon from "./octagon"
import Coords from '../../../interfaces/game/fighter/coords';
import { Angle } from "../../../types/game/angle"
import { Manager } from "../../manager"
import { FightReport, FightUIState, ManagersBet } from "../../../interfaces/front-end-state-interface"



export default class Fight {
  private fightUpdateLoop

  private _report: FightReport = null
  timeRemaining: number = null
  private startCountdown: number = null

  fightFinishedSubject: Subject<FightReport> = new Subject()
  fightUiDataSubject: Subject<FightUIState> = new Subject()  

  unpauseSubject: Subject<void> = new Subject()
  paused = false
  

  private timesUpTimer
  private timeRemainingInterval
  
  constructor(public fighters: Fighter[], public managers?: Manager[] ) {    
    fighters.forEach(fighter => fighter.getPutInFight(this))
  }

  doTeardown(){
    this.fighters.forEach(f => f.state.fight = undefined)
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
    this.placeFighters()
    await this.fightCountdown() 
    this.startFightUpdateLoop()
    this.tellFightersToStartFighting()
    this.watchForAWinner()
    const fightDuration =  gameConfiguration.stageDurations.maxFightDuration + this.fighters.length * gameConfiguration.stageDurations.extraTimePerFighter
    this.timeRemaining = fightDuration
    this.timeRemainingInterval = setInterval(() => this.timeRemaining--, 1000)
    this.timesUpTimer = setTimeout(() => this.timesUp(), fightDuration * 1000)
    if(this.paused)
      this.pause()
  }
  
  

  pause(){
    clearInterval(this.timeRemainingInterval)
    clearTimeout(this.timesUpTimer)
    clearTimeout(this.fightUpdateLoop)
    
    this.paused = true
  }

  unpause(){
    if(this.timeRemaining > 0){
      this.timeRemainingInterval = setInterval(() => this.timeRemaining--, 1000)
      this.timesUpTimer = setTimeout(() => this.timesUp(), this.timeRemaining * 1000)
    }
    this.paused = false
    this.unpauseSubject.next()
  }

  waitForUnpause(): Promise<void>{
    return new Promise(resolve => {
      const subscription = this.unpauseSubject.subscribe(() => {
        subscription.unsubscribe()
        resolve()
        this.startFightUpdateLoop()
      })
    });
  }


  private fightCountdown(): Promise<void>{
    return new Promise(resolve => {
      this.startCountdown = gameConfiguration.stageDurations.startCountdown
      this.sendUiStateUpdate()
      const countdownInterval = setInterval(() => {
        this.startCountdown --
        this.sendUiStateUpdate()
        if(this.startCountdown == 0){
          clearInterval(countdownInterval)
          resolve()
        }
      }, 1000)
    })
  }

  startFightUpdateLoop(){
    this.fightUpdateLoop = setInterval(this.sendUiStateUpdate.bind(this), 20)
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

    this.fighters.forEach(f => {
      f.stopFighting()
      f.state.numberOfFights ++
    })
    
    setTimeout(() => {
      clearInterval(this.fightUpdateLoop)
      this.fightFinishedSubject.next(fightReport)
    }, 2000)
  }

  private tellFightersToStartFighting(){
    this.fighters.forEach(f => f.startFighting())
  }

  sendUiStateUpdate(){
    this.fightUiDataSubject.next(this.fightUiData)
  }

  get fightUiData(): FightUIState{
    return {
      startCountdown: this.startCountdown,
      timeRemaining: this.timeRemaining,
      report: this._report,
      fighterFightStates: this.fighters.map(fighter => fighter.fighting.getState()),
      managersBets: this.managers?.map((manager: Manager): ManagersBet => {
        return {
          name: manager.has.name,
          image: manager.has.image,
          bet: manager.has.nextFightBet
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