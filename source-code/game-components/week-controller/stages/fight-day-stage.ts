import { round } from "lodash"
import gameConfiguration from "../../../game-settings/game-configuration"
import {
  ManagersBet,
  ManagerWinnings,
} from "../../../interfaces/front-end-state-interface"
import { Bet } from "../../../interfaces/game/bet"
import IStage from "../../../interfaces/game/stage"
import { FightDayState } from "../../../types/game/ui-fighter-state"
import { WeekStage } from "../../../types/game/week-stage.type"
import Fighter from "../../fighter/fighter"
import { Game } from "../../game"
import { Manager } from "../../manager"

export default class FightDayStage implements IStage {
  name: WeekStage = "Fight Day"
  endStage: (value: void | PromiseLike<void>) => void
  managersWinnings: ManagerWinnings[] | undefined
  managersBets: ManagersBet[]

  gameFightUiState: FightDayState

  constructor(private game: Game) {}

  start(): Promise<void> {
    const { weekController, managers } = this.game.has
    this.managersBets = managers
      ?.filter((m) => !m.state.retired)
      .map((manager: Manager): ManagersBet => {
        return {
          name: manager.has.name,
          image: manager.has.image,
          bet: manager.has.nextFightBet,
        }
      })

    return new Promise((resolve) => {
      this.endStage = resolve

      const { activeFight } = weekController

      activeFight.start()

      activeFight.fightUiDataSubject.subscribe(() => {
        weekController.triggerUIUpdate()
      })

      activeFight.fightFinishedSubject.subscribe(() => {
        console.log("fightFinishedSubject  time is up")
        this.onFightFinished()
      })

      weekController.triggerUIUpdate()
    })
  }

  onFightFinished() {
    const { activeFight } = this.game.has.weekController
    activeFight.doTeardown()
    activeFight.fighters.forEach((f) => {
      f.state.numberOfFights++
    })
    if (activeFight.result && activeFight.result != "draw") {
      activeFight.result.winner.state.numberOfWins++
    }

    this.processManagerBets()

    this.game.has.weekController.triggerUIUpdate()

    const playersHadWinnings = this.managersWinnings?.some(
      (m) => m.winnings > 0
    )
    this.managersWinnings = undefined
    const duration = playersHadWinnings
      ? gameConfiguration.stageDurations.showWinningsDuration
      : 2

    console.log("duration", duration)
    setTimeout(() => this.endStage(), duration * 1000)
  }

  pause() {
    this.game.has.weekController.activeFight.pause()
  }
  unpause() {
    this.game.has.weekController.activeFight.unpause()
  }

  private processManagerBets() {
    const { weekNumber, activeFight } = this.game.has.weekController

    this.managersWinnings = this.game.has.managers.map((manager: Manager) => {
      let winnings = 0
      let betWinnings = 0
      let playersFighterWinnings = 0

      const managersBet: Bet | undefined = manager.has.nextFightBet
      let managersBetAmount: number | undefined

      if (managersBet) {
        const betSizePercentage =
          gameConfiguration.betSizePercentages[managersBet.size]
        managersBetAmount = Math.round(
          (manager.has.money * betSizePercentage) / 100
        )
        manager.has.money -= managersBetAmount
        manager.functions.addToLog({
          weekNumber,
          message: `You spent ${managersBetAmount} on a ${managersBet.size} bet on ${managersBet.fighterName}`,
          type: "betting",
        })
      }

      if (activeFight.result == "draw") {
        if (managersBet) {
          manager.functions.addToLog({
            weekNumber,
            message: `The fight was a draw, all managers will get back half of their bet money. You get back ${Math.round(
              managersBetAmount! / 2
            )} of the ${managersBetAmount} you bet on ${
              managersBet.fighterName
            }`,
            type: "betting",
          })
          manager.has.money -= Math.round(managersBetAmount! / 2)
        } else {
          manager.functions.addToLog({
            weekNumber,
            message: `The fight was a draw, all managers will get back half of their bet money.`,
            type: "betting",
          })
        }
      } else if (activeFight.result.winner) {
        const { winner } = activeFight.result
        const {
          playersFighterWinBase,
          betPercentageIncreased,
          betWinningsBase,
          numFightersPercentMultiplier,
          totalPublicityMultiplier,
          mainEventMultiplier,
        } = gameConfiguration.fightWinnings

        const managerWonBet = winner.name == managersBet?.fighterName

        const managersFighter = manager.has.fighters.find(
          (f: Fighter) => f.name == winner.name
        )

        const isMainEvent = this.game.has.weekController.thisWeekIsEvent

        const bonusFromPublicityRating =
          activeFight.fighters.reduce(
            (totalPublicityRating, fighter) =>
              (totalPublicityRating += fighter.state.publicityRating),
            0
          ) * totalPublicityMultiplier

        if (managersBetAmount) {
          if (managerWonBet) {
            const multiplierBasedOnFighters =
              1 +
              (numFightersPercentMultiplier / 100) * activeFight.fighters.length

            winnings += Math.round(
              betWinningsBase +
                bonusFromPublicityRating +
                managersBetAmount * (1 + betPercentageIncreased / 100) +
                (!managersFighter
                  ? 0
                  : playersFighterWinBase *
                    managersFighter.state.publicityRating) *
                  multiplierBasedOnFighters *
                  (isMainEvent ? mainEventMultiplier : 1)
            )
          }
        }

        // manager logs
        if (managerWonBet) {
          manager.functions.addToLog({
            weekNumber,
            message: `${managersBet.fighterName} has won the fight! Your ${
              managersBet.size
            } bet on ${managersBet.fighterName} has won you $${winnings}. ${
              playersFighterWinnings || bonusFromPublicityRating
                ? "Including: "
                : ""
            }${
              playersFighterWinnings
                ? `$${playersFighterWinnings} sponsored fighter bonus.`
                : ""
            }${
              bonusFromPublicityRating
                ? `$${bonusFromPublicityRating} fight publicity bonus.`
                : ""
            }`,
            type: "betting",
          })
        }
        if (managersBet && !managerWonBet && managersFighter) {
          manager.functions.addToLog({
            weekNumber,
            message: `
          Unfortunately ${
            managersBet.fighterName
          } did not win the fight. However your sponsored fighter ${
              winner.name
            } did win earning you ${
              playersFighterWinnings
                ? `$${playersFighterWinnings} sponsored fighter bonus.`
                : ""
            }
        `,
            type: "betting",
          })
        }
        if (!managersBet && managersFighter) {
          manager.functions.addToLog({
            weekNumber,
            message: `
          Although you did not bet on the fight, Your sponsored fighter ${
            winner.name
          } did win earning you ${
              playersFighterWinnings
                ? `$${playersFighterWinnings} sponsored fighter bonus.`
                : ""
            }
        `,
            type: "betting",
          })
        }

        manager.has.money += round(winnings)
      }

      return {
        managerName: manager.has.name,
        winnings,
      }
    })
  }
}
