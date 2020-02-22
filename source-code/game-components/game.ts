
import { RoundController } from "./round-controller/round-controller"
import Fighter from "./fighter/fighter"
import Manager from "./manager"
import { Professional } from "../interfaces/game-ui-state.interface"
import { PlayerInfo } from "../interfaces/player-info.interface"
import { setupGame } from "./game-setup"
import { GameType } from "../types/game/game-type"
import DisplayUpdateCommunicatorGameWebsocket from "./update-communicators/display-update-communicator-game-websocket"
import PlayerUpdateCommunicatorGame from "./update-communicators/player-update-communicator-game"

export default class Game{

  roundController: RoundController
  managers: Manager[]
  fighters: Fighter[]
  professionals: Professional[]
  playersUpdateCommunicators: PlayerUpdateCommunicatorGame[]
  displayUpdateCommunicators: DisplayUpdateCommunicatorGameWebsocket[]

	constructor(gameType: GameType = 'Websockets', playerInfo: PlayerInfo[]) {  
    this.roundController = new RoundController(this)

    setupGame(this, gameType, playerInfo)

    this.startGame()
  }

  private startGame(){
    console.log('game started');
    this.roundController.startRound(1)
  }

    
}