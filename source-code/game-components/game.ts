
import { RoundController } from "./round-controller/round-controller"
import Fighter from "./fighter/fighter"
import Manager from "./manager/manager"
import { Professional } from "../interfaces/game-ui-state.interface"
import { PlayerInfo } from "../interfaces/player-info.interface"
import UpdateCommunicatorGame from "./update-communicator-game"
import { setupGame } from "./game-setup"
import { GameType } from "../types/game/game-type"

export default class Game{

  roundController: RoundController
  managers: Manager[]
  fighters: Fighter[]
  professionals: Professional[]
  playersUpdateCommunicators: UpdateCommunicatorGame[]

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