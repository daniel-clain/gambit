import { randomNumber } from "../../../helper-functions/helper-functions"
import Fighter from "../../fighter/fighter"
import { Game } from "../../game"
import { Manager } from "../../manager"
import { Ability, AbilityData, ServerAbility } from "../ability"
import { getAbilitySourceManager } from "../ability-service-server"

export const trainFighter: Ability = {
  name: "Train Fighter",
  cost: { money: 5, actionPoints: 1 },
  executes: "End Of Manager Options Stage",
  canOnlyTargetSameTargetOnce: true,
}

export const trainFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game) {
    const { target, source } = abilityData
    const fighter: Fighter = game.has.fighters.find(
      (fighter) => fighter.name == target!.name
    )!
    const { weekNumber } = game.has.weekController
    const sourceManager: Manager = getAbilitySourceManager(source, game)

    const sourceSkillLevel =
      source.characterType == "Manager" ? 1 : source.skillLevel

    fighter.state.trainingProgress += sourceSkillLevel

    let newsItemAdded
    const trainedFighterInFight: boolean =
      game.has.weekController.activeFight.fighters.some(
        (fighterInFight) => fighterInFight.name == fighter.name
      )

    while (fighter.state.trainingProgress >= 2) {
      fighter.state.trainingProgress -= 2

      if (!newsItemAdded && trainedFighterInFight) {
        game.has.weekController.preFightNewsStage.newsItems.push({
          newsType: "fighter has gone up in strength or fitness",
          headline: `${fighter.name} training hard`,
          message: `${fighter.name} has been training hard for the upcoming fight`,
        })
        newsItemAdded = true
      }

      const randomNum = randomNumber({ to: 1 })
      if (randomNum === 0) {
        fighter.fighting.stats.baseStrength++
        sourceManager.functions.addToLog({
          weekNumber,
          message: `${fighter.name}'s strength has gone up by 1 as a result of being trained`,
          type: "employee outcome",
        })
      } else if (randomNum === 1) {
        fighter.fighting.stats.baseFitness++
        sourceManager.functions.addToLog({
          weekNumber,
          message: `${fighter.name}'s fitness has gone up by 1 as a result of being trained`,
          type: "employee outcome",
        })
      }
    }
  },
  ...trainFighter,
}
