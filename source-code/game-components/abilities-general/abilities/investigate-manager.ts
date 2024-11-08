import { random } from "lodash"
import { toWrittenList } from "../../../helper-functions/helper-functions"
import { Game } from "../../game"
import { KnownManager, KnownManagerStat, Manager } from "../../manager"
import { Ability, AbilityData, ServerAbility } from "../ability"
import { getAbilitySourceManager } from "../ability-service-server"

export const investigateManager: Ability = {
  name: "Investigate Manager",
  cost: { money: 50, actionPoints: 1 },
  executes: "Instantly",
  canOnlyTargetSameTargetOnce: false,
}

type KnownStatsItem = {
  key: KnownStatKey
  value: KnownManagerStat
}

type KnownStatKey = "money" | "employees" | "fighters" | "loan" | "evidence"

export const investigateManagerServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game) {
    const { target, source } = abilityData

    const sourceManager: Manager = getAbilitySourceManager(source!, game)
    const privateAgent = sourceManager.has.employees.find(
      (employee) => employee.name == source!.name
    )!

    const { weekNumber } = game.has.weekController

    const targetManager: Manager = game.has.managers.find(
      (m) => m.has.name == target!.name
    )!

    const knownManager: KnownManager = sourceManager.has.otherManagers.find(
      (m) => m.name == target!.name
    )!

    const discoveredStats: KnownStatsItem[] = getRandomStatsFromManager()

    discoveredStats.forEach((stat) => {
      const key = stat.key as KnownStatKey
      knownManager[key] = {
        lastKnownValue: stat.value,
        weeksSinceUpdated: 0,
      } as KnownManagerStat
    })

    sourceManager.functions.addToLog({
      weekNumber,
      message: `${source!.characterType} ${source!.name} used ${
        abilityData.name
      } and found out the following stats about ${
        target!.name
      }: \n ${toWrittenList(discoveredStats.map((s) => s.key))}`,
    })

    //implementation

    function getRandomStatsFromManager(): any {
      const invalidKeys = [
        "name",
        "image",
        "characterType",
      ] as (keyof KnownManager)[]
      let numberOfStats = privateAgent.skillLevel

      return getUpdatedStats()

      function getUpdatedStats() {
        const updatedStats: KnownStatsItem[] = []
        let possibleOptions = 5
        let knownStats = getKnownStats()
        possibleOptions = possibleOptions - knownStats.length

        for (
          ;
          updatedStats.length < numberOfStats &&
          updatedStats.length < possibleOptions;

        ) {
          const stat = getStat()
          if (!stat) {
            console.error("Error: stat not found", updatedStats, knownStats)
          }
          updatedStats.push(stat)
        }
        return updatedStats

        //implementation

        function getStat(): KnownStatsItem {
          const learnableStats = (Object.keys(knownManager) as KnownStatKey[])
            .filter((key) => !invalidKeys.includes(key))
            .filter((key) => !knownStats.includes(key))
            .filter((key) => !updatedStats.some((stat) => stat.key == key))

          const randomStatIndex = random(learnableStats.length - 1)
          const statKey = learnableStats[randomStatIndex]
          const x = targetManager.has[statKey]
          return {
            key: statKey,
            value: {
              lastKnownValue: x,
              weeksSinceUpdated: 0,
            },
          }
        }

        function getKnownStats(): string[] {
          return (
            Object.keys(knownManager) as (keyof Omit<
              KnownManager,
              "name" | "image" | "characterType"
            >)[]
          )
            .filter((key) => !invalidKeys.includes(key))
            .filter((key) => knownManager[key]?.weeksSinceUpdated == 0)
        }
      }
    }
  },
  ...investigateManager,
}
