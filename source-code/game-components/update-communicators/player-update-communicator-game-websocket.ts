
import Manager from "../manager"
import Game from "../game"
import { Socket } from "socket.io"
import PlayerUpdateCommunicatorGame from "./player-update-communicator-game"
import { PlayerGameUiData } from "../../interfaces/game-ui-state.interface"


export default class PlayerUpdateCommunicatorGameWebsocket 
extends PlayerUpdateCommunicatorGame{    
  constructor(
    socket: Socket,
    public name: string,
    public id: string,
    game: Game,
    manager: Manager,
    abilityProcessor
  ){
    super(game, manager, abilityProcessor)
    game.disconnectedPlayers.playerDisconnectedSubject.subscribe(this.handleDisconnectedPlayer.bind(this))
    this.setupSocket(socket)
  }  

  setupSocket(socket: Socket){
    socket.on('Action From Player', this.receivePlayerAction.bind(this))

    this.sendGameUiStateUpdate.subscribe((playerGameUiData: PlayerGameUiData) => 
      socket.emit('Player Game UI Update', playerGameUiData)
    )
  }

  handleDisconnectedPlayer(){
    this.playerGameUiData.disconnectedPlayerVotes = this.game.disconnectedPlayers.disconnectedPlayerVotes
    this.sendUpdate()
  }
}
