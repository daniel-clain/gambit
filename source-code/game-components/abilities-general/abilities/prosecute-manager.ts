import { randomNumber } from "../../../helper-functions/helper-functions"
import { Employee } from "../../../interfaces/front-end-state-interface"
import { Evidence } from "../../../types/game/evidence.type"
import { Lawsuit, LawsuitAccount } from "../../../types/game/lawsuit.type"
import { Game } from "../../game"
import { Manager } from "../../manager"
import { Ability, AbilityData, ServerAbility } from "../ability"

export const prosecuteManager: Ability = {
  name: "Prosecute Manager",
  cost: { money: 500, actionPoints: 1 },
  executes: "End Of Week",
  canOnlyTargetSameTargetOnce: true,
}

type Verdict = {
  weeksInJail: number
  finePercent: number
}

export const prosecuteManagerServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game) {
    const { managers } = game.has
    const { weekNumber } = game.has.weekController
    const { source, target } = abilityData
    const prosecutingManager = managers.find((m) =>
      m.has.employees.find((e) => e.name == source.name)
    )!
    const prosecutedManager = managers.find((m) => m.has.name == target!.name)!
    const lawsuit: Lawsuit = createLawsuit()

    const verdict: Verdict = determineTheVerdict()
    console.log("verdict :>> ", verdict)

    const moneyTakenOffPlayer = takeMoneyOffManager()
    giveMoneyToProsecutingManager()
    concedeEvidence()
    const roundedWeeksInJail = Math.round(verdict.weeksInJail)
    let lostEmployees: Employee[]
    if (roundedWeeksInJail > 0) {
      getPutInJail(roundedWeeksInJail)
      lostEmployees = prosecutedManager.has.employees.filter((e) =>
        ["Drug Dealer", "Hitman", "Thug"].includes(e.profession)
      )
      lostEmployees.forEach((e) => {
        game.functions.resignEmployee(e, prosecutedManager)
      })
    }
    updateManagerLogs()

    //implementation

    function concedeEvidence() {
      const { accounts, prosecutingManager } = lawsuit
      const prosecutingManagerObj = game.has.managers.find(
        (m) => m.has.name == prosecutingManager.name
      )!
      prosecutingManagerObj.has.evidence =
        prosecutingManagerObj.has.evidence.filter(
          (managerEvidence) =>
            !accounts.find((a) =>
              a.evidence.find((e) => e.id == managerEvidence.id)
            )
        )
    }

    function updateManagerLogs() {
      const logMessage = `You have been found guilty on accounts of: ${lawsuit.accounts.reduce(
        (x, a, i) => (x += `\n\t -${a.name}(${a.evidence.length})`),
        ""
      )}

You have been sentenced to ${
        verdict.weeksInJail
      } weeks in jail with a fine of $${moneyTakenOffPlayer}. While in jail, your manager has 0 action points.

${
  lostEmployees?.length
    ? `You have lost the following employees:${lostEmployees.reduce(
        (string, e) => (string += `\n\t - ${e.name} (${e.profession})`),
        ""
      )}`
    : ""
}`

      prosecutedManager.functions.addToLog({
        weekNumber,
        type: "critical",
        message: logMessage,
      })
    }

    function giveMoneyToProsecutingManager() {
      const amount = moneyTakenOffPlayer
      prosecutingManager.has.money += amount
      prosecutingManager.functions.addToLog({
        weekNumber,
        type: "employee outcome",
        message: `You have been awarded $${amount} from a successful court case`,
      })
    }

    function takeMoneyOffManager(): number {
      const moneyTakenOff = Math.round(
        prosecutedManager.has.money * verdict.finePercent
      )
      prosecutedManager.has.money -= moneyTakenOff
      return moneyTakenOff
    }

    function getPutInJail(roundedWeeksInJail: number) {
      prosecutedManager.state.inJail = {
        weeksRemaining: roundedWeeksInJail,
        weeksTotal: roundedWeeksInJail,
        lawsuit,
      }
    }

    function createLawsuit(): Lawsuit {
      return {
        prosecutedManager: prosecutedManager.functions.getInfo(),
        prosecutingManager: prosecutingManager.functions.getInfo(),
        accounts: abilityData.additionalData.reduce(
          (
            accounts: LawsuitAccount[],
            dataItem: { id: string; evidence: Evidence }
          ): LawsuitAccount[] => {
            const accountWithActivity = findAccountWithActivity()
            if (accountWithActivity) {
              accountWithActivity.evidence.push(dataItem.evidence)
            } else {
              accounts.push({
                name: dataItem.evidence.illegalActivity,
                evidence: [dataItem.evidence],
              })
            }
            return accounts

            function findAccountWithActivity() {
              return accounts.find(
                (account) => account.name == dataItem.evidence.illegalActivity
              )
            }
          },
          []
        ),
      }
    }

    /* 
      - for each account of each charge there is a random probability of success or fail
      - opponents lawyer level will compare against your lawyer level to influence the probability
      - opponents lawyers should have a chance to negate all charges if skill level is high enough
    */

    function determineTheVerdict(): Verdict {
      const yourLawyerLevel = getTotalLawyerSkill(prosecutingManager)
      const opponentLawyerLevel = getTotalLawyerSkill(prosecutedManager)

      const baseFinePercentage = 0.15
      const baseWeeksInJail = 0.4
      let totalAccounts = 0

      const verdict = lawsuit.accounts.reduce(
        (verdict, account): Verdict => {
          console.log(account.name)
          switch (account.name) {
            case "administering performance enhancing drugs":
              {
                const severityModifier = 0.8
                account.evidence.forEach((e) => {
                  const guilty = getGuiltyChance()
                  if (guilty) {
                    addOffenceWeeksInJailAndFine(severityModifier)
                    console.log("guilty of doping", verdict)
                  }
                })
              }
              break
            case "administering with intent to harm":
              {
                const severityModifier = 1.2
                account.evidence.forEach((e) => {
                  const guilty = getGuiltyChance()
                  if (guilty) {
                    addOffenceWeeksInJailAndFine(severityModifier)
                    console.log("guilty of poisoning", verdict)
                  }
                })
              }
              break
            case "solicitation to commit homicide":
              {
                const severityModifier = 1.5
                account.evidence.forEach((e) => {
                  const guilty = getGuiltyChance()
                  if (guilty) {
                    addOffenceWeeksInJailAndFine(severityModifier)
                    console.log("guilty of murder", verdict)
                  }
                })
              }
              break
            case "solicited assault":
              {
                account.evidence.forEach((e) => {
                  const severityModifier = 1
                  const guilty = getGuiltyChance()
                  if (guilty) {
                    addOffenceWeeksInJailAndFine(severityModifier)
                    console.log("guilty of assault", verdict)
                  }
                })
              }
              break
            case "supplying illegal substances":
              {
                const severityModifier = 1
                account.evidence.forEach((e) => {
                  const guilty = getGuiltyChance()
                  if (guilty) {
                    addOffenceWeeksInJailAndFine(severityModifier)
                    console.log("guilty of selling drugs", verdict)
                  }
                })
              }
              break
          }
          return verdict

          function addOffenceWeeksInJailAndFine(severityModifier: number) {
            const offenceFine = baseFinePercentage * severityModifier
            const adjustedFine = offenceFine / (1 + totalAccounts)
            const offenceWeeksInJail =
              (baseWeeksInJail * severityModifier) / (1 + totalAccounts / 2)
            const adjustedWeeksInJail = offenceWeeksInJail
            verdict.weeksInJail += adjustedWeeksInJail
            verdict.finePercent += adjustedFine
            totalAccounts++
          }
        },
        { weeksInJail: 0, finePercent: 0 } as Verdict
      )

      return {
        ...verdict,
        weeksInJail: Math.round(verdict.weeksInJail),
      }

      function getTotalLawyerSkill(manager: Manager) {
        return manager.has.employees
          .filter((e) => e.profession == "Lawyer")
          .reduce(
            (totalSkill: number, { skillLevel }) => totalSkill + skillLevel,
            0
          )
      }

      function getGuiltyChance() {
        const guiltyChance = randomNumber({ to: 100 })
        const guilty =
          guiltyChance < 50 + yourLawyerLevel * 30 - opponentLawyerLevel * 30
        return guilty
      }
    }
  },
  onSelected(abilityData: AbilityData, game: Game) {
    const { managers } = game.has
    const { source, target } = abilityData
    const prosecutingManager = managers.find((m) =>
      m.has.employees.find((e) => e.name == source.name)
    )!
    const prosecutedManager = managers.find((m) => m.has.name == target!.name)!
    game.has.weekController.preFightNewsStage.newsItems.push({
      newsType: "manager prosecuted",
      headline: "Lawsuit filed",
      message: `${prosecutingManager.has.name} has filed a lawsuit against ${prosecutedManager.has.name}`,
    })
    prosecutedManager.state.beingProsecuted = true
  },
  ...prosecuteManager,
}
