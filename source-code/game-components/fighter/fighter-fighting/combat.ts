import FighterFighting from "./fighter-fighting";
import Proximity from "./proximity";
import Fighter from "../fighter";
import { random } from "../../../helper-functions/helper-functions";
import Direction360 from "../../../types/figher/direction-360";
import { ResponseToFighterAttack } from "../../../types/figher/responseToFighterAttack";
import { HitDamage } from "../../../types/figher/hitDamage";
import { fighterModelImages } from "../../../client/images/fighter/fighter-model-images";
import CombatProbability from "./combat-probability";
import { Closeness } from "../../../types/figher/closeness";
import { ResponseToFighter } from "../../../interfaces/game/fighter/responseToFighter";

export default class Combat {
  fighterTargetedForAttack: Fighter
  retreatingFromFighter: Fighter

  noActionForAWhile: boolean
  noActionTimer

  movingToAttackTimerActive: boolean
  movingToAttackTimer

  
  retreatingTimerActive: boolean
  retreatingTimer

  justBlocked: boolean
  justDodged: boolean

  justDidAttack: boolean
  justDidAttackTimer

  speedBoost: boolean
  speedBoostTimer

  onRampage: boolean
  rampageTimer

  animationTimes = {
    punch: 900* 2,
    criticalStrike: 1000* 2,
    block: 600* 2,
    dodge: 900* 2,
    takeAHit: 900* 2
  }

  cooldowns

  combatProbability: CombatProbability

  constructor(public fighterFighting: FighterFighting){    
    this.combatProbability = new CombatProbability(this)
    this.resetNoActionTimer()
    const {speed} = this.fighterFighting.fighter.state
    this.cooldowns = {
      punch: Number(((900 * 2) - speed * 100).toFixed(1)),
      criticalStrike: Number(((900 * 2) - speed * 300).toFixed(1)),
      block: Number(((600 * 2) - speed * 100).toFixed(1)),
      dodge: Number(((700 * 2) - speed * 100).toFixed(1)),
      takeAHit: Number(((800 * 2) - speed * 100).toFixed(1))
    }
  }

  respondToFighter(closeness: Closeness): ResponseToFighter{
    const fighter = this.fighterFighting.proximity.getClosestFighterInfront()
    const probailityToAttack: number = this.combatProbability.getProbabilityToAttack(fighter)
    const probailityToDefend: number = closeness == 'nearby' ? 0 : this.combatProbability.getProbabilityToDefend(fighter)
    const probailityToRetreat: number = this.combatProbability.getProbabilityToRetreat(fighter)

    const totalProbability = probailityToAttack + probailityToDefend + probailityToRetreat

    const randomNum = random(totalProbability)
    let probabilityRange: number = 0
    let result: ResponseToFighter

    if (randomNum >= probabilityRange && randomNum < probailityToAttack + probabilityRange) {
      this.fighterTargetedForAttack = fighter
      result = 'attack'

    } else {
      this.fighterTargetedForAttack = undefined
    }
    probabilityRange += probailityToAttack

    if (randomNum >= probabilityRange && randomNum < probailityToDefend + probabilityRange) {
      result = 'defend'
    }
    probabilityRange += probailityToDefend

    if (randomNum >= probabilityRange && randomNum < probailityToRetreat + probabilityRange) {
      this.retreatingFromFighter = fighter   
      result = 'retreat'
    }
    return result
  }
  



  moveToAttackFighter(){
    const {proximity, fighter, movement} = this.fighterFighting

    if(this.retreatingTimerActive){
      clearTimeout(this.retreatingTimer)
      this.retreatingTimerActive = false
    }
    if(!this.movingToAttackTimerActive){
      this.movingToAttackTimerActive = true
      this.movingToAttackTimer = setTimeout(() => {
        this.movingToAttackTimerActive = false
      }, 1000)
      console.log(`${fighter.name} moving to attacking ${this.fighterTargetedForAttack.name}`);
    }

    movement.movingDirection = proximity.getDirectionOfFighter(this.fighterTargetedForAttack)  
    const moveSpeed = movement.moveSpeed()
    this.fighterFighting.startAction(moveSpeed, 'moving to attack')
    movement.moveABit()

  }

  startDefending() {   
    this.fighterFighting.startAction(1500, 'defending')
  }

