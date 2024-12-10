import { round } from "lodash"
import gameConfiguration from "../../game-settings/game-configuration"
import {
  OptionProbability,
  percentageChance,
  randomNumber,
  selectByProbability,
  shuffle,
} from "../../helper-functions/helper-functions"
import {
  FighterInfo,
  JobSeeker,
} from "../../interfaces/front-end-state-interface"
import { GoalContract } from "../../interfaces/game/contract.interface"
import Fight from "../fight/fight"
import Fighter from "../fighter/fighter"
import { Game } from "../game"
import { Manager } from "../manager"

export function setupNewWeek(game: Game) {
  const { managers, professionals, fighters, weekController } = game.has

  const { weekNumber } = weekController

  chanceNextFightEvent()
  setWeekJobSeekers()
  setupWeekFight()

  managers.forEach((manager) => {
    addNewWeekToManagerLog(manager)
    addFightersToManagersKnownFightersList(manager)
    if (manager.state.inJail) {
      manager.functions.addToLog({
        weekNumber,
        type: "critical",
        message: `You are in jail! (${manager.state.inJail.weeksRemaining} weeks remaining)`,
      })
    }
  })

  function chanceNextFightEvent() {
    const { nextWeekIsEvent, thisWeekIsEvent, weekNumber } = weekController
    if (
      !nextWeekIsEvent &&
      !thisWeekIsEvent &&
      weekNumber > 15 &&
      percentageChance({ percentage: 20 })
    ) {
      weekController
      weekController.nextWeekIsEvent = true
      weekController.preFightNewsStage.newsItems.push({
        newsType: "fight event next week",
        message:
          "The top 10 fighters will compete in a battle royal, all winnings are tripled",
        headline: "Main Event!",
        duration: 5,
      })
    }
  }

  function addFightersToManagersKnownFightersList(manager: Manager) {
    const weekFightersAndJobSeekerFighters: FighterInfo[] = []
    const weekFightersInfo: FighterInfo[] =
      weekController.activeFight.fighters.map((fighter) => fighter.getInfo())

    const jobSeekerFighterInfo: FighterInfo[] = weekController.jobSeekers
      .filter((jobSeeker) => jobSeeker.type == "Fighter")
      .map((jobSeekerFighter) =>
        fighters
          .find((fighter) => fighter.name == jobSeekerFighter.name)!
          .getInfo()
      )

    weekFightersAndJobSeekerFighters.push(
      ...weekFightersInfo,
      ...jobSeekerFighterInfo
    )

    weekFightersAndJobSeekerFighters.forEach((weekFighter) => {
      if (managerDoesNotOwnWeekFighter() && managerDoesNotKnowWeekFighter()) {
        const { stats, ...rest } = weekFighter
        manager.has.knownFighters.push({
          ...rest,
          stats: {},
        })
      } else {
        manager.has.knownFighters = manager.has.knownFighters.map(
          (knownFighter) => {
            const fighterJobSeeker = weekController.jobSeekers.find(
              (fighterJobSeeker) => fighterJobSeeker.name == knownFighter.name
            )
            return {
              ...knownFighter,
              goalContract: fighterJobSeeker
                ? fighterJobSeeker.goalContract
                : undefined,
            }
          }
        )
      }

      function managerDoesNotOwnWeekFighter(): boolean {
        return !manager.has.fighters.some(
          (fighter) => fighter.name == weekFighter.name
        )
      }
      function managerDoesNotKnowWeekFighter(): boolean {
        return !manager.has.knownFighters.some(
          (knownFighter) => knownFighter.name == weekFighter.name
        )
      }
    })
  }

  function addNewWeekToManagerLog(manager: Manager) {
    manager.functions.addToLog({
      weekNumber,
      type: "new week",
      message: `Week ${weekController.weekNumber}`,
    })
  }

  function setWeekJobSeekers() {
    let {
      numberOfProfessionalJobSeekersPerWeek,
      numberOfFighterJobSeekersPerWeek,
    } = gameConfiguration
    numberOfProfessionalJobSeekersPerWeek += game.has.players.length - 2
    numberOfFighterJobSeekersPerWeek += game.has.players.length - 2

    weekController.jobSeekers = shuffle(professionals)
      .splice(0, numberOfProfessionalJobSeekersPerWeek)
      .map((professional): JobSeeker => {
        let goalContract: GoalContract
        switch (professional.profession) {
          case "Drug Dealer":
            goalContract = {
              numberOfWeeks: 2 + round(randomNumber({ from: 1, to: 4 })),
              weeklyCost: 20 * professional.skillLevel,
            }
            break
          case "Hitman":
            goalContract = {
              numberOfWeeks: 1 + round(randomNumber({ from: 1, to: 2 })),
              weeklyCost: 30 * professional.skillLevel,
            }
            break
          case "Private Agent":
            goalContract = {
              numberOfWeeks: 2 + round(randomNumber({ from: 1, to: 3 })),
              weeklyCost: 20 * professional.skillLevel,
            }
            break
          case "Lawyer":
            goalContract = {
              numberOfWeeks: 1 + round(randomNumber({ from: 1, to: 2 })),
              weeklyCost: 20 * professional.skillLevel,
            }
            break
          case "Promoter":
            goalContract = {
              numberOfWeeks: 2 + round(randomNumber({ from: 1, to: 4 })),
              weeklyCost: 10 * professional.skillLevel,
            }
            break
          case "Talent Scout":
            goalContract = {
              numberOfWeeks: 1 + round(randomNumber({ from: 1, to: 6 })),
              weeklyCost: 5 * professional.skillLevel,
            }
            break
          case "Thug":
            goalContract = {
              numberOfWeeks: 5 + round(randomNumber({ from: 1, to: 4 })),
              weeklyCost: 10,
            }
            break
          case "Trainer":
            goalContract = {
              numberOfWeeks: 6 + round(randomNumber({ from: 1, to: 5 })),
              weeklyCost: 5 * professional.skillLevel,
            }
            break
        }
        const { name, profession, skillLevel, abilities } = professional
        return {
          characterType: "Job Seeker",
          type: "Professional",
          name,
          profession,
          goalContract,
          skillLevel,
          abilities,
        }
      })

    const fighterJobSeekers: JobSeeker[] = shuffle(
      fighters.filter(
        (fighter) => !fighter.state.dead && !fighter.state.activeContract
      )
    )
      .slice(0, numberOfFighterJobSeekersPerWeek)
      .map((fighter): JobSeeker => {
        fighter.determineGoalContract()
        return {
          characterType: "Job Seeker",
          type: "Fighter",
          name: fighter.name,
          goalContract: fighter.state.goalContract,
        }
      })

    weekController.jobSeekers.push(...fighterJobSeekers)
  }

  function setupWeekFight() {
    if (weekController.activeFight != null)
      weekController.activeFight.doTeardown()

    let numOfFighters: number =
      (weekController.thisWeekIsEvent && 10) ||
      gameConfiguration.fightersAfterWeeks.reduce(
        (num: number, weekFighters) => {
          if (
            weekFighters.week < weekController.weekNumber &&
            weekFighters.fighters > num
          ) {
            return weekFighters.fighters
          } else return num
        },
        0
      )

    const randomFighters: Fighter[] = []

    for (; randomFighters.length < numOfFighters; ) {
      const fightersRandomChance: OptionProbability<Fighter>[] = fighters
        .filter(
          (fighter) =>
            !fighter.state.dead &&
            !weekController.lastFightFighters.includes(fighter.name) &&
            !randomFighters.some(
              (randomFighter) => randomFighter.name == fighter.name
            )
        )
        .map((fighter) => ({
          option: fighter,
          probability: 1 + fighter.state.publicityRating,
        }))
      randomFighters.push(selectByProbability(fightersRandomChance)!)
    }

    weekController.activeFight = new Fight(
      randomFighters,
      weekController.thisWeekIsEvent
    )

    weekController.lastFightFighters = randomFighters.map(
      (fighter) => fighter.name
    )
  }
}
