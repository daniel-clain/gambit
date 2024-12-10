import { random } from "lodash"
import { toWrittenList } from "../../../helper-functions/helper-functions"
import { ActivityLogItem } from "../../../types/game/activity-log-item"
import { Game } from "../../game"
import {
  KnownManager,
  KnownManagerStat,
  Manager,
  ManagerKnowableStatKey,
} from "../../manager"
import { Ability, AbilityData, ServerAbility } from "../ability"
import { getAbilitySourceManager } from "../ability-service-server"

export const investigateManager: Ability = {
  name: "Investigate Manager",
  cost: { money: 50, actionPoints: 1 },
  executes: "Instantly",
  canOnlyTargetSameTargetOnce: false,
}

type KnownStatsItem = {
  key: ManagerKnowableStatKey
  value: KnownManagerStat
}

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
    console.log("discoveredStats", discoveredStats)
    discoveredStats.forEach((stat) => {
      const key = stat.key as ManagerKnowableStatKey

      console.log("key", key)
      knownManager[key] = {
        lastKnownValue: stat.value.lastKnownValue,
        weeksSinceUpdated: 0,
      } as KnownManagerStat
    })
    console.log("discoveredStats", discoveredStats)

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
      const validKeys: ManagerKnowableStatKey[] = [
        "money",
        "employees",
        "fighters",
        "loan",
        "evidence",
        "activityLogs",
      ]
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
          const x = targetManager.has
          const targetManagerKeys = Object.keys(targetManager.has) as Array<
            keyof Manager["has"]
          >
          console.log("knownManagerKeys", targetManagerKeys)
          const learnableStats = targetManagerKeys
            .filter((key) => validKeys.includes(key as any))
            .filter((key) => !knownStats.includes(key))
            .filter((key) => !updatedStats.some((stat) => stat.key == key))
          console.log("learnableStats", learnableStats)

          const randomStatIndex = random(learnableStats.length - 1)
          const statKey = learnableStats[
            randomStatIndex
          ] as ManagerKnowableStatKey
          let statValue = targetManager.has[statKey]
          if (statKey == "activityLogs") {
            statValue = (statValue as ActivityLogItem[])
              .filter((l) => l.type != "new week")
              .slice(0, 5)
          }
          console.log("statKey", statKey, statValue)
          return {
            key: statKey,
            value: {
              lastKnownValue: statValue,
              weeksSinceUpdated: 0,
            },
          }
        }

        function getKnownStats(): string[] {
          const knownManagerKeys = Object.keys(knownManager)
          console.log("knownManagerKeys", knownManagerKeys)
          return (knownManagerKeys as ManagerKnowableStatKey[])
            .filter((key) => validKeys.includes(key))
            .filter((key) => knownManager[key]?.weeksSinceUpdated == 0)
        }
      }
    }
  },
  ...investigateManager,
}
