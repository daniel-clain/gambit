import { round } from "lodash"
import { OptionProbability } from "../../../helper-functions/helper-functions"
import {
  AttackAction,
  AttackResponseAction,
} from "../../../types/fighter/action-name"
import Fighter from "../fighter"
import FighterFighting from "./fighter-fighting"

export default class AttackResponseProbability {
  constructor(public fighting: FighterFighting) {}

  getProbabilityTo(
    action: AttackResponseAction,
    enemy: Fighter,
    attackType: AttackAction
  ): OptionProbability<AttackResponseAction> {
    switch (action) {
      case "dodge":
        return {
          option: action,
          probability: this.getProbabilityToDodge(enemy, attackType),
        }
      case "block":
        return {
          option: action,
          probability: this.getProbabilityToBlock(enemy, attackType),
        }
      case "take hit":
        return {
          option: action,
          probability: this.getProbabilityToTakeHit(),
        }
    }
  }

  getProbabilityToDodge(enemy: Fighter, attackType: AttackAction): number {
    const { speed, intelligence } = this.fighting.stats
    const { fighter, spirit, movement, logistics } = this.fighting

    if (!logistics.getHasDefendOpportunity(enemy)) return 0
    const currentAction = this.fighting.getCurrentAction()

    let probability = this.generalDefendProbability(enemy, attackType)

    probability += speed * 3 - enemy.fighting.stats.speed * 3

    if (movement.moveAction == "strategic retreat") probability += 2
    if (movement.moveAction == "desperate retreat") probability += 4

    if (attackType == "kick") probability += 4

    if (logistics.hasLowStamina) probability += 4

    if (logistics.lowEnergy) {
      probability -= 6
    }
    if (logistics.highEnergy) {
      probability += 6
    }

    if (probability < 0) probability = 0

    if (currentAction == "recover") probability = probability * 0.2 + spirit
    return round(probability, 2)
  }

  getProbabilityToBlock(enemy: Fighter, attackType: AttackAction): number {
    const { strength, speed, intelligence } = this.fighting.stats
    const { spirit, movement, fighter, logistics } = this.fighting

    if (!logistics.getHasDefendOpportunity(enemy)) return 0
    const currentAction = this.fighting.getCurrentAction()

    let probability = this.generalDefendProbability(enemy, attackType)

    if (currentAction == "defend") probability += 10

    if (movement.moveAction == "cautious retreat") probability += 8

    probability += strength * 3 - enemy.fighting.stats.strength * 3

    if (attackType == "punch") probability += 4

    if (logistics.hasFullStamina) probability += 4

    if (probability < 0) probability = 0

    if (currentAction == "recover") probability = probability * 0.2 + spirit
    return round(probability, 2)
  }

  getProbabilityToTakeHit(): number {
    return 5
  }

  generalDefendProbability(enemy: Fighter, attackType: AttackAction): number {
    const { strength, speed, intelligence } = this.fighting.stats
    const { spirit, movement, fighter, logistics } = this.fighting

    const currentAction = this.fighting.getCurrentAction()

    let probability = 0

    if (currentAction == "defend") probability += 6 + intelligence

    if (movement.moveAction == "cautious retreat")
      probability += 4 + intelligence

    if (logistics.lowEnergy) {
      probability -= 10
    }
    if (logistics.highEnergy) {
      probability += 2
    }

    probability += intelligence * 3
    probability += speed
    probability += spirit * 3 - enemy.fighting.spirit * 3

    if (enemy.state.takingADive) {
      probability = probability * 0.2
    }

    return round(probability, 2)
  }
}
