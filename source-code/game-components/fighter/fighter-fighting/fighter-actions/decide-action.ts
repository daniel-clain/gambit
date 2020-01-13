import FighterFighting from "../fighter-fighting";
import Fighter from "../../fighter";

import selectRandomResponseBasedOnProbability from "../random-based-on-probability";
import { PossibleActions } from "../../../../types/figher/possible-actions";

export default class DecideAction {
  constructor(private fighting: FighterFighting){}

  decideAction(){  
    const { proximity, flanking, decideActionProbability, combat, recovery, fighter } = this.fighting


    let closestEnemy: Fighter = proximity.getClosestRememberedEnemy()

    if(proximity.enemyWithinStrikingRange(closestEnemy))
        this.fighting.cancelTimers(['moving to attack'], 'in striking range')
    
    flanking.determineIfFlanked()
    //console.log(`${this.fighting.fighter.name} is ${!this.fighting.flanked ? 'not ' : ''}flanked`);

    let decidedAction: PossibleActions

      const probabilityToPunch: number = decideActionProbability.getProbabilityToPunch(closestEnemy)
      const probabilityToCriticalStrike: number = decideActionProbability.getProbabilityToCriticalStrike(closestEnemy)
      const probabilityToDefend: number = decideActionProbability.getProbabilityToDefend(closestEnemy)
      const probabilityToCautiousRetreat: number = decideActionProbability.getProbabilityToCautiousRetreat(closestEnemy)
      const probabilityToFastRetreat: number = decideActionProbability.getProbabilityToFastRetreat(closestEnemy)
      const probabilityToCheckFlank: number = decideActionProbability.getProbabilityToCheckFlank(closestEnemy)
      const probabilityToRetreatFromFlanked: number = decideActionProbability.getProbabilityToRetreatFromFlanked(closestEnemy)
      const probabilityToMoveToAttack: number = decideActionProbability.getProbabilityToMoveToAttack(closestEnemy)
      const probabilityToRecover: number = decideActionProbability.getProbabilityToRecover()
      const probabilityToRetreat: number = decideActionProbability.getProbabilityToRetreat(closestEnemy)

      

      decidedAction = selectRandomResponseBasedOnProbability([
        { response: 'try to punch', probability: probabilityToPunch },
        { response: 'try to critical strike', probability: probabilityToCriticalStrike },
        { response: 'defend', probability: probabilityToDefend },
        { response: 'do cautious retreat', probability: probabilityToCautiousRetreat },
        { response: 'do fast retreat', probability: probabilityToFastRetreat },
        { response: 'check flank', probability: probabilityToCheckFlank },
        { response: 'retreat from flanked', probability: probabilityToRetreatFromFlanked },
        { response: 'move to attack', probability: probabilityToMoveToAttack },
        { response: 'recover', probability: probabilityToRecover },
        { response: 'retreat', probability: probabilityToRetreat },
      ])
    

    if (decidedAction == 'recover' && this.fighting.stamina >= fighter.fighting.stats.maxStamina)
      debugger

    if(!decidedAction){
      console.log(`${fighter.name} had no decided action so wander around`);
      decidedAction = 'wander around'
    }
    
    console.log(`${fighter.name}'s decided action was to ${decidedAction}, closestEnemy: ${closestEnemy ? closestEnemy.name : 'none'}`);
    switch (decidedAction) {
      case 'move to attack':
        return combat.moveToAttackEnemy(closestEnemy)
      case 'try to punch':
        return combat.tryToPunchEnemy(closestEnemy)
      case 'try to critical strike':
        return combat.tryToCriticalStrikeEnemy(closestEnemy)
      case 'defend':
        return combat.startDefending(closestEnemy)
      case 'do cautious retreat':
        return recovery.doCautiousRetreat(closestEnemy)
      case 'do fast retreat':
        return recovery.doFastRetreat(closestEnemy)
      case 'retreat':
        return recovery.retreatFromEnemy(closestEnemy)
      case 'recover':
        return recovery.startRecovering()
      case 'check flank':
        return recovery.checkFlank()
      case 'retreat from flanked':
        return recovery.retreatFromFlanked()
      case 'wander around':
        return recovery.wanderAround()
    }
  }

};
