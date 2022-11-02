
import FighterFighting from "./fighter-fighting"
import { ActionName } from "../../../types/fighter/action-name"
import { getProbabilityToRecover } from "./probability-resolver/getProbabilityToRecover"
import { getProbabilityToRetreat } from "./probability-resolver/getProbabilityToRetreat"
import { getProbabilityToCautiousRetreat } from "./probability-resolver/getProbabilityToCautiousRetreat"
import { getProbabilityToCheckFlank } from "./probability-resolver/getProbabilityToCheckFlank"
import { getProbabilityToCriticalStrike } from "./probability-resolver/getProbabilityToCriticalStrike"
import { getProbabilityToDefend } from "./probability-resolver/getProbabilityToDefend"
import { getProbabilityToFastRetreat } from "./probability-resolver/getProbabilityToFastRetreat"
import { getProbabilityToMoveToAttack } from "./probability-resolver/getProbabilityToMoveToAttack"
import { getProbabilityToPunch } from "./probability-resolver/getProbabilityToPunch"
import { getProbabilityToReposition } from "./probability-resolver/getProbabilityToReposition"
import { getProbabilityToRetreatAroundEdge } from "./probability-resolver/getProbabilityToRetreatAroundEdge"
import { getProbabilityToRetreatFromFlanked } from "./probability-resolver/getProbabilityToRetreatFromFlanked"
import { getProbabilityToDoNothing } from "./probability-resolver/getProbabilityToDoNothing"
import { getProbabilityForGeneralAttack } from "./probability-resolver/getProbabilityForGeneralAttack"
import { getProbabilityForGeneralRetreat } from "./probability-resolver/getProbabilityForGeneralRetreat"
import { ActionProbability } from "./random-based-on-probability"

export default class DecideActionProbability {
  includeLogs = true
  logs = []
  generalAttackProbability: number
  generalRetreatProbability: number

  constructor(public fighting: FighterFighting) { }

  getProbabilityTo(action: ActionName): ActionProbability {
    switch (action) {
      case 'do nothing':
        return {action, probability: getProbabilityToDoNothing(this.fighting)}
      case 'punch':
        return {action, probability: getProbabilityToPunch(this.fighting)}
      case 'critical strike':
        return {action, probability: getProbabilityToCriticalStrike(this.fighting)}
      case 'defend':
        return {action, probability: getProbabilityToDefend(this.fighting)}
      case 'move to attack':
        return {action, probability: getProbabilityToMoveToAttack(this.fighting)}
      case 'cautious retreat':
        return {action, probability: getProbabilityToCautiousRetreat(this.fighting)}
      case 'retreat around edge':
        return {action, probability: getProbabilityToRetreatAroundEdge(this.fighting)}
      case 'reposition':
        return {action, probability: getProbabilityToReposition(this.fighting)}
      case 'fast retreat':
        return {action, probability: getProbabilityToFastRetreat(this.fighting)}
      case 'retreat':
        return {action, probability: getProbabilityToRetreat(this.fighting)}
      case 'retreat from flanked':
        return {action, probability: getProbabilityToRetreatFromFlanked(this.fighting)}
      case 'recover':
        return {action, probability: getProbabilityToRecover(this.fighting)}
      case 'turn around':
        return {action, probability: getProbabilityToCheckFlank(this.fighting)}
    }
  }

  setGeneralAttackAndRetreatProbabilities(){

    this.generalAttackProbability = getProbabilityForGeneralAttack(this.fighting)
    this.generalRetreatProbability = getProbabilityForGeneralRetreat(this.fighting)
  }

  logInstance(name: ActionName){
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