  retreatFromFighter() {
    const {proximity, movement} = this.fighterFighting

    
    if(this.movingToAttackTimerActive){
      clearTimeout(this.movingToAttackTimer)
      this.movingToAttackTimerActive = false
    }
    if(!this.retreatingTimerActive){
      this.retreatingTimerActive = true
      this.retreatingTimer = setTimeout(() => {
        this.retreatingTimerActive = false
      }, 1000)
      console.log(`${this.fighterFighting.fighter.name} retreating from ${this.retreatingFromFighter.name}`);
    }
    movement.movingDirection = proximity.getDirectionOfFighter(this.retreatingFromFighter, true)    
    
    const moveSpeed = movement.moveSpeed()
    this.fighterFighting.startAction(moveSpeed, 'retreating')
    movement.moveABit()      
  }
  
  tryToHitFighter() {    
    console.log(`${this.fighterFighting.fighter.name} trying to hit ${this.fighterTargetedForAttack.name}`);
    this.resetNoActionTimer()
    const result: ResponseToFighterAttack = this.fighterTargetedForAttack.fighting.combat.getAttacked(this.fighterFighting.fighter)
    if(result == 'take critical hit'){
      this.fighterFighting.soundsMade.push({soundName: 'Critical Strike', time: Date.now()})
      this.fighterFighting.startAction(this.animationTimes.criticalStrike, 'critical striking')
      .then(() => this.afterTryToHitFighter(result))
    } 
    else {
      if(result == 'take hit'){
        this.fighterFighting.soundsMade.push({soundName: 'Punch', time: Date.now()})
      } 
      this.fighterFighting.startAction(this.animationTimes.punch, 'punching')
      .then(() => this.afterTryToHitFighter(result))
    }
  }


  
  getAttacked(fighter: Fighter): ResponseToFighterAttack {  
    //console.log(this.fighterFighting.fighter.name + ' was attacked by ' + fighter.name);
    this.resetNoActionTimer()
    let result: ResponseToFighterAttack
    if (this.fighterFighting.proximity.isFacingFighter(fighter)) {
      result = this.respondToFighterAttack(fighter)
    }
    else{
      result = this.takeUnprparedAttack(fighter)
    }
    switch(result){
      case 'dodged' : this.dodgeFighterAttack(fighter); break
      case 'blocked' : this.blockFighterAttack(fighter); break
      case 'take hit' :
      case 'take critical hit' : {
        this.takeAHit(result, fighter)
      } break
    }
    return result
  }


  respondToFighterAttack(fighter: Fighter): ResponseToFighterAttack{
    
    const probailityToDodge: number = this.combatProbability.getProbabilityToDodge(fighter)
    const probailityToBlock: number = this.combatProbability.getProbabilityToBlock(fighter)
    const probailityToTakeHit: number = this.combatProbability.getProbabilityToTakeHit(fighter)
    const probailityToTakeCriticalHit: number = this.combatProbability.getProbabilityToTakeCriticalHit(fighter)

    const totalProbability = probailityToDodge + probailityToBlock + probailityToTakeHit + probailityToTakeCriticalHit

    const randomNum = random(totalProbability)
    let probabilityRange: number = 0

    if (randomNum >= probabilityRange && randomNum < probailityToDodge + probabilityRange) {
      return 'dodged'
    }
    probabilityRange += probailityToDodge

    if (randomNum >= probabilityRange && randomNum < probailityToBlock + probabilityRange) {
      return 'blocked'
    }
    probabilityRange += probailityToBlock

    if (randomNum >= probabilityRange && randomNum < probailityToTakeHit + probabilityRange) {
      return'take hit'
    }    
    probabilityRange += probailityToTakeHit

    if (randomNum >= probabilityRange && randomNum < probailityToTakeCriticalHit + probabilityRange) {
      return 'take critical hit'
    }
  }


  takeUnprparedAttack(fighter: Fighter): ResponseToFighterAttack {
    
    const probailityToTakeHit: number = this.combatProbability.getProbabilityToTakeHit(fighter)
    const probailityToTakeCriticalHit: number = this.combatProbability.getProbabilityToTakeCriticalHit(fighter)

    const totalProbability = probailityToTakeHit + probailityToTakeCriticalHit

    const randomNum = random(totalProbability)
    let probabilityRange: number = 0

    
    if (randomNum >= probabilityRange && randomNum < probailityToTakeHit + probabilityRange) {
      return'take hit'
    }    
    probabilityRange += probailityToTakeHit

    if (randomNum >= probabilityRange && randomNum < probailityToTakeCriticalHit + probabilityRange) {
      return 'take critical hit'
    }
  }

  

