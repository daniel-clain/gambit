
import { Player } from "../../interfaces/player-info.interface"
import { ServerGameUIState } from "../../interfaces/server-game-ui-state.interface"
import Game from "../game"


export const GameMessageSender = (players: Player[], game: Game)  => {
  
  return{
    triggerUpdate: (player: Player) => {

      [...player ? [player] : players ].forEach(player => {
        player.socketObj.emit('To Client From Server - Game Ui', game.getGameUiState(player))
      })

    }
  }
}
