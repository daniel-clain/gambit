import { Subject } from "rxjs";
import { PlayerGameUiData, DisplayGameUiData } from "./server-game-ui-state.interface";
import ClientGameAction from "../types/client-game-actions";


export default interface IUpdateCommunicatorUi {
  receivePlayerGameUiData: Subject<PlayerGameUiData>
  receiveDisplayGameUiData: Subject<DisplayGameUiData>
  sendGameAction( gameAction: ClientGameAction): void  
};
