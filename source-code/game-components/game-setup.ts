import { VideoName } from "../client/videos/videos"
import gameConfiguration from "../game-settings/game-configuration"
import {
  numberLoop,
  randomNumber,
  selectByProbability,
  shuffle,
} from "../helper-functions/helper-functions"
import {
  Employee,
  FightUIState,
  GameFinishedData,
  Professional,
  SelectedVideo,
} from "../interfaces/front-end-state-interface"
import { Profession } from "../types/game/profession"
import SkillLevel from "../types/game/skill-level.type"
import Fight from "./fight/fight"
import Fighter from "./fighter/fighter"
import { Game } from "./game"
import { Manager } from "./manager"

export class Game_Implementation {
  shuffledNames: string[]

  constructor(public game: Game) {}

  setupFightersAndProfessionals() {
    this.shuffledNames = shuffle([
      ...gameConfiguration.listOfNames.filter(
        (name) => !this.game.has.players.some((p) => p.name == name)
      ),
    ])

    this.game.has.professionals = this.createRandomProfessionals()
    this.game.has.fighters = this.createRandomFighters()
  }

  createRandomFighters(): Fighter[] {
    const { baseFightersCount } = gameConfiguration

    const newFighters: Fighter[] = []
    for (; newFighters.length < baseFightersCount; ) {
      const newFighter = new Fighter(this.shuffledNames.pop()!)
      newFighter.fighting.stats.baseStrength = randomNumber({ from: 1, to: 4 })
      newFighter.fighting.stats.baseFitness = randomNumber({ from: 1, to: 4 })
      newFighter.fighting.stats.baseAggression = randomNumber({
        from: 1,
        to: 5,
      })
      newFighter.fighting.stats.baseIntelligence = randomNumber({
        from: 1,
        to: 10,
      })

      newFighter.fighting.reset()
      newFighters.push(newFighter)
    }
    console.log("newFighters :>> ", newFighters.length)

    generateFighterHistory()
    return newFighters

    function generateFighterHistory() {
      const numberOfFights = newFighters.length * 5

      for (let fight = 0; fight < numberOfFights; fight++) {
        const randomNumberOfFightersInTheFight = randomNumber({
          from: 2,
          to: 4,
        })

        let randomFighters: Fighter[] = []
        for (; randomFighters.length != randomNumberOfFightersInTheFight; ) {
          const randomFighterIndex = randomNumber({
            to: newFighters.length - 1,
          })
          const randomFighter = newFighters[randomFighterIndex]
          const fighterAlreadyInList = randomFighters.some(
            (fighter) => fighter.name == randomFighter.name
          )

          if (fighterAlreadyInList) continue

          randomFighters.push(randomFighter)
        }

        randomFighters.forEach((fighter) => fighter.state.numberOfFights++)

        const fightersChanceToWin = randomFighters.map((fighter) => {
          const { fitness, strength, aggression, intelligence } =
            fighter.fighting.stats
          return {
            option: fighter,
            probability: Math.round(
              fitness + strength + aggression / 2 + intelligence
            ),
          }
        })
        const fightWinner = selectByProbability(fightersChanceToWin)
        if (!fightWinner)
          throw console.error(
            "There should have been a fight winner",
            fightersChanceToWin
          )

        fightWinner.state.numberOfWins++
      }
    }
  }

  createRandomProfessionals(): Professional[] {
    const numberOfProfessionals = gameConfiguration.baseProfessionalsCount

    const { shuffledNames } = this

    const professionNames: Profession[] = [
      "Lawyer",
      "Thug",
      "Drug Dealer",
      "Talent Scout",
      "Private Agent",
      "Hitman",
      "Promoter",
      "Trainer",
    ]

    const professionals: Professional[] = professionNames.reduce(
      (professionals: Professional[], profession: Profession) => {
        const { minimum } =
          gameConfiguration.professionalTypeProbability[profession]
        return [
          ...professionals,
          ...numberLoop(
            minimum,
            () =>
              new Professional(
                profession,
                <SkillLevel>randomNumber({ from: 1, to: 3 }),
                this.shuffledNames.pop()
              )
          ),
        ]
      },
      []
    )

    for (; professionals.length < numberOfProfessionals; ) {
      professionals.push(getRandomProfessional())
    }

    console.log(
      "professionals Lawyer :>> ",
      professionals.filter((p) => p.profession == "Lawyer").length
    )
    console.log(
      "professionals Hitman :>> ",
      professionals.filter((p) => p.profession == "Hitman").length
    )
    console.log(
      "professionals Thug :>> ",
      professionals.filter((p) => p.profession == "Thug").length
    )
    console.log(
      "professionals Talent :>> ",
      professionals.filter((p) => p.profession == "Talent Scout").length
    )
    return professionals

    function getRandomProfessional(): Professional {
      return createProfessional(getRandomProfession())

      function getRandomProfession(): Profession {
        const professionProbabilities = professionNames.map((profession) => ({
          option: profession,
          probability:
            gameConfiguration.professionalTypeProbability[profession]
              .probability,
        }))
        return selectByProbability(professionProbabilities)
      }
    }

    function createProfessional(profession: Profession) {
      return new Professional(
        profession,
        <SkillLevel>randomNumber({ from: 1, to: 3 }),
        shuffledNames.pop()
      )
    }
  }

