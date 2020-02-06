import { GameUiState } from "../interfaces/game-ui-state.interface"
import Manager from "./manager/manager"
import Game from "./game"
import UpdateCommunicatorGame from "./update-communicator-game"
import { Socket } from "socket.io"


export default class UpdateCommunicatorGameWebsocket 
extends UpdateCommunicatorGame{    
  constructor(
    private socket: Socket,
    game: Game,
    manager: Manager  
  ){
    super(game, manager)
    this.socket.on('Action From Player', this.receivePlayerAction.bind(this))

    this.sendGameUiStateUpdate.subscribe((gameUiState:GameUiState) => 
      this.socket.emit('Game UI State Update', gameUiState)
    )
  }  
}
