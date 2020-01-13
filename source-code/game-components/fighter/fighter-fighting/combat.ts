import FighterFighting from "./fighter-fighting";
import Fighter from "../fighter";
import { HitDamage } from "../../../types/figher/hitDamage";
import { AttackType } from "../../../types/figher/attack-types";
import AttackResponseProbability from "./attack-response-probability";
import selectRandomResponseBasedOnProbability from "./random-based-on-probability";
import { PossibleAttackResponses } from "../../../types/figher/possible-attack-responses";



export default class Combat {

  enemyTargetedForAttack: Fighter
  retreatingFromEnemy: Fighter

  noActionForAWhile = false

  attackResponseProbability

  constructor(public fighting: FighterFighting){
    this.attackResponseProbability = new AttackResponseProbability(fighting)
  }



  moveToAttackEnemy(closestEnemy: Fighter){
    const {actions, timers, movement, proximity, activeTimers} = this.fighting
    
    this.fighting.cancelTimers(['doing cautious retreat', 'doing fast retreat', 'retreating from flanked', 'retreating'], 'started moving to attack')

    this.enemyTargetedForAttack = closestEnemy
    
    if(!activeTimers.some(timer => timer.name == 'moving to attack'))
    this.fighting.startTimer(timers.movingToAttack)

    movement.reverseMoving = proximity.hasVerticleOverlapWithEnemy(closestEnemy)
          

    movement.movingDirection = proximity.getDirectionOfFighter(closestEnemy)
    if(this.fighting.actions.actionInProgress != 'turning around')
      this.fighting.actions.startAction(actions.moveABit)
      .catch(reason => reason)
  }

  
  async startDefending(closestEnemy: Fighter) {   
    const {proximity} = this.fighting
    const {defend, turnAround} = this.fighting.actions
    
    let turnInterupted

    if(proximity.isFacingAwayFromEnemy(closestEnemy)){
      await this.fighting.actions.startAction(turnAround)
      .catch(() => turnInterupted = true)
      if(turnInterupted)
        return      
    }
    
    this.fighting.actions.startAction(defend)
  }

  
  async tryToPunchEnemy(closestEnemy: Fighter) { 
    
    const {actions, proximity} = this.fighting

    let turnInterupted

    if(proximity.isFacingAwayFromEnemy(closestEnemy)){
      await this.fighting.actions.startAction(actions.turnAround)
      .catch(() => turnInterupted = true)
      if(turnInterupted)
        return
    }
    
    this.enemyTargetedForAttack = closestEnemy
    this.resetNoActionTimer()
    
    this.fighting.actions.startAction(actions.tryToPunch)
    .then(() => {

      const success: boolean = closestEnemy.fighting.combat.getAttacked(this.fighting.fighter, 'punch')
      if(success){
        this.fighting.actions.startAction(actions.punch)
      }
      else {
        this.fighting.actions.startAction(actions.missedPunch)
      }    
    })
  }


  async tryToCriticalStrikeEnemy(closestEnemy: Fighter){
    
    const {actions, proximity} = this.fighting

    let turnInterupted

    if(proximity.isFacingAwayFromEnemy(closestEnemy)){
      await this.fighting.actions.startAction(actions.turnAround)
      .catch(() => turnInterupted = true)
      if(turnInterupted)
        return      
    }
    
    this.enemyTargetedForAttack = closestEnemy
    this.resetNoActionTimer()

    try{
      await this.fighting.actions.startAction(actions.tryToCriticalStrike)
      const success: boolean = closestEnemy.fighting.combat.getAttacked(this.fighting.fighter, 'critical strike')
      if(success)
         this.fighting.actions.startAction(actions.criticalStrike)
      else
        this.fighting.actions.startAction(actions.missedCriticalStrike)
    }catch{console.log('critical strike interupted');}
  }
  

  getAttacked(enemy: Fighter, attackType: AttackType): boolean {  

    const {proximity, fighter} = this.fighting

    if(proximity.isEnemyBehind(enemy)){
      console.log(`behind attack by ${enemy.name} on ${fighter.name}, ${fighter.name} will remember that ${enemy.name} is behind him`);
      proximity.rememberEnemyBehind(enemy)
    }

    const probabilityToDodge: number = this.attackResponseProbability.getProbabilityToDodge(enemy, attackType)
    const probabilityToBlock: number = this.attackResponseProbability.getProbabilityToBlock(enemy, attackType)
    const probabilityToTakeHit: number = this.attackResponseProbability.getProbabilityToTakeHit(enemy, attackType)

    const result: PossibleAttackResponses = selectRandomResponseBasedOnProbability([
      {response: 'dodge', probability: probabilityToDodge},
      {response: 'block', probability: probabilityToBlock},
      {response: 'take hit', probability: probabilityToTakeHit},
    ])


    switch(result){
      case 'dodge' : 
        this.dodgeEnemyAttack(enemy, attackType)
        return false
      case 'block' : 
        this.blockEnemyAttack(enemy, attackType)
        return false
      case 'take hit' : 
        return true
    }
  }  


  blockEnemyAttack(fighter: Fighter, attackType: AttackType){
    const {actions} = this.fighting
    console.log(`${this.fighting.fighter.name} blocked ${fighter.name}'s ${attackType}`);
    this.fighting.actions.startAction(actions.block)
    .catch(reason => reason)
  }


  dodgeEnemyAttack(fighter: Fighter, attackType: AttackType){
    const {actions} = this.fighting
    console.log(`${this.fighting.fighter.name} dodged ${fighter.name}'s ${attackType}`);    
    this.fighting.actions.startAction(actions.dodge)
    .catch(reason => reason)
  }


  takeAHit(attackType: AttackType, attackingFighter: Fighter){    

    let {spirit, stamina, fighter, actions} = this.fighting
    const {aggression, strength} = attackingFighter.fighting.stats
    
    let hitDamage: HitDamage
    if(attackType == 'critical strike'){
      hitDamage = Math.round(aggression + strength * .5) as HitDamage
    } else {
      hitDamage = Math.round(strength * .5) as HitDamage
    } 
    if(spirit != 0)
    this.fighting.spirit --
      this.fighting.stamina = stamina - hitDamage
    console.log(`${fighter.name} took ${hitDamage} from ${attackingFighter.name}'s ${attackType} attack`);
    this.fighting.actions.startAction(actions.takeAHit)
    .catch(reason => reason)
    
  }


  getKnockedOut(){   
    this.fighting.knockedOut = true
    this.fighting.actions.cancelAction('is knocked out')
    this.fighting.modelState = 'Knocked Out'
    const message = `${this.fighting.fighter.name} has been knocked out`
    console.warn(message);
  }


  resetNoActionTimer(){
    const {timers} = this.fighting
    this.noActionForAWhile = false
    this.fighting.startTimer(timers.noActionForAWhile)
  }

}
