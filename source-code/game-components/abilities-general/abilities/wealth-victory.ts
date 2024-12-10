import { Employee } from "../../../interfaces/front-end-state-interface"
import { Game } from "../../game"
import { Ability, AbilityData, ServerAbility } from "../ability"

export const wealthVictory: Ability = {
  disabled: false,
  name: "Wealth Victory",
  cost: { money: 10000, actionPoints: 1 },
  executes: "End Of Manager Options Stage",
  notActiveUntilWeek: 15,
  canOnlyBeUsedOnce: true,
}

export const wealthVictoryServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game) {
    const manager = game.has.managers.find(
      (manager) => manager.has.name == abilityData.source.name
    )!

    const otherManagers = game.has.managers.filter(
      (m) => m.has.name != manager.has.name
    )

    console.log(`${manager.has.name} has attempted a wealth victory`)

    const managersLawyersTotalSkill = getTotalLawyersSkill(
      manager.has.employees
    )
    console.log("managersLawyersTotalSkill", managersLawyersTotalSkill)
    console.log("manager.has.money", manager.has.money)

    const anotherManagerIsStronger = otherManagers.some((m) => {
      const loopsLawyersTotalSkill = getTotalLawyersSkill(m.has.employees)
      console.log("loopsLawyersTotalSkill", loopsLawyersTotalSkill)
      const loopsMoney = m.has.money
      console.log("loopsMoney", loopsMoney)
      const hasMoreLawyerPowerAndMoney =
        loopsLawyersTotalSkill >= managersLawyersTotalSkill &&
        loopsMoney > manager.has.money
      console.log("hasMoreLawyerPowerAndMoney", hasMoreLawyerPowerAndMoney)
      return hasMoreLawyerPowerAndMoney
    })
    if (anotherManagerIsStronger) {
      console.log(`${manager.has.name} has FAILED wealth victory`)
      thisManagerFailsWealthVictory()
    } else {
      console.log(`${manager.has.name} has wealth victory`)
      thisMangerHasWealthVictory()
    }

    function getTotalLawyersSkill(employees: Employee[]): number {
      return employees.reduce((totalLawyersSkill, employee) => {
        if (employee.profession == "Lawyer") {
          return totalLawyersSkill + employee.skillLevel
        } else {
          return totalLawyersSkill
        }
      }, 0)
    }

    function thisMangerHasWealthVictory() {
      game.state.playerHasVictory = {
        sourceManager: manager.functions.getInfo(),
        victoryType: "Wealth Victory",
      }
      game.state.isShowingVideo = game.i.getSelectedVideo()
    }

    function thisManagerFailsWealthVictory() {
      game.state.playerHasFailedVictory = {
        sourceManager: manager.functions.getInfo(),
        victoryType: "Wealth Victory",
      }
      game.state.isShowingVideo = game.i.getSelectedVideo()
    }
  },
  ...wealthVictory,
}
