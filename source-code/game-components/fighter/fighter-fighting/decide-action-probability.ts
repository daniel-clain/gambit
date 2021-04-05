
import FighterFighting from "./fighter-fighting"
import { ActionName } from "../../../types/figher/action-name"
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

export default class DecideActionProbability {

  constructor(public fighting: FighterFighting) { }

  getProbabilityTo(action: ActionName): [ActionName, number] {
    switch (action) {
      case 'do nothing':
        return [action, getProbabilityToDoNothing(this.fighting)]
      case 'punch':
        return [action, getProbabilityToPunch(this.fighting)]
      case 'critical strike':
        return [action, getProbabilityToCriticalStrike(this.fighting)]
      case 'defend':
        return [action, getProbabilityToDefend(this.fighting)]
      case 'move to attack':
        return [action, getProbabilityToMoveToAttack(this.fighting)]
      case 'cautious retreat':
        return [action, getProbabilityToCautiousRetreat(this.fighting)]
      case 'retreat around edge':
        return [action, getProbabilityToRetreatAroundEdge(this.fighting)]
      case 'reposition':
        return [action, getProbabilityToReposition(this.fighting)]
      case 'fast retreat':
        return [action, getProbabilityToFastRetreat(this.fighting)]
      case 'retreat':
        return [action, getProbabilityToRetreat(this.fighting)]
      case 'retreat from flanked':
        return [action, getProbabilityToRetreatFromFlanked(this.fighting)]
      case 'recover':
        return [action, getProbabilityToRecover(this.fighting)]
      case 'turn around':
        return [action, getProbabilityToCheckFlank(this.fighting)]
    }
  }
}


