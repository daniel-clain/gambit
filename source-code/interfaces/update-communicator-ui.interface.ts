import { Subject } from "rxjs";
import { GameUiState } from "./game-ui-state.interface";
import PlayerAction from "./player-action";

export default interface IUpdateCommunicatorUi {
  receiveGameUiStateUpdate: Subject<GameUiState>
  sendPlayerAction(playerAction: PlayerAction): void  
};
