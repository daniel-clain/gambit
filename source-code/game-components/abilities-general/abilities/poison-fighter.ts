import { randomNumber } from "../../../helper-functions/helper-functions"
import { Employee } from "../../../interfaces/front-end-state-interface"
import { Game } from "../../game"
import { Ability, AbilityData, ServerAbility } from "../ability"
import { getAbilitySourceManager } from "../ability-service-server"
import { handleUnderSurveillance } from "./do-surveillance"

export const poisonFighter: Ability = {
  name: "Poison Fighter",
  cost: { money: 150, actionPoints: 1 },
  executes: "End Of Manager Options Stage",
  canOnlyTargetSameTargetOnce: false,
}

export const poisonFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game) {
    const { source, target } = abilityData
    const fighter = game.has.fighters.find(
      (fighter) => fighter.name == target!.name
    )!
    const { weekNumber } = game.has.weekController

    const sourceManager = getAbilitySourceManager(source, game)

    const poisoner: Employee = sourceManager.has.employees.find(
      (employee) => employee.name == abilityData.source!.name
    )!

    if (sourceManager.state.underSurveillance) {
      handleUnderSurveillance({
        surveilledManager: sourceManager,
        abilityData,
        game,
      })
    }
    if (fighter.state.underSurveillance) {
      handleUnderSurveillance({ surveilledFighter: fighter, abilityData, game })
    }

    let success
    let guardBlocked
    const guardLevel = fighter.state.guards.reduce(
      (totalSkill, thugGuardingFighter) =>
        (totalSkill += thugGuardingFighter.skillLevel),
      0
    )
    if (guardLevel > 0) {
      const randomNum = randomNumber({ to: 100 })
      if (randomNum < 15 - guardLevel * 5 + poisoner.skillLevel * 5)
        success = true
      else guardBlocked = true
    } else {
      const randomNum = randomNumber({ to: 100 })
      if (randomNum < 85 + poisoner.skillLevel * 5) success = true
    }
    if (success) {
      const randomNum = randomNumber({ to: 100 })

      const severityLevel =
        randomNum < 10 ? "death" : randomNum < 40 ? "hallucinate" : "sick"

      if (severityLevel == "death") {
        game.functions.removeFighterFromTheGame(fighter.name, game)
        game.has.weekController.preFightNewsStage.newsItems.push({
          newsType: "fighter died from poison",
          headline: `${fighter.name} had Died from Poisoning!`,
          message: `${fighter.name} has been found dead, frothing at the mouth, eyes a strange yellow color`,
        })
        sourceManager.functions.addToLog({
          weekNumber,
          message: `${poisoner.name} has successfully poisoned ${fighter.name}`,
          type: "employee outcome",
        })
      }
      if (severityLevel == "sick") {
        fighter.state.sick = true
        game.has.weekController.preFightNewsStage.newsItems.push({
          newsType: "fighter is sick",
          headline: `${fighter.name} Poisoned!`,
          message: `${fighter.name} has been nauseous and is pale in complexion, there is reason to believe he has been poisoned`,
        })
        sourceManager.functions.addToLog({
          weekNumber,
          message: `${poisoner.name} has successfully poisoned ${fighter.name}`,
          type: "employee outcome",
        })
      }

      if (severityLevel == "hallucinate") {
        fighter.state.hallucinating = true
        game.has.weekController.preFightNewsStage.newsItems.push({
          newsType: "fighter is hallucinating",
          headline: `${fighter.name} Poisoned!`,
          message: `${fighter.name} has been acting delirious and highly erratic, he says he cant remember`,
        })
        sourceManager.functions.addToLog({
          weekNumber,
          message: `${poisoner.name} has successfully poisoned ${fighter.name}`,
          type: "employee outcome",
        })
      }
    } else if (guardBlocked) {
      game.has.weekController.preFightNewsStage.newsItems.push({
        newsType: "guards protect fighter from being poisoned",
        headline: `${fighter.name} Guarded from Assailant!`,
        message: `Guards have stopped a suspicious man trying to poison ${fighter.name}`,
      })
      sourceManager.functions.addToLog({
        type: "employee outcome",
        weekNumber,
        message: `${poisoner.profession} ${
          poisoner.name
        } failed to poison target fighter ${
          target!.name
        } because he was guarded by thugs`,
      })
    } else
      sourceManager.functions.addToLog({
        type: "employee outcome",
        weekNumber,
        message: `${poisoner.profession} ${
          poisoner.name
        } failed to poison target fighter ${target!.name}`,
      })
  },
  ...poisonFighter,
}
