import Game from "../game"
import { Socket } from "socket.io"
import { DisplayGameUiData, JobSeekerInfo } from "../../interfaces/game-ui-state.interface"


export default class DisplayUpdateCommunicatorGameWebsocket{
 
  displayGameUiData: DisplayGameUiData = {    
    roundStage: undefined,
    disconnectedPlayerVotes: [],
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
    
    game.disconnectedPlayers.playerDisconnectedSubject.subscribe(this.handleDisconnectedPlayer.bind(this))

    game.roundController.roundStateUpdateSubject.subscribe(this.handleManagerUiUpdate.bind(this))
    
    game.roundController.fightUiDataSubject.subscribe(this.handleFightUiUpdate.bind(this))
    
    game.managers.forEach(manager => 
      manager.managerUpdatedSubject.subscribe(this.handleManagerUiUpdate.bind(this))
    )
  }

  
  handleDisconnectedPlayer(){
    this.displayGameUiData.disconnectedPlayerVotes = this.game.disconnectedPlayers.disconnectedPlayerVotes
    this.sendUpdate()
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
