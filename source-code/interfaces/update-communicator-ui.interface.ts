import { Subject } from "rxjs";
import PlayerAction from "./player-action";
import { PlayerGameUiData, DisplayGameUiData } from "./game-ui-state.interface";


export default interface IUpdateCommunicatorUi {
  receivePlayerGameUiData: Subject<PlayerGameUiData>
  receiveDisplayGameUiData: Subject<DisplayGameUiData>
  sendPlayerAction(playerAction: PlayerAction): void  
};
