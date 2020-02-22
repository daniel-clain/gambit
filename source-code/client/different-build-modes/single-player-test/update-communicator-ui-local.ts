import IUpdateCommunicatorUi from "../../../interfaces/update-communicator-ui.interface"
import { Subject } from "rxjs"
import { DisplayGameUiData, PlayerGameUiData } from "../../../interfaces/game-ui-state.interface"
import PlayerUpdateCommunicatorGame from "../../../game-components/update-communicators/player-update-communicator-game"
import PlayerAction from "../../../interfaces/player-action"


export default class UpdateCommunicatorUiLocal implements IUpdateCommunicatorUi {
  
  receiveDisplayGameUiData: Subject<DisplayGameUiData> = new Subject()
  receivePlayerGameUiData: Subject<PlayerGameUiData> = new Subject()
  constructor(private playerUpdateCommunicatorGame: PlayerUpdateCommunicatorGame){
    playerUpdateCommunicatorGame.sendGameUiStateUpdate.subscribe((gameUiState: PlayerGameUiData) => this.receivePlayerGameUiData.next(gameUiState))
  }
  sendPlayerAction(playerAction: PlayerAction){
    this.playerUpdateCommunicatorGame.receivePlayerAction(playerAction)
  }
};
