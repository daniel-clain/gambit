
import { Subject } from "rxjs/internal/Subject"
import { Game } from "../../game-components/game"
import { Player } from "../../game-components/player"
import { ServerPreGameUIState, ServerGameUIState } from "../../interfaces/front-end-state-interface"
import { FrontToBackInterface } from "../../interfaces/front-to-back-interface.interface"
import { ConnectedClient, FromClientToHost } from "../../game-host/game-host.types"
import { FromClientToGame } from "./front-end-service-types"





export class LocalService implements FrontToBackInterface{
  init(){}
  private player: Player
  game: Game
  onServerPreGameUIStateUpdate: Subject<ServerPreGameUIState> = new Subject<ServerPreGameUIState>()
  onServerGameUIStateUpdate: Subject<ServerGameUIState>
  sendUpdate: FromClientToHost & FromClientToGame

  constructor(){
    this.game = new Game([new ConnectedClient('Single Player', '1234')],  'Local', null)
    this.player = this.game.has.players.find(p => p.id == '1234')

    this.onServerGameUIStateUpdate = this.player.onUIStateUpdate

    
    const clientToGameFuntions = {
      toggleReady: () => this.player.doAction('toggleReady'),
      betOnFighter: bet => this.player.doAction('betOnFighter', bet),
      borrowMoney: amount => this.player.doAction('borrowMoney', amount),
      payBackMoney: amount => this.player.doAction('payBackMoney', amount),
      abilityConfirmed: ability => this.player.doAction('abilityConfirmed', ability),
      toggleDropPlayer: obj => {
        this.player.doAction('toggleDropPlayer', obj)
      }
    }  

    this.sendUpdate = {
      ...{} as FromClientToHost,
      ...clientToGameFuntions
    }
  }
  
}

