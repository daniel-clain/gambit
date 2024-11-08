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

    const currentAction = this.fighting.getCurrentAction()

    if (!logistics.getHasDefendOpportunity(enemy)) return 0

    let probability: number = 1

    if (enemy.state.hallucinating) {
      probability -= 6
    }
    if (currentAction == "defend") probability += 4 + intelligence

    if (movement.moveAction == "cautious retreat")
      probability += 2 + intelligence

    probability += speed * 3 - enemy.fighting.stats.speed * 3

    probability += spirit - enemy.fighting.spirit

    probability += intelligence

    if (attackType == "kick") probability += 1

    if (logistics.hasLowStamina) probability++

    if (currentAction == "recover")
      probability = probability * 0.3 + spirit * 0.4

    if (probability < 0) probability = 0

    return probability
  }

  getProbabilityToBlock(enemy: Fighter, attackType: AttackAction): number {
    const { strength, speed, intelligence } = this.fighting.stats
    const { spirit, movement, fighter, logistics } = this.fighting

    if (!logistics.getHasDefendOpportunity(enemy)) return 0

    const currentAction = this.fighting.getCurrentAction()

    let probability: number = 0

    if (currentAction == "defend") probability += 10 + intelligence

    if (movement.moveAction == "cautious retreat") probability += 8

    probability += strength * 3 - enemy.fighting.stats.strength * 3

    probability += speed - enemy.fighting.stats.speed

    probability += spirit - enemy.fighting.spirit

    probability += intelligence

    if (attackType == "punch") probability += 1

    if (logistics.hasFullStamina) probability += 1

    if (enemy.state.takingADive) {
      probability -= 6
    }

    if (currentAction == "recover")
      probability = probability * 0.2 + spirit * 0.5

    if (probability < 0) probability = 0

    return probability
  }

  getProbabilityToTakeHit(): number {
    return 5
  }
}
