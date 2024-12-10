import {
  ContractOffer,
  GoalContract,
} from "../../interfaces/game/contract.interface"
import { ExecutesWhenOptions } from "../../types/game/executes-when-options"
import { Game } from "../game"
import { assaultFighterServer } from "./abilities/assault-fighter"
import { doSurveillanceServer } from "./abilities/do-surveillance"
import { dominationVictoryServer } from "./abilities/domination-victory"
import { dopeFighterServer } from "./abilities/dope-fighter"
import { guardFighterServer } from "./abilities/guard-fighter"
import { investigateManagerServer } from "./abilities/investigate-manager"
import { murderFighterServer } from "./abilities/murder-fighter"
import { offerContractServer } from "./abilities/offer-contract"
import { poisonFighterServer } from "./abilities/poison-fighter"
import { promoteFighterServer } from "./abilities/promote-fighter"
import { prosecuteManagerServer } from "./abilities/prosecute-manager"
import { researchFighterServer } from "./abilities/research-fighter"
import { sellDrugsServer } from "./abilities/sell-drugs"
import { sinisterVictoryServer } from "./abilities/sinister-victory"
import { takeADiveServer } from "./abilities/take-a-dive"
import { trainFighterServer } from "./abilities/train-fighter"
import { wealthVictoryServer } from "./abilities/wealth-victory"
import { AbilityData, ServerAbility } from "./ability"

import { round } from "lodash"
import { randomNumber } from "../../helper-functions/helper-functions"
import { giveUpServer } from "./abilities/give-up"
import { getAbilitySourceManager } from "./ability-service-server"

export interface AbilityProcessor {
  delayedExecutionAbilities: AbilityData[]
  processSelectedAbility(selectedAbility: AbilityData): void
}

export class AbilityProcessor {
  /* needs an implementation class */

  constructor(private game: Game) {}

  private abilities: ServerAbility[] = [
    assaultFighterServer,
    doSurveillanceServer,
    guardFighterServer,
    murderFighterServer,
    offerContractServer,
    poisonFighterServer,
    promoteFighterServer,
    researchFighterServer,
    sellDrugsServer,
    prosecuteManagerServer,
    takeADiveServer,
    trainFighterServer,
    dopeFighterServer,
    investigateManagerServer,
    dominationVictoryServer,
    sinisterVictoryServer,
    wealthVictoryServer,
    giveUpServer,
  ]
  delayedExecutionAbilities: AbilityData[] = []

  executeAbilities(executes: ExecutesWhenOptions) {
    if (executes == "End Of Week") {
      const offerContractInstances = this.delayedExecutionAbilities.filter(
        (delayedAbility) => delayedAbility.name == "Offer Contract"
      )
      const offerContractAbility = this.abilities.find(
        (ability) => ability.name == "Offer Contract"
      )!
      this.handleOfferContractInstances(
        offerContractAbility,
        offerContractInstances
      )
    }

    const sortedAbilitiesToExecute = this.delayedExecutionAbilities
      .map(
        (
          delayedAbility: AbilityData
        ): { ability: ServerAbility; abilityData: AbilityData } => ({
          ability: this.abilities.find(
            (ability) => ability.name == delayedAbility.name
          )!,
          abilityData: delayedAbility,
        })
      )
      .filter(({ ability }: { ability: ServerAbility }) => {
        if (ability.name == "Offer Contract") return false
        if (
          ability.executes instanceof Array
            ? ability.executes.includes(executes)
            : ability.executes == executes
        )
          return true
        else return false
      })
      .sort((a, b) =>
        !a.ability.priority
          ? 1
          : !b.ability.priority
          ? -1
          : a.ability.priority - b.ability.priority
      )

    sortedAbilitiesToExecute.forEach(
      ({
        ability,
        abilityData,
      }: {
        ability: ServerAbility
        abilityData: AbilityData
      }) => {
        const { source, target } = abilityData
        if (target?.characterType == "Fighter") {
          const fighter = this.game.has.fighters.find(
            (fighter) => fighter.name == target.name
          )!

          if (fighter.state.dead) {
            const { weekNumber } = this.game.has.weekController
            const sourceManager = getAbilitySourceManager(source, this.game)
            sourceManager.functions.addToLog({
              weekNumber,
              message: `Attempt to ${ability.name} targeting ${target.name} failed because he was found dead`,
              type: "employee outcome",
            })
            return
          } else {
            ability.execute(abilityData, this.game, executes)
          }
        } else {
          ability.execute(abilityData, this.game, executes)
        }
      }
    )

    this.game.functions.triggerUIUpdate()

    let indexToBeRemoved
    while (indexToBeRemoved != -1) {
      if (indexToBeRemoved != undefined)
        this.delayedExecutionAbilities.splice(indexToBeRemoved, 1)
      indexToBeRemoved = this.delayedExecutionAbilities.findIndex(
        (delayedAbility: AbilityData) => {
          const abilityExecutes = this.abilities.find(
            (ability) => ability.name == delayedAbility.name
          )!.executes

          if (abilityExecutes instanceof Array) {
            return abilityExecutes.reduce(
              (isFinalTimeExecuted: boolean, executeTime) => {
                if (isFinalTimeExecuted) return true

                if (executeTime == "End Of Week" && executeTime == executes)
                  return true

                if (
                  executeTime == "End Of Manager Options Stage" &&
                  executeTime == executes &&
                  !abilityExecutes.includes("End Of Week")
                ) {
                  return true
                }

                if (
                  executeTime == "Instantly" &&
                  executeTime == executes &&
                  !abilityExecutes.includes("End Of Manager Options Stage") &&
                  !abilityExecutes.includes("End Of Week")
                )
                  return true

                return false
              },
              false
            )
          } else return abilityExecutes == executes
        }
      )
    }
  }

