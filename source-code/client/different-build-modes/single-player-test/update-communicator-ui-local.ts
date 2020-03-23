import IUpdateCommunicatorUi from "../../../interfaces/update-communicator-ui.interface"
import { Subject } from "rxjs"
import { DisplayGameUiData, PlayerGameUiData } from "../../../interfaces/game-ui-state.interface"
import PlayerUpdateCommunicatorGame from "../../../game-components/update-communicators/player-update-communicator-game"
import ClientGameAction from "../../../types/client-game-actions"


export default class UpdateCommunicatorUiLocal implements IUpdateCommunicatorUi {
  
  receiveDisplayGameUiData: Subject<DisplayGameUiData> = new Subject()
  receivePlayerGameUiData: Subject<PlayerGameUiData> = new Subject()
  constructor(private playerUpdateCommunicatorGame: PlayerUpdateCommunicatorGame){
    playerUpdateCommunicatorGame.sendGameUiStateUpdate.subscribe((gameUiState: PlayerGameUiData) => this.receivePlayerGameUiData.next(gameUiState))
  }
  sendGameAction( gameAction: ClientGameAction){
    this.playerUpdateCommunicatorGame.receivePlayerAction( gameAction)
  }
};
