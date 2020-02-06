import { Subject } from "rxjs";
import IUpdateCommunicatorUi from '../../interfaces/update-communicator-ui.interface'
import PlayerAction from "../../interfaces/player-action";
import { GameUiState } from "../../interfaces/game-ui-state.interface";
import UpdateCommunicatorGame from "../../game-components/update-communicator-game";

export default class UpdateCommunicatorUiLocal implements IUpdateCommunicatorUi {

  receiveGameUiStateUpdate: Subject<GameUiState> = new Subject()
  constructor(private updateCommunicatorGame: UpdateCommunicatorGame){
    updateCommunicatorGame.sendGameUiStateUpdate.subscribe((gameUiState: GameUiState) => this.receiveGameUiStateUpdate.next(gameUiState))
  }
  sendPlayerAction(playerAction: PlayerAction){
    this.updateCommunicatorGame.receivePlayerAction(playerAction)
  }
};
