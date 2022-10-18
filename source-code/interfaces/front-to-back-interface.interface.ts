
import { Subject } from "rxjs/internal/Subject";
import { FromClientToGame } from "../client/front-end-service/front-end-service-types";
import { FromClientToHost } from "../game-host/game-host.types";
import { ServerPreGameUIState, ServerGameUIState } from "./front-end-state-interface";

export interface FrontToBackInterface{
  init
  sendUpdate: FromClientToHost & FromClientToGame
  
}