
import gameConfiguration from "../../../game-settings/game-configuration"
import { Game } from "../../game"
import { FinalTournament } from "../../round-controller/final-tournament/final-tournament"
import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"

const dominationVictory: Ability = {
  name: 'Domination Victory',
  cost: { money: 10000, actionPoints: 1 },
  possibleSources: ['Manager'],
  notValidTargetIf: ['fighter'],
  validTargetIf: [],
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: true,
  notActiveUntilRound: 20,
  canOnlyBeUsedOnce: true
}

export const dominationVictoryServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const manager = game.has.managers.find(manager => manager.has.name == abilityData.source.name)

    console.log(`${manager.has.name} has attempted a domination victory`);

    if(!manager){
      return
    }
    game.state.finalTournament = new FinalTournament(game)
    const video = {
      name: gameConfiguration.videos.find(v => v.name == 'Final Tournament').name,
      index: 0
    }
    game.state.isShowingVideo = video
    
  },
  ...dominationVictory
}

export const dominationVictoryClient: ClientAbility = {
  shortDescription: 'Win the game by having the most dominant fighters',
  longDescription: 'Win the game by having the most dominant fighters. Force a tournament between the best fighters in the game. Whichever fighter wins the tournament, that fighters manager wins the game',
  ...dominationVictory
}

