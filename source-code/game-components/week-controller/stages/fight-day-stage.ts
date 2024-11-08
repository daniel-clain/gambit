import gameConfiguration from "../../../game-settings/game-configuration"
import {
  ManagersBet,
  ManagerWinnings,
} from "../../../interfaces/front-end-state-interface"
import { Bet } from "../../../interfaces/game/bet"
import IStage from "../../../interfaces/game/stage"
import { WeekStage } from "../../../types/game/week-stage.type"
import Fighter from "../../fighter/fighter"
import { Game } from "../../game"
import { Manager } from "../../manager"

export default class FightDayStage implements IStage {
  name: WeekStage = "Fight Day"
  endStage: (value: void | PromiseLike<void>) => void
  managersWinnings: ManagerWinnings[]
  managersBets: ManagersBet[]

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
    if (activeFight.result == "draw") {
    } else if (activeFight.result?.winner) {
      const { winner } = activeFight.result
      winner.state.numberOfWins++
    }

    this.processManagerBets()

    this.game.has.weekController.triggerUIUpdate()

    const playersHadWinnings = this.managersWinnings?.some(
      (m) => m.winnings > 0
    )
    const duration = playersHadWinnings
      ? gameConfiguration.stageDurations.showWinningsDuration
      : 1
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
      } else if (activeFight.result?.winner) {
        const { winner } = activeFight.result
        const {
          playersFighterMultiplier,
          playersFighterWinBase,
          betWinningsBase,
          betAmountMultiplier,
          totalPublicityMultiplier,
        } = gameConfiguration.fightWinnings

        const managerWonBet = winner.name == managersBet?.fighterName
        const bonusFromPublicityRating =
          this.game.has.weekController.activeFight.fighters.reduce(
            (totalPublicityRating, fighter) =>
              (totalPublicityRating += fighter.state.publicityRating),
            0
          ) * totalPublicityMultiplier

        if (managersBet) {
          if (managerWonBet) {
            winnings += betWinningsBase
            winnings += bonusFromPublicityRating
            betWinnings = Math.round(managersBetAmount! * betAmountMultiplier)
            winnings += betWinnings
          }
        }

        const managersFighter = manager.has.fighters.find(
          (f: Fighter) => f.name == winner.name
        )

        if (managersFighter) {
          winnings += playersFighterWinBase
          playersFighterWinnings = Math.round(
            winnings *
              managersFighter.state.publicityRating *
              playersFighterMultiplier
          )

          winnings += playersFighterWinnings
        }

        if (this.game.has.weekController.thisWeekIsEvent) {
          winnings *= 3
        }

        // manager logs
        if (managerWonBet) {
          manager.functions.addToLog({
            weekNumber,
            message: `
          ${managersBet.fighterName} has won the fight! Your ${
              managersBet.size
            } bet on ${managersBet.fighterName} has won you $${winnings}. 
          ${
            playersFighterWinnings || bonusFromPublicityRating
              ? "Including: "
              : ""
          }
          ${
            playersFighterWinnings
              ? `$${playersFighterWinnings} sponsored fighter bonus.`
              : ""
          }
          ${
            bonusFromPublicityRating
              ? `$${bonusFromPublicityRating} fight publicity bonus.`
              : ""
          }
        `,
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

        manager.has.money += winnings
      }

      return {
        managerName: manager.has.name,
        winnings,
      }
    })
  }
}