  processSelectedAbility = (abilityData: AbilityData) => {
    const { target, source } = abilityData
    const ability: ServerAbility = this.abilities.find(
      (ability) => ability.name == abilityData.name
    )!
    console.log("ability", ability)
    this.subtractCost(ability, abilityData)
    const { weekNumber } = this.game.has.weekController

    const manager = getAbilitySourceManager(source, this.game)

    manager.functions.addToLog({
      message: `Used ability ${abilityData.name}${
        target ? `, targeting ${target.name}` : ""
      }`,
      weekNumber,
    })

    ability.onSelected?.(abilityData, this.game)

    if (ability.executes == "Instantly") {
      ability.execute(abilityData, this.game)
      this.game.functions.triggerUIUpdate()
    } else this.delayedExecutionAbilities.push(abilityData)

    this.game.functions.triggerUIUpdate()
  }

  private subtractCost(ability: ServerAbility, abilityData: AbilityData) {
    const { source } = abilityData

    const manager = getAbilitySourceManager(source, this.game)

    ;(
      (source.characterType == "Manager" && manager.has) ||
      manager.has.employees.find((e) => e.name == source.name)!
    ).actionPoints -= ability.cost.actionPoints

    manager.has.money -= ability.cost.money
  }

  private handleOfferContractInstances(
    offerContractAbility: ServerAbility,
    offerContractInstances: AbilityData[]
  ) {
    const { weekController, fighters } = this.game.has
    const { jobSeekers, weekNumber } = weekController
    const offerContractTargets = getOffersArray(this.game)

    offerContractTargets.forEach((offerContractTarget) => {
      const jobSeeker = jobSeekers.find(
        (j) => j.name == offerContractTarget.targetName
      )
      if (offerContractTarget.instances.length == 1) {
        offerContractAbility.execute(
          offerContractTarget.instances[0],
          this.game
        )
        return
      }

      const sortedInstances = sortBestOffer(offerContractTarget.instances)
      // get all equal hightest offers
      const bestOfferInstances = sortedInstances.filter(
        (instance) =>
          instance.additionalData.contractOffer.weeklyCost ==
          sortedInstances[0].additionalData.contractOffer.weeklyCost
      )

      let selectedSourceName: string

      const numberOfTiedInstances = bestOfferInstances.length
      if (numberOfTiedInstances == 1)
        selectedSourceName = bestOfferInstances[0].source.name
      else {
        const randomSelection = round(
          randomNumber({ to: numberOfTiedInstances - 1 })
        )
        selectedSourceName = bestOfferInstances[randomSelection].source.name
      }
      offerContractTarget.instances.forEach((offerContractInstance) => {
        if (offerContractInstance.source.name == selectedSourceName)
          offerContractAbility.execute(offerContractInstance, this.game)
        else {
          const { target } = offerContractInstance
          const manager = getAbilitySourceManager(
            offerContractInstance.source,
            this.game
          )
          const { weekNumber } = this.game.has.weekController

          manager.functions.addToLog({
            weekNumber,
            message: `${target!.name} (${
              jobSeeker?.profession ? jobSeeker.profession : jobSeeker!.type
            }) rejected your contract offer because he has accepted the offer of another manager`,
            type: "report",
          })
        }
      })
    })

    this.game.functions.triggerUIUpdate()

    /* implementation */

    function getOffersArray(
      game: Game
    ): { targetName: string; instances: AbilityData[] }[] {
      const offers: { targetName: string; instances: AbilityData[] }[] = []

      offerContractInstances.forEach((offerContractInstance) => {
        const { target, source, additionalData } = offerContractInstance
        const jobSeeker = jobSeekers.find(
          (jobSeeker) => jobSeeker.name == target!.name
        )
        const contractOffer: ContractOffer = additionalData.contractOffer

        let goalContract: GoalContract | undefined
        if (jobSeeker) goalContract = jobSeeker.goalContract
        else
          goalContract = fighters.find(
            (fighter) => fighter.name == target!.name
          )!.state.goalContract!

        const randomThreshold = round(randomNumber({ to: 5 }) + 5) / 10
        if (
          goalContract &&
          contractOffer.weeklyCost < goalContract.weeklyCost * randomThreshold
        ) {
          const manager = getAbilitySourceManager(
            offerContractInstance.source,
            game
          )

          manager.functions.addToLog({
            weekNumber,
            message: `Job seeker ${target!.name} (${
              !jobSeeker
                ? "Fighter"
                : jobSeeker.type == "Fighter"
                ? "Fighter"
                : jobSeeker.profession
            }) rejected your contract offer because you offered too little`,
            type: "report",
          })
          return
        }

        const targetExists = offers.find(
          (offerContractTarget) =>
            offerContractTarget.targetName == offerContractInstance.target!.name
        )
        if (!targetExists)
          offers.push({
            targetName: offerContractInstance.target!.name,
            instances: [offerContractInstance],
          })
        else targetExists.instances.push(offerContractInstance)
      })
      return offers
    }

    function sortBestOffer(
      offerContractInstances: AbilityData[]
    ): AbilityData[] {
      return offerContractInstances.sort(
        (abilityDataA: AbilityData, abilityDataB: AbilityData) => {
          const a = abilityDataA.additionalData.contractOffer.weeklyCost
          const b = abilityDataB.additionalData.contractOffer.weeklyCost
          return a > b ? -1 : a < b ? 1 : 0
        }
      )
    }
  }
}
