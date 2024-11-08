import { randomNumber } from "../../../helper-functions/helper-functions"
import {
  FighterInfo,
  FighterStatKey,
  KnownFighterStat,
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

    const sourceManager = getAbilitySourceManager(source!, game)
    const existingFighter: FighterInfo = sourceManager.has.knownFighters.find(
      (fighter) => fighter.name == abilityData.target!.name
    )!
    const fighter = game.has.fighters
      .find((fighter) => fighter.name == abilityData.target!.name)!
      .getInfo()

    const numberOfStats =
      source.characterType == "Manager"
        ? 4
        : source.profession == "Talent Scout"
        ? 2 + source.skillLevel
        : source.profession == "Private Agent"
        ? 5 + source.skillLevel
        : 4

    const researchedStats = getRandomStatsFromFighter()

    for (let key in researchedStats) {
      const statKey = key as FighterStatKey
      if (invalidKey(statKey)) continue
      console.log(key)
      existingFighter[statKey] = researchedStats[statKey]!
    }

    console.log(
      `${source.characterType} ${
        source.name
      } used research fighter and found out the following stats about ${
        target!.name
      }`,
      researchedStats
    )

    /* functions */
    type StatsObj = {
      [Property in keyof FighterInfo]?: KnownFighterStat
    }

    function getRandomStatsFromFighter(): StatsObj {
      const returnStatsObj: Partial<Record<FighterStatKey, KnownFighterStat>> =
        {}
      const knownStatsKeys = Object.keys(fighter) as FighterStatKey[]
      console.log("knownStatsKeys :>> ", knownStatsKeys)

      for (let loops = 0; continueCondition(loops); loops++) {
        const randomKey = knownStatsKeys[
          randomNumber({ to: knownStatsKeys.length - 1 })
        ] as FighterStatKey
        console.log("randomKey :>> ", randomKey)
        if (invalidKey(randomKey)) continue

        const alreadyHasThatStat = !!returnStatsObj[randomKey]

        const alreadyDiscoveredThatStatThisTurn =
          existingFighter[randomKey]?.weeksSinceUpdated === 0

        console.log("alreadyHasThatStat :>> ", alreadyHasThatStat)
        console.log(
          "alreadyDiscoveredThatStatThisTurn :>> ",
          alreadyDiscoveredThatStatThisTurn
        )
        if (!alreadyHasThatStat && !alreadyDiscoveredThatStatThisTurn) {
          const stat = fighter[randomKey]!.lastKnownValue

          console.log("adding stat", randomKey, stat)

          returnStatsObj[randomKey] = {
            lastKnownValue: stat,
            weeksSinceUpdated: 0,
          }
        }
      }
      return returnStatsObj
      function continueCondition(loops: number) {
        console.log("loops :>> ", loops)
        const currentStatsCount = Object.keys(returnStatsObj).length
        console.log("currentStatsCount :>> ", currentStatsCount)
        console.log("numberOfStats :>> ", numberOfStats)
        console.log("knownStatsKeys.length :>> ", knownStatsKeys.length)
        const continueLoop =
          currentStatsCount < numberOfStats &&
          currentStatsCount < knownStatsKeys.length &&
          loops < 20
        console.log("continueLoop :>> ", continueLoop)
        return continueLoop
      }
    }

    function invalidKey(key: keyof FighterInfo) {
      return ![
        "strength",
        "fitness",
        "intelligence",
        "aggression",
        "numberOfFights",
        "numberOfWins",
        "manager",
      ].includes(key)
    }
  },
  ...researchFighter,
}
