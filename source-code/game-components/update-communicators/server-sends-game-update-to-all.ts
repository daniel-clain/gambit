
import { Player } from "../../interfaces/player-info.interface"


export const GameMessageSender = (players: Player[],getGameUiState) => {
  
  return{
    triggerUpdate: (player: Player) => {

      [...player ? [player] : players ].forEach(player => {
        player.socketObj.emit('Player Game UI Update', getGameUiState(player))
        console.log('update sent for ', player.name)
      })

    }
  }
}
