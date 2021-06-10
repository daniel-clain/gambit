import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import { random } from "../../../helper-functions/helper-functions"
import { Game } from "../../game"
import { Manager } from "../../manager"
import { Employee } from "../../../interfaces/front-end-state-interface"


const tryToWinGame: Ability = {
  name: 'Try To Win',
  cost: { money: 10, actionPoints: 1 },
  possibleSources: ['Manager'],
  notValidTargetIf: ['fighter'],
  validTargetIf: [],
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: false,
  disabled: true
}

export const tryToWinGameServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    
    const sourceManager = game.has.managers.find(m => m.has.name == abilityData.source.name)

      


  },
  ...tryToWinGame
}

export const tryToWinGameClient: ClientAbility = {
  shortDescription: 'Chance to win the game',
  longDescription: 'Chose 1 of 3 avenues to attempt to win the game',
  ...tryToWinGame
}

