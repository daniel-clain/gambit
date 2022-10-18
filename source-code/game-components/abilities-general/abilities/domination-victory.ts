
import gameConfiguration from "../../../game-settings/game-configuration"
import { Game } from "../../game"
import { FinalTournament } from "../../week-controller/final-tournament/final-tournament"
import { Ability, ServerAbility, AbilityData } from "../ability"

export const dominationVictory: Ability = {
  name: 'Domination Victory',
  cost: { money: 10000, actionPoints: 1 },
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: true,
  notActiveUntilWeek: 20,
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

