import gameConfiguration from "../../../game-settings/game-configuration"
import { Game } from "../../game"
import { FinalTournament } from "../../week-controller/final-tournament/final-tournament"
import { Ability, AbilityData, ServerAbility } from "../ability"
import { getAbilitySourceManager } from "../ability-service-server"

export const dominationVictory: Ability = {
  name: "Domination Victory",
  cost: { money: 5000, actionPoints: 1 },
  executes: "End Of Manager Options Stage",
  canOnlyBeUsedOnce: true,
  notActiveUntilWeek: 15,
}

export const dominationVictoryServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game) {
    const manager = getAbilitySourceManager(abilityData.source!, game)

    console.log(`${manager!.has.name} has attempted a domination victory`)

    if (!manager) {
      return
    }
    game.state.finalTournament = new FinalTournament(game)
    game.state.isShowingVideo = {
      sourceManager: manager.functions.getInfo(),
      name: gameConfiguration.videos.find((v) => v.name == "Final Tournament")!
        .name,
      index: 0,
    }
  },
  ...dominationVictory,
}
