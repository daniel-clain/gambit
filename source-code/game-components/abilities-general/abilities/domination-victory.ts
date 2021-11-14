import { FinalTournamentBoard } from "../../../interfaces/front-end-state-interface"
import { Game } from "../../game"
import { FinalTournament } from "../../round-controller/final-tournament/final-tournament"
import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import Fight from "../fight/fight"


const dominationVictory: Ability = {
  name: 'Domination Victory',
  cost: { money: 200, actionPoints: 1 },
  possibleSources: ['Manager'],
  notValidTargetIf: [],
  validTargetIf: [],
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: true,
  notActiveUntilRound: 20
}

export const dominationVictoryServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const manager = game.has.managers.find(manager => manager.has.name == abilityData.source.name)

    console.log(`${manager.has.name} has attempted a domination victory`);

    if(!manager){
      return
    }
    game.state.finalTournament = new FinalTournament(game)
    
  },
  ...dominationVictory
}

export const dominationVictoryClient: ClientAbility = {
  shortDescription: 'Win the game by having the most dominant fighters',
  longDescription: 'Win the game by having the most dominant fighters. Force a tournament between the best fighters in the game. Whichever fighter wins the tournament, that fighters manager wins the game',
  ...dominationVictory
}

