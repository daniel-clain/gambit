import { round } from "lodash"
import { Game } from "../../game"
import { Ability, AbilityData, ServerAbility } from "../ability"
import { handleUnderSurveillance } from "./do-surveillance"

export const sellDrugs: Ability = {
  name: "Sell Drugs",
  cost: { money: 200, actionPoints: 1 },
  executes: "End Of Week",
  canOnlyTargetSameTargetOnce: false,
}

export const sellDrugsServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game) {
    const manager = game.has.managers.find((manager) =>
      manager.has.employees.some(
        (employee) => employee.name == abilityData.source.name
      )
    )
    const { weekNumber } = game.has.weekController

    if (!manager) {
      return
    }
    const drugDealer = manager.has.employees.find(
      (employee) => employee.name == abilityData.source.name
    )!

    if (manager.state.underSurveillance) {
      handleUnderSurveillance({ surveilledManager: manager, abilityData, game })
    }

    const moneyFromDrugDealing =
      50 * drugDealer.skillLevel +
      250 -
      (50 *
        game.has.abilityProcessor.delayedExecutionAbilities.filter(
          (a) => a.name == "Sell Drugs"
        ).length -
        1)

    manager.has.money += round(moneyFromDrugDealing)

    manager.functions.addToLog({
      weekNumber,
      message: `${abilityData.source.name} has made ${moneyFromDrugDealing} money from selling drugs`,
      type: "employee outcome",
    })
  },
  ...sellDrugs,
}
