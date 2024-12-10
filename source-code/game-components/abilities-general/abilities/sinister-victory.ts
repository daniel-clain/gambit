import { Employee } from "../../../interfaces/front-end-state-interface"
import { Game } from "../../game"
import { Manager } from "../../manager"
import { Ability, AbilityData, ServerAbility } from "../ability"

export const sinisterVictory: Ability = {
  name: "Sinister Victory",
  cost: { money: 5000, actionPoints: 1 },
  executes: "End Of Manager Options Stage",
  notActiveUntilWeek: 15,
  canOnlyBeUsedOnce: true,
}

export const sinisterVictoryServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game) {
    const manager = game.has.managers.find(
      (manager) => manager.has.name == abilityData.source.name
    )!

    console.log(`${manager.has.name} has attempted a sinister victory`)

    const thisManagersTotalThugAndHitmanSkill =
      getManagersTotalThugAndHitmanSkill(manager)

    const averageOfOtherManagersTotalThugAndHitmanSkill =
      getAverageOfOtherManagersTotalThugAndHitmanSkill()

    console.log(
      "thisManagersTotalThugAndHitmanSkill",
      thisManagersTotalThugAndHitmanSkill
    )
    console.log(
      "averageOfOtherManagersTotalThugAndHitmanSkill",
      averageOfOtherManagersTotalThugAndHitmanSkill
    )

    if (
      thisManagersTotalThugAndHitmanSkill >
      averageOfOtherManagersTotalThugAndHitmanSkill
    ) {
      thisMangerHasSinisterVictory()
    } else {
      thisManagerFailsSinisterVictory()
    }

    // Implementation

    function getAverageOfOtherManagersTotalThugAndHitmanSkill(): number {
      const otherManagers = game.has.managers.filter(
        (m) =>
          m.has.name != manager.has.name && !m.state.retired && !m.state.inJail
      )
      const otherManagerThugAndHitmanSkill = otherManagers.reduce(
        (total, m) => {
          const loopManagerThugAndHitmanSkill =
            getManagersTotalThugAndHitmanSkill(m)
          return total + loopManagerThugAndHitmanSkill
        },
        0
      )

      if (!otherManagerThugAndHitmanSkill) return 0
      return otherManagerThugAndHitmanSkill / otherManagers.length
    }

    function getManagersTotalThugAndHitmanSkill(manager: Manager) {
      return manager.has.employees?.reduce(
        (totalSkill: number, e: Employee) => {
          if (e.profession == "Thug") {
            return totalSkill + e.skillLevel
          }
          if (e.profession == "Hitman") {
            return totalSkill + e.skillLevel * 2
          }
          return totalSkill
        },
        0
      )
    }

    function thisMangerHasSinisterVictory() {
      game.state.playerHasVictory = {
        sourceManager: manager.functions.getInfo(),
        victoryType: "Sinister Victory",
      }
      game.state.isShowingVideo = game.i.getSelectedVideo()
    }

    function thisManagerFailsSinisterVictory() {
      game.state.playerHasFailedVictory = {
        sourceManager: manager.functions.getInfo(),
        victoryType: "Sinister Victory",
      }
      game.state.isShowingVideo = game.i.getSelectedVideo()
    }
  },
  ...sinisterVictory,
}