  getAllConnectedGameDisplays() {
    return this.game.has.gameDisplays?.filter(
      (gameDisplay) =>
        !this.game.has.connectionManager.disconnectedPlayerVotes.find(
          (d) => d.disconnectedPlayer.id == gameDisplay.id
        )
    )
  }

  removeFighterFromTheGame = (fighterName: string, game: Game) => {
    const fighter = game.has.fighters.find(
      (fighter) => fighter.name == fighterName
    )!
    fighter.state.dead = true

    game.has.managers.forEach((manager) => {
      const { fighters, knownFighters } = manager.has
      fighters.splice(
        fighters.findIndex((f) => f.name == fighterName),
        1
      )
      knownFighters.splice(
        fighters.findIndex((f) => f.name == fighterName),
        1
      )
    })

    const { fighters } = game.has.weekController.activeFight
    fighters.splice(
      fighters.findIndex((f) => f.name == fighterName),
      1
    )
  }

  resignEmployee(employee: Employee, manager?: Manager) {
    const employeesManager =
      manager ||
      this.game.has.managers.find((m) =>
        m.has.employees.some((e) => e.name == employee.name)
      )

    if (!employeesManager)
      return console.error(
        `tried to find manager of resigning employee but failed. ${employee.name}`
      )
    employeesManager.has.employees = employeesManager.has.employees.filter(
      (e) => e.name != employee.name
    )

    const { actionPoints, activeContract, ...rest } = employee

    this.game.has.professionals.push(rest)
  }

  getSelectedVideo(): SelectedVideo {
    const { playerHasVictory, playerHasFailedVictory } = this.game.state
    const name: VideoName = (() => {
      if (playerHasVictory) {
        switch (playerHasVictory.victoryType) {
          case "Sinister Victory":
            return "Sinister Victory"
          case "Wealth Victory":
            return "Wealth Victory"
          case "Domination Victory":
            return "Domination Victory"
          case "Default Victory":
            return "Default Victory"
        }
      }
      if (playerHasFailedVictory) {
        switch (playerHasFailedVictory.victoryType) {
          case "Sinister Victory":
            return "Sinister Victory Fail"
          case "Wealth Victory":
            return "Wealth Victory Fail"
        }
      }
    })()!
    const videos = gameConfiguration.videos.find((v) => v.name == name)!.videos
    const index = randomNumber({ to: videos.length - 1 })

    return { name, index }
  }

  getFightUiState(manager?: Manager): FightUIState {
    const {
      has: {
        weekController: { activeFight },
      },
      state: { finalTournament },
    } = this.game

    if (finalTournament) {
      const { activeFight } = finalTournament
      const finalTournamentFight: FightUIState = {
        ...activeFight?.fightUiData,
        knownFighterStateData: !activeFight
          ? []
          : manager && getFighterStateData(activeFight, manager),
      }
      return finalTournamentFight
    }
    const weekFight: FightUIState = {
      ...activeFight.fightUiData,
      knownFighterStateData:
        manager && getFighterStateData(activeFight, manager),
    }
    return weekFight

    function getFighterStateData(fight: Fight, manager: Manager) {
      return manager.functions.getFighterStateData(fight.fighters)
    }
  }

  getGameFinishedData(): GameFinishedData {
    const { state, has } = this.game
    const winner = {
      name: state.playerHasVictory.name,
      victoryType: state.playerHasVictory.victoryType,
      image: has.managers.find(
        (m) => m.has.name == state.playerHasVictory.name
      )!.has.image,
    }
    const players = has.managers.map((m) => {
      return {
        name: m.has.name,
        money: m.has.money,
        managerImage: m.has.image,
        fighters: m.has.fighters.map((f) => f.getInfo()),
      }
    })
    return { winner, players }
  }
}
