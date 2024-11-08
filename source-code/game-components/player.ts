import { Subject } from "rxjs"
import { Socket } from "socket.io"
import { FromClientToGame } from "../client/front-end-service/front-end-service-types"
import { ServerGameUIState } from "../interfaces/front-end-state-interface"
import { Game } from "./game"
import { Manager } from "./manager"

export class Player {
  onUIStateUpdate = new Subject<ServerGameUIState>()

  constructor(
    public name: string,
    public id: string,
    public socket: Socket,
    public manager: Manager,
    private game: Game
  ) {
    if (this.game.state.gameType == "Websockets") {
      this.mapSocketMessagesToActions()
    }
  }

  mapSocketMessagesToActions() {
    ;(
      Object.keys(this.receiveUpdateFromClient) as (keyof FromClientToGame)[]
    ).forEach((updateFromClient) => {
      this.socket.on(
        updateFromClient,
        (data) => (
          this.doAction(updateFromClient, data),
          this.game.functions.sendUIUpdateToPlayers([this])
        )
      )
    })
  }

  doAction(name: keyof FromClientToGame, data?: any) {
    this.receiveUpdateFromClient[name](data)
    this.game.functions.sendUIUpdateToPlayers([this])
  }

  receiveUpdateFromClient: FromClientToGame = {
    toggleReady: this.manager.functions.toggleReady,

    toggleDropPlayer: (obj) => {
      this.game.has.connectionManager.handlePlayerVote(
        obj.votingPlayer,
        obj.disconnectedPlayer,
        obj.vote
      )
    },

    abilityConfirmed: this.game.has.abilityProcessor.processSelectedAbility,

    betOnFighter: this.manager.functions.betOnFighter,

    borrowMoney: this.manager.functions.borrowMoney,

    payBackMoney: this.manager.functions.paybackMoney,
  }
}
