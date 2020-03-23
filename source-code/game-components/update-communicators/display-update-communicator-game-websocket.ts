import Game from "../game"
import UpdateCommunicatorGame from "./update-communicator-game"
import { Socket } from "socket.io"
import { DisplayGameUiData, JobSeekerInfo } from "../../interfaces/game-ui-state.interface"
import { RoundState } from "../../interfaces/game/round-state"

export default class DisplayUpdateCommunicatorGameWebsocket{
 
  displayGameUiData: DisplayGameUiData = {    
    roundStage: undefined,
    displayManagerUiData: {      
      roundStage: undefined,
      timeLeft: undefined,
      managersDisplayInfo: undefined,
      nextFightFighters: undefined,
      jobSeekers: undefined
    },
    preFightNewsUiData: {newsItems: []},
    fightUiData: {
      startCountdown: undefined,
      timeRemaining: undefined,
      fighters: [],
      report: undefined,
      managersBets: undefined
    },
  }
  
  constructor(private socket: Socket, private game: Game){
    game.roundController.roundStateUpdateSubject.subscribe(this.handleManagerUiUpdate.bind(this))
    
    game.roundController.fightUiDataSubject.subscribe(this.handleFightUiUpdate.bind(this))
    
    game.managers.forEach(manager => 
      manager.managerUpdatedSubject.subscribe(this.handleManagerUiUpdate.bind(this))
    )
  }

  handleManagerUiUpdate(){

    const {displayManagerUiData, preFightNewsUiData} = this.displayGameUiData
    const {roundState, preFightNewsStage} = this.game.roundController
    const {managerOptionsTimeLeft, jobSeekers, activeFight, stage} = roundState

    
    
    if(stage == 'Pre Fight News')
      preFightNewsUiData.newsItems = preFightNewsStage.newsItems

    displayManagerUiData.timeLeft = managerOptionsTimeLeft
    displayManagerUiData.jobSeekers = jobSeekers.map((jobSeeker): JobSeekerInfo => ({name: jobSeeker.name, type: jobSeeker.type == 'Professional' ? jobSeeker.profession : 'Fighter'}))
    displayManagerUiData.nextFightFighters = activeFight.fighters.map(fighter => fighter.name)
    displayManagerUiData.managersDisplayInfo = this.game.managers.map(manager => ({
      name: manager.name, 
      ready: manager.readyForNextFight, 
      image: 'Fat Man',
      bet: manager.nextFightBet
    }))

    this.sendUpdate()

  }

  handleFightUiUpdate(){
    this.displayGameUiData.fightUiData = this.game.roundController.activeFight.fightUiData

    this.sendUpdate()
  }

  sendUpdate(){
    this.displayGameUiData.roundStage = this.game.roundController.roundState.stage
    this.socket.emit('Display Game UI Update', this.displayGameUiData)
  }
  

}
