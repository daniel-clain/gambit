import { round } from "lodash"
import { randomNumber } from "../../../helper-functions/helper-functions"
import { Game } from "../../game"
import { Ability, AbilityData, ServerAbility } from "../ability"
import { getAbilitySourceManager } from "../ability-service-server"
import { handleUnderSurveillance } from "./do-surveillance"

export const assaultFighter: Ability = {
  name: "Assault Fighter",
  cost: { money: 10, actionPoints: 1 },
  executes: "End Of Manager Options Stage",
  canOnlyTargetSameTargetOnce: false,
}

export const assaultFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game) {
    const { source, target } = abilityData

    const assaultedFighter = game.has.fighters.find(
      (fighter) => fighter.name == target!.name
    )!

    const assaultersManager = getAbilitySourceManager(source!, game)

    const { weekNumber } = game.has.weekController

    const assaulter = assaultersManager.has.employees.find(
      (employee) => employee.name == abilityData.source!.name
    )!

    if (assaultedFighter.state.injured) {
      assaultersManager.functions.addToLog({
        weekNumber,
        message: `${assaultedFighter.name} was already assaulted when ${assaulter.profession} ${assaulter.name} went to assault them`,
        type: "employee outcome",
      })
      return
    }

    if (assaultersManager.state.underSurveillance) {
      handleUnderSurveillance({
        surveilledManager: assaultersManager,
        abilityData,
        game,
      })
    }
    if (assaultedFighter.state.underSurveillance) {
      handleUnderSurveillance({
        surveilledFighter: assaultedFighter,
        abilityData,
        game,
      })
    }

    let success
    let guardBlocked
    const guardLevel = assaultedFighter.state.guards.reduce(
      (totalSkill, thugGuardingFighter) =>
        (totalSkill += thugGuardingFighter.skillLevel),
      0
    )
    if (guardLevel > 0) {
      const randomNum = round(randomNumber({ to: 100 }))
      if (randomNum < 15 - guardLevel * 5 + assaulter.skillLevel * 5)
        success = true
      else guardBlocked = true
    } else {
      const randomNum = round(randomNumber({ to: 100 }))
      if (randomNum < 75 + assaulter.skillLevel * 5) success = true
    }
    if (success) {
      assaultedFighter.state.injured = true
      game.has.weekController.preFightNewsStage.newsItems.push({
        newsType: "fighter was assaulted",
        headline: `${assaultedFighter.name} Assaulted!`,
        message: `${assaultedFighter.name} has been assaulted, his injuries will affect his fight performance`,
      })
      assaultersManager.functions.addToLog({
        weekNumber,
        message: `${assaulter.name} has successfully assaulted ${assaultedFighter.name} and he is now injured`,
        type: "report",
      })
    } else if (guardBlocked) {
      game.has.weekController.preFightNewsStage.newsItems.push({
        newsType: "guards protect fighter from being assaulted",
        headline: `${assaultedFighter.name} Guarded from Assailant!`,
        message: `Guards have protected ${assaultedFighter.name} from an attempted assault`,
      })
      assaultersManager.functions.addToLog({
        weekNumber,
        message: `${assaulter.profession} ${
          assaulter.name
        } failed to assault target fighter ${
          target!.name
        } because he was guarded by thugs`,
        type: "employee outcome",
      })
    } else
      assaultersManager.functions.addToLog({
        weekNumber,
        type: "employee outcome",
        message: `${assaulter.profession} ${
          assaulter.name
        } failed to assault target fighter ${target!.name}`,
      })
  },
  ...assaultFighter,
}
