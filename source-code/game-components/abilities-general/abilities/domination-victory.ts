
import gameConfiguration from "../../../game-settings/game-configuration"
import { Game } from "../../game"
import { FinalTournament } from "../../week-controller/final-tournament/final-tournament"
import { Ability, ServerAbility, AbilityData } from "../ability"
import { getAbilitySourceManager } from "../ability-service-server"

export const dominationVictory: Ability = {
  name: 'Domination Victory',
  cost: { money: 10000, actionPoints: 1 },
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: true,
  notActiveUntilWeek: 20,
}

export const dominationVictoryServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const manager = getAbilitySourceManager(abilityData.source!, game)

    console.log(`${manager!.has.name} has attempted a domination victory`);

    if(!manager){
      return
    }
    game.state.finalTournament = new FinalTournament(game)
    const video = {
      name: gameConfiguration.videos.find(v => v.name == 'Final Tournament')!.name,
      index: 0
    }
    game.state.isShowingVideo = video
    
  },
  ...dominationVictory
}

