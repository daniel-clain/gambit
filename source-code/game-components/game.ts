
import { RoundController } from "./round-controller/round-controller"
import Fighter from "./fighter/fighter"
import Manager from "./manager"
import { Professional, DisconnectedPlayerVote } from "../interfaces/game-ui-state.interface"
import { PlayerInfo } from "../interfaces/player-info.interface"
import { setupGame } from "./game-setup"
import { GameType } from "../types/game/game-type"
import DisplayUpdateCommunicatorGameWebsocket from "./update-communicators/display-update-communicator-game-websocket"
import PlayerUpdateCommunicatorGame from "./update-communicators/player-update-communicator-game"
import PlayerUpdateCommunicatorGameWebsocket from "./update-communicators/player-update-communicator-game-websocket"
import { GameInfo } from "../interfaces/game/game-info"
import DisconnectedPlayers from "./disconnected-players"

export default class Game{
  id: string

  roundController: RoundController

  managers: Manager[]
  fighters: Fighter[]
  professionals: Professional[]

  playersUpdateCommunicators: PlayerUpdateCommunicatorGame[]
  playersUpdateCommunicatorsWebsocket: PlayerUpdateCommunicatorGameWebsocket[]
  displayUpdateCommunicators: DisplayUpdateCommunicatorGameWebsocket[]

  disconnectedPlayers: DisconnectedPlayers = new DisconnectedPlayers(this)

  paused: boolean

	constructor(gameType: GameType = 'Websockets', playerInfo: PlayerInfo[]) {  
    this.id = new Date().getTime().toString()

    this.roundController = new RoundController(this)
    setupGame(this, gameType, playerInfo)


    this.startGame()
  }

  private startGame(){
    console.log('game started');
    this.roundController.startRound(1)
  }


  pauseGame(){
    this.paused = true
    if(this.roundController.activeStage == 'Manager Options')
      this.roundController.managerOptionsStage.pause()
    if(this.roundController.activeStage == 'Fight Day')
      this.roundController.activeFight.pause()
  }

  unPauseGame(){
    this.paused = false
    if(this.roundController.activeStage == 'Manager Options')
      this.roundController.managerOptionsStage.unpause()
    if(this.roundController.activeStage == 'Fight Day')
      this.roundController.activeFight.unpause()
  }

  getGameInfo(): GameInfo{
    
    return {
      id: this.id,
      players: this.playersUpdateCommunicatorsWebsocket.map(player => {
        return {name: player.name, id: player.id}
      }),
      paused: this.paused,
      disconnectedPlayers: this.disconnectedPlayers.disconnectedPlayers,
      round: this.roundController.roundNumber
    }
  }

    
}