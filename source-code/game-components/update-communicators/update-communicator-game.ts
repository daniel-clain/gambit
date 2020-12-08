
import { Subject } from "rxjs"
import Game from "../game"
import Manager from "../manager"
import FighterFightState from "../../interfaces/game/fighter-fight-state-info"


export default abstract class UpdateCommunicatorGame{
 
  sendGameUiStateUpdate: Subject<PlayerGameUiData> = new Subject()

  playerGameUiData: PlayerGameUiData = {
    roundStage: 'Manager Options',
    //disconnectedPlayerVotes: [],
    postFightReportData: {
      notifications: []
    },
    playerManagerUiData: {
      managerInfo: null,
      managerOptionsTimeLeft: null,
      nextFightFighters: [],
      jobSeekers: [],
      delayedExecutionAbilities: []
    },
    preFightNewsUiData: {
      newsItems: []
    },
    fightUiData: {
      startCountdown: null,
      timeRemaining: null,
      fighters: [],
      report: null,
      managersBets: []
    },
  }
  
  constructor(
    protected game: Game,
    protected manager: Manager
  ){
    const {roundStateUpdateSubject, fightUiDataSubject} = this.game.roundController
    roundStateUpdateSubject.subscribe(this.sendUpdate.bind(this))
    fightUiDataSubject.subscribe(this.sendUpdate.bind(this))
  }
  

  protected sendUpdate(){
    const {playerManagerUiData} = this.playerGameUiData
    const {activeStage, activeFight, roundState, preFightNewsStage} = this.game.roundController

    
    if(activeStage == 'Pre Fight News')
      this.playerGameUiData.preFightNewsUiData.newsItems = preFightNewsStage.newsItems


    if(activeStage == 'Fight Day'){
      this.playerGameUiData.fightUiData = activeFight.fightUiData
      this.playerGameUiData.fightUiData.fighters = this.playerGameUiData.fightUiData.fighters.map((fighter): FighterFightState => {

        const managersFighter = this.manager.fighters.find(managersFighter => managersFighter.name == fighter.name)
        if(managersFighter){
          const fighterInfo = managersFighter.getInfo()
          return {
            ...fighter,
            managerKnownStats: {
              strength: {lastKnownValue: fighterInfo.strength, roundsSinceUpdated: undefined},
              fitness: {lastKnownValue: fighterInfo.fitness, roundsSinceUpdated: undefined},
              aggression: {lastKnownValue: fighterInfo.aggression, roundsSinceUpdated: undefined},
              intelligence: {lastKnownValue: fighterInfo.intelligence, roundsSinceUpdated: undefined},
              numberOfWins: {lastKnownValue: fighterInfo.numberOfWins, roundsSinceUpdated: undefined},
              numberOfFights: {lastKnownValue: fighterInfo.numberOfFights, roundsSinceUpdated: undefined},
              manager: {lastKnownValue: fighterInfo.manager, roundsSinceUpdated: undefined}
            }
          }
        }
        const managerKnownFighter = this.manager.knownFighters.find(managerKnownFighter => managerKnownFighter.name == fighter.name)
        if(managerKnownFighter){
          return {
            ...fighter,
            managerKnownStats: managerKnownFighter.knownStats
          }
        }
        return fighter


      })
    }

    if(activeStage == 'Post Fight Report'){
      this.playerGameUiData.postFightReportData.notifications = this.manager.postFightReportItems
    }
    
    this.playerGameUiData.roundStage = roundState.stage

    playerManagerUiData.managerOptionsTimeLeft = roundState.managerOptionsTimeLeft
    playerManagerUiData.nextFightFighters = roundState.activeFight.fighters.map(
      fighter => fighter.name)
      playerManagerUiData.jobSeekers = roundState.jobSeekers

    this.sendGameUiStateUpdate.next(this.playerGameUiData)

  }

}
