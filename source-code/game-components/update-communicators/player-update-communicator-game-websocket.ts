
import Manager from "../manager"
import Game from "../game"
import { Socket } from "socket.io"
import PlayerUpdateCommunicatorGame from "./player-update-communicator-game"
import { PlayerGameUiData } from "../../interfaces/game-ui-state.interface"


export default class PlayerUpdateCommunicatorGameWebsocket 
extends PlayerUpdateCommunicatorGame{    
  constructor(
    private socket: Socket,
    game: Game,
    manager: Manager,
    abilityProcessor
  ){
    super(game, manager, abilityProcessor)
    this.socket.on('Action From Player', this.receivePlayerAction.bind(this))

    this.sendGameUiStateUpdate.subscribe((playerGameUiData: PlayerGameUiData) => 
      this.socket.emit('Player Game UI Update', playerGameUiData)
    )
  }  
}
