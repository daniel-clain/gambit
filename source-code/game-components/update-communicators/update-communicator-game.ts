
import { Subject } from "rxjs"
import Game from "../game"
import { PlayerGameUiData } from "../../interfaces/game-ui-state.interface"


export default abstract class UpdateCommunicatorGame{
  sendGameUiStateUpdate: Subject<PlayerGameUiData> = new Subject()

  playerGameUiData: PlayerGameUiData = {
    roundStage: 'Manager Options',
    playerPreManagerUiData: {
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
      report: null
    },
  }
  
  constructor(
    protected game: Game,
  ){
    const {roundStateUpdateSubject, fightUiDataSubject} = this.game.roundController
    roundStateUpdateSubject.subscribe(this.sendUpdate.bind(this))
    fightUiDataSubject.subscribe(this.sendUpdate.bind(this))
  }
  

  protected sendUpdate(){
    const {playerManagerUiData} = this.playerGameUiData
    const {activeStage, activeFight, roundState} = this.game.roundController


    if(activeStage == 'Fight Day')
      this.playerGameUiData.fightUiData = activeFight.fightUiData
    
    this.playerGameUiData.roundStage = roundState.stage

    playerManagerUiData.managerOptionsTimeLeft = roundState.managerOptionsTimeLeft
    playerManagerUiData.nextFightFighters = roundState.activeFight.fighters.map(
      fighter => fighter.name)
      playerManagerUiData.jobSeekers = roundState.jobSeekers

    this.sendGameUiStateUpdate.next(this.playerGameUiData)

  }

}
