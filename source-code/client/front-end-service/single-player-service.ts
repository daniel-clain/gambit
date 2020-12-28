import { Subject } from "rxjs"
import { Game } from "../../game-components/game"
import { Player } from "../../game-components/player"
import { ServerGameUIState } from "../../interfaces/server-game-ui-state.interface"
import { ConnectedClient, FromClientToHost } from "../../server/game-host.types"
import { ServerPreGameUIState } from "../front-end-state/front-end-state"
import { FromClientToGame } from "./front-end-service-types"


const game = new Game([new ConnectedClient('Single Player', '1234')], 'Local')
const player: Player = game.has.players.find(p => p.id == '1234')



export const singlePlayer = {
  onServerGameUIStateUpdate: player.onUIStateUpdate,
  onServerPreGameUIStateUpdate: null,
  sendUpdate: <FromClientToHost & FromClientToGame> {
    ...{} as FromClientToHost,
    ...player.receiveUpdateFromClient
  }
}

