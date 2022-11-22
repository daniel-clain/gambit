
import FighterFighting from "./fighter-fighting"
import { getProbabilityToRecover } from "./probability-resolver/recover"
import { getProbabilityToCautiousRetreat } from "./probability-resolver/cautious-retreat"
import { getProbabilityToCheckFlank } from "./probability-resolver/check-flank"
import { getProbabilityToCriticalStrike } from "./probability-resolver/critical-strike"
import { getProbabilityToDefend } from "./probability-resolver/defend"
import { getProbabilityToMoveToAttack } from "./probability-resolver/move-to-attack"
import { getProbabilityToPunch } from "./probability-resolver/punch"
import { getProbabilityToDoNothing } from "./probability-resolver/do-nothing"
import { getProbabilityForGeneralAttack } from "./probability-resolver/general-attack"
import { getProbabilityForGeneralRetreat } from "./probability-resolver/general-retreat"
import { OptionProbability } from "../../../helper-functions/helper-functions"
import { getProbabilityToDesperateRetreat } from "./probability-resolver/desperate-retreat"
import { getProbabilityToStrategicRetreat } from "./probability-resolver/strategic-retreat"
import { MainActionName } from "../../../types/fighter/action-name"

export default class DecideActionProbability {
  includeLogs = true
  logs = []
  generalAttackProbability: number
  generalRetreatProbability: number

  constructor(public fighting: FighterFighting) { }

  getProbabilityTo(action: MainActionName): OptionProbability<MainActionName> {
    switch (action) {
      case 'punch':
        return {option: action, probability: getProbabilityToPunch(this.fighting, this.generalAttackProbability)}
      case 'critical strike':
        return {option: action, probability: getProbabilityToCriticalStrike(this.fighting, this.generalAttackProbability)}
      case 'defend':
        return {option: action, probability: getProbabilityToDefend(this.fighting)}


      case 'move to attack':
        return {option: action, probability: getProbabilityToMoveToAttack(this.fighting, this.generalAttackProbability)}
      case 'cautious retreat':
        return {option: action, probability: getProbabilityToCautiousRetreat(this.fighting, this.generalRetreatProbability)}
      case 'strategic retreat':
        return {option: action, probability: getProbabilityToStrategicRetreat(this.fighting, this.generalRetreatProbability)}
      case 'desperate retreat':
        return {option: action, probability: getProbabilityToDesperateRetreat(this.fighting, this.generalRetreatProbability)}


      case 'recover':
        return {option: action, probability: getProbabilityToRecover(this.fighting)}
      case 'check flank':
        return {option: action, probability: getProbabilityToCheckFlank(this.fighting)}
      case 'do nothing':
        return {option: action, probability: getProbabilityToDoNothing(this.fighting)}
    }
  }

  setGeneralAttackAndRetreatProbabilities(){

    this.generalAttackProbability = getProbabilityForGeneralAttack(this.fighting)
    this.generalRetreatProbability = getProbabilityForGeneralRetreat(this.fighting)
  }

  logInstance(name: MainActionName | 'general attack' | 'general retreat'){
    let instance = {
      name,
      entries:[]
    }
    this.includeLogs && this.logs.unshift(instance)
    return (...entryItems) => {
      this.includeLogs &&
      instance.entries.unshift(entryItems)
    }
  }
}


