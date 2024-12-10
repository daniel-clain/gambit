import { shuffle } from "../../../helper-functions/helper-functions"
import {
  FighterInfo,
  KnownFighterInfo,
  KnownFighterStat,
  StatName,
} from "../../../interfaces/front-end-state-interface"
import { Game } from "../../game"
import { Ability, AbilityData, ServerAbility } from "../ability"
import { getAbilitySourceManager } from "../ability-service-server"

export const researchFighter: Ability = {
  name: "Research Fighter",
  cost: { money: 5, actionPoints: 1 },
  executes: "Instantly",
}

export const researchFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game) {
    const { source, target } = abilityData
    const targetName = abilityData.target!.name
    const sourceManager = getAbilitySourceManager(source!, game)
    const researchedKnownFighter: KnownFighterInfo =
      sourceManager.has.knownFighters.find(
        (fighter) => fighter.name == targetName
      )!
    const researchedFighterInfo: FighterInfo = game.has.fighters
      .find((fighter) => fighter.name == targetName)!
      .getInfo()

    const numberOfStats =
      source!.characterType == "Manager"
        ? 4
        : source!.profession == "Talent Scout"
        ? 2 + source!.skillLevel
        : source!.profession == "Private Agent"
        ? 5 + source!.skillLevel
        : 4

    const randomStats = getRandomStatsFromFighter()

    updateOrAddStats()

    function getRandomStatsFromFighter(): Partial<
      Record<StatName, KnownFighterStat>
    > {
      /* 
        - if researched used multiple times, dont included the stats already learned int he ramdom list 
        - if options is less than or requal num to learned, then learn all of them

      */

      const statsNames = Object.keys(researchedFighterInfo.stats) as StatName[]

      const researchableStats = statsNames.filter((statName: StatName) => {
        const statObj: undefined | KnownFighterStat =
          researchedKnownFighter.stats[statName]
        console.log(statName, statObj)
        return !statObj || statObj.weeksSinceUpdated !== 0
      })

      const researchedStats = shuffle(researchableStats)
        .slice(0, numberOfStats)
        .reduce((researchedStats, statName) => {
          const researchedStat: KnownFighterStat = {
            lastKnownValue: researchedFighterInfo.stats[statName],
            weeksSinceUpdated: 0,
          }

          return { ...researchedStats, [statName]: researchedStat }
        }, {} as Partial<Record<StatName, KnownFighterStat>>)

      console.log("researchedStats", researchedStats)

      return researchedStats
    }

    function updateOrAddStats() {
      researchedKnownFighter.stats = {
        ...researchedKnownFighter.stats,
        ...randomStats,
      }
      console.log("researchedKnownFighter", researchedKnownFighter.stats)
    }
  },
  ...researchFighter,
}
