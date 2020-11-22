import { Player } from "../../interfaces/player-info.interface"
import ClientGameAction from "../../types/client-game-actions"
import { AbilityData } from "../abilities-reformed/ability"
import { AbilityProcessor } from "../abilities-reformed/ability-processor"

export const GameMessageReceiver = (players: Player[], abilityProcessor: AbilityProcessor) => {
  players.forEach(player => player.socketObj.on(
    'Action From Player', (gameAcion: ClientGameAction) => {
      console.log('received action from player: ', gameAcion)
      switch(gameAcion.name){
        case 'Ability Confirmed' : handleAbilitySelected(gameAcion.data)
        default: player.manager.receiveUpdate(gameAcion)
      }
    }
  ))
  const handleAbilitySelected = (selectedAbility: AbilityData) => {
    console.log('selectedAbility :', selectedAbility);
    abilityProcessor.processSelectedAbility(selectedAbility)

  }
}
