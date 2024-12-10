import { OptionProbability } from "../../../helper-functions/helper-functions"
import { DecideActionName } from "../../../types/fighter/action-name"
import FighterFighting from "./fighter-fighting"
import { getProbabilityToCautiousRetreat } from "./probability-resolver/cautious-retreat"
import { getProbabilityToCheckFlank } from "./probability-resolver/check-flank"
import { getProbabilityToDefend } from "./probability-resolver/defend"
import { getProbabilityToDesperateRetreat } from "./probability-resolver/desperate-retreat"
import { getProbabilityToDoNothing } from "./probability-resolver/do-nothing"
import { getProbabilityForGeneralAttack } from "./probability-resolver/general-attack"
import { getProbabilityForGeneralRetreat } from "./probability-resolver/general-retreat"
import { getProbabilityToKick } from "./probability-resolver/kick"
import { getProbabilityToMoveToAttack } from "./probability-resolver/move-to-attack"
import { getProbabilityToPunch } from "./probability-resolver/punch"
import { getProbabilityToRecover } from "./probability-resolver/recover"
import { getProbabilityToStrategicRetreat } from "./probability-resolver/strategic-retreat"

export default class DecideActionProbability {
  includeLogs = true
  logs: any = []
  generalAttackProbability: number | null
  generalRetreatProbability: number | null

  constructor(public fighting: FighterFighting) {}

  getProbabilityTo(
    action: DecideActionName
  ): OptionProbability<DecideActionName> {
    switch (action) {
      case "punch":
        return {
          option: action,
          probability: getProbabilityToPunch(
            this.fighting,
            this.generalAttackProbability
          ),
        }
      case "kick":
        return {
          option: action,
          probability: getProbabilityToKick(
            this.fighting,
            this.generalAttackProbability
          ),
        }
      case "defend":
        return {
          option: action,
          probability: getProbabilityToDefend(this.fighting),
        }

      case "move to attack":
        return {
          option: action,
          probability: getProbabilityToMoveToAttack(
            this.fighting,
            this.generalAttackProbability
          ),
        }
      case "cautious retreat":
        return {
          option: action,
          probability: getProbabilityToCautiousRetreat(
            this.fighting,
            this.generalRetreatProbability
          ),
        }
      case "strategic retreat":
        return {
          option: action,
          probability: getProbabilityToStrategicRetreat(
            this.fighting,
            this.generalRetreatProbability
          ),
        }
      case "desperate retreat":
        return {
          option: action,
          probability: getProbabilityToDesperateRetreat(
            this.fighting,
            this.generalRetreatProbability
          ),
        }

      case "recover":
        return {
          option: action,
          probability: getProbabilityToRecover(this.fighting),
        }
      case "check flank":
        return {
          option: action,
          probability: getProbabilityToCheckFlank(this.fighting),
        }
      default:
        return {
          option: action,
          probability: getProbabilityToDoNothing(this.fighting),
        }
    }
  }

  setGeneralAttackAndRetreatProbabilities() {
    this.generalAttackProbability = getProbabilityForGeneralAttack(
      this.fighting
    )
    this.generalRetreatProbability = getProbabilityForGeneralRetreat(
      this.fighting
    )
  }

  logInstance(name: DecideActionName | "general attack" | "general retreat") {
    let instance = {
      name,
      entries: [] as any[],
    }

    this.includeLogs && this.logs.unshift(instance)

    return (...entryItems: any[]) => {
      this.includeLogs && instance.entries.unshift(entryItems)
    }
  }
}