  blockFighterAttack(fighter: Fighter){
    console.log(`${this.fighterFighting.fighter.name} blocked ${fighter.name}'s attack`);
    this.fighterFighting.soundsMade.push({soundName: 'Block', time: Date.now()})
    this.fighterFighting.startAction(this.animationTimes.block, 'blocking')
    .then(() => this.afterBlock())

  }

  dodgeFighterAttack(fighter: Fighter){
    console.log(`${this.fighterFighting.fighter.name} dodged ${fighter.name}'s attack`);    
    this.fighterFighting.soundsMade.push({soundName: 'Dodge', time: Date.now()})
    this.fighterFighting.startAction(this.animationTimes.dodge, 'dodging')
    .then(() => this.afterDodge())

  }


  takeAHit(result: ResponseToFighterAttack, attackingFighter: Fighter){    

    let {spirit, stamina, fighter} = this.fighterFighting
    const {aggression, strength} = attackingFighter.state

    
    let hitDamage: HitDamage
    if(result == 'take critical hit'){
      hitDamage = Math.round(aggression + strength * .5) as HitDamage
    } else {
      hitDamage = Math.round(strength * .5) as HitDamage
    } 
    if(spirit != 0)
    this.fighterFighting.spirit --
      this.fighterFighting.stamina = stamina - hitDamage
    console.log(`${fighter.name} was ${hitDamage > 2 ? 'critically ' : ''}hit by ${attackingFighter.name}'s attack`);

    this.fighterFighting.startInteruptAction(this.animationTimes.takeAHit, 'taking a hit')
    .then(() => {
      if (this.fighterFighting.stamina <= 0) {   
        this.getKnockedOut(attackingFighter)  
      }
      else{
        this.fighterFighting.startAction(this.cooldowns.takeAHit, 'cooldown')
      }
    })
    
  }

  getKnockedOut(attackigFighter: Fighter){   
    this.fighterFighting.knockedOut = true
    this.fighterFighting.modelState = 'Knocked Out'
    const message = `${this.fighterFighting.fighter.name} has been knocked out by ${attackigFighter.name}`
    console.warn(message);
  }

  afterTryToHitFighter(result: ResponseToFighterAttack) {
    
    if(!this.fighterFighting.interuptActionInProgress){
      if (result == 'take critical hit') {
        this.goOnARampage()
        this.fighterFighting.startAction(this.cooldowns.criticalStrike, 'cooldown')
      }
      else {
        this.fighterFighting.startAction(this.cooldowns.punch, 'cooldown')
      }
      
      this.justDidAttack = true
      clearTimeout(this.justDidAttackTimer)
      this.justDidAttackTimer = setTimeout(() => this.justDidAttack = false, 3000)
    }
  }

  goOnARampage(){
    this.speedBoost = true
    clearInterval(this.speedBoostTimer)
    this.speedBoostTimer = setTimeout(() => this.speedBoost = false, 1000)
    this.onRampage = true
    clearTimeout(this.rampageTimer)
    this.rampageTimer = setTimeout(() => this.onRampage = false, 3000)
    if(this.fighterFighting.spirit < this.fighterFighting.fighter.state.maxSpirit)
      this.fighterFighting.spirit ++  

  }

  afterDodge() {    
    if(!this.fighterFighting.interuptActionInProgress){ // from taking hit while dodging
      this.fighterFighting.startAction(this.cooldowns.dodge, 'cooldown')
      .then(() => {
        this.justDodged = true
        setTimeout(() => this.justDodged = false, 500)
        if(this.fighterFighting.isStaminaLow()){
            this.speedBoost = true
            clearTimeout(this.speedBoostTimer)
            this.speedBoostTimer = setTimeout(() => this.speedBoost = false, 1000)
        }
        
      })
    }
  }

  afterBlock() {
    if(!this.fighterFighting.interuptActionInProgress){ // from taking hit while blocking
      this.fighterFighting.startAction(this.cooldowns.block, 'cooldown')
      .then(() => {
        this.justBlocked = true
        setTimeout(() => this.justBlocked = false, 500)
      })
    }
  }

  resetNoActionTimer(){
    this.noActionForAWhile = false
    clearTimeout(this.noActionTimer)
    this.noActionTimer = setTimeout(() => {
      this.noActionForAWhile = true
    }, 7000)
  }

}
