import FighterFighting from "./fighter-fighting"
import Fighter from "../fighter"
import { AttackType } from "../../../types/figher/attack-types"
import { random } from "../../../helper-functions/helper-functions"
import { AttackResponseAction, ActionName } from "../../../types/figher/action-name"
import selectRandomResponseBasedOnProbability from "./random-based-on-probability"
import AttackResponseProbability from "./attack-response-probability"

export default class FighterCombat {

  attackResponseProbability: AttackResponseProbability
  
  constructor(public fighting: FighterFighting){
    this.attackResponseProbability = new AttackResponseProbability(fighting)
  }



  async startDefending(enemy: Fighter) {   
    const {proximity, animation, movement} = this.fighting
      if(proximity.isFacingAwayFromEnemy(enemy))
        await movement.turnAround()
  
      return animation.start({      
        name: 'defending',
        model: 'Defending',
        duration: 1000
      })
    }
  
    
    async attackEnemy(enemy: Fighter, attackType: AttackType): Promise<void> { 
      
      const {animation, proximity, fighter, movement, timers, stats, spirit} = this.fighting
      
      this.fighting.enemyTargetedForAttack = enemy
      
      if(proximity.isFacingAwayFromEnemy(enemy))
        await movement.turnAround()
  
      await animation.start(
        attackType == 'punch' && {
          name: 'trying to punch',
          model: 'Punching',
          duration: animation.speedModifier(100)
        }
        ||
        attackType == 'critical strike' && {
          name: 'trying to critical strike',
          model: 'Kicking',
          duration: animation.speedModifier(100)
        }      
      )
      
      if(this.fighting.enemyTargetedForAttack.fighting.knockedOut)
      throw(`${this.fighting.enemyTargetedForAttack.name} is already knocked out`)
  
      this.resetNoActionTimer()
      timers.start('just did attack')
  
      let lanededAttack: boolean
  
      const stillInRange = proximity.enemyWithinStrikingRange(enemy)
      
      if(stillInRange)
        lanededAttack = enemy.fighting.combat.getAttacked(this.fighting.fighter, attackType)
      else
        console.log(`*** ${fighter.name} no longer in rage to attack ${enemy.name}`);
  
      if(lanededAttack && stillInRange){
        
  
        if(attackType == 'critical strike'){
          const chanceToGoOnARampage = random(10)
          if(chanceToGoOnARampage < this.fighting.stats.aggression)
            timers.start('on a rampage')
        }
        
        if(spirit < stats.maxSpirit)
          this.fighting.spirit ++  
  
        this.fighting.enemyTargetedForAttack.fighting.combat.takeAHit(attackType, fighter)
      
  
        await animation.start(
          attackType == 'punch' && {
            name: 'punching',
            sound: 'Punch',
            model: 'Punching',
            duration: animation.speedModifier(600)
          } ||
          attackType == 'critical strike' && {
            name: 'critical striking',
            sound: 'Critical Strike',
            model: 'Kicking',
            duration: animation.speedModifier(700)
          }
        )
        .then(() => animation.cooldown(
          attackType == 'punch' && 700 ||
          attackType == 'critical strike' && 1000
        ))
      }
      else if(!lanededAttack || !stillInRange){
        if(!lanededAttack && this.fighting.spirit != 0)
          this.fighting.spirit --
  
        await animation.start(
          attackType == 'punch' && {
            name: 'missed punch',
            sound: 'Dodge',
            model: 'Punching',
            duration: animation.speedModifier(500)   
          } ||
          attackType == 'critical strike' && {
            name: 'missed critical strike',
            sound: 'Dodge',
            model: 'Kicking',
            duration: animation.speedModifier(600)
          }
        ).then(() => animation.cooldown(
          attackType == 'punch' && 800 ||
          attackType == 'critical strike' && 1100
        ))
      }
      return
    }
    
  getAttacked(enemy: Fighter, attackType: AttackType): boolean {  

    const {proximity, fighter} = this.fighting

    this.resetNoActionTimer()

    if(proximity.isEnemyBehind(enemy)){
      console.log(`behind attack by ${enemy.name} on ${fighter.name}, ${fighter.name} will remember that ${enemy.name} is behind him`);
      proximity.rememberEnemyBehind(enemy)
    }

    const attackResponseActions: AttackResponseAction[] = ['dodge', 'block', 'take hit']

    const responseProbabilities = attackResponseActions.map(response => 
      this.attackResponseProbability.getProbabilityTo(response, enemy, attackType)
    )
  
    const result: ActionName = selectRandomResponseBasedOnProbability(responseProbabilities)


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


  async blockEnemyAttack(enemy: Fighter, attackType: AttackType): Promise<void>{
    const {animation, fighter, timers} = this.fighting
    timers.start('just blocked')
    console.log(`${fighter.name} blocked ${enemy.name}'s ${attackType}`);
    try{
      await animation.start({
        name: 'blocking',
        model: 'Blocking',
        sound: 'Block',
        duration: animation.speedModifier(700)
      })
      .then(() => animation.cooldown(300))
    }
    catch(reason){
      console.log(`${fighter.name}'s block was interupted because ${reason}`);
      return
    }
    this.fighting.actions.decideAction()
  }


  async dodgeEnemyAttack(enemy: Fighter, attackType: AttackType): Promise<void>{
    const {animation, fighter, timers} = this.fighting
    timers.start('just dodged')
    console.log(`${fighter.name} dodged ${enemy.name}'s ${attackType}`); 
    try{
      await animation.start({
        name: 'dodging',
        duration: animation.speedModifier(600),
        model: 'Dodging'
      })
      .then(() => animation.cooldown(200))
    }
    catch(reason){
      console.log(`${fighter.name}'s dodge was interupted because ${reason}`);
      return
    }
    this.fighting.actions.decideAction()
  }


  async takeAHit(attackType: AttackType, attackingFighter: Fighter){    

    let {spirit, stamina, fighter, animation} = this.fighting
    const {strength} = attackingFighter.fighting.stats
    
    let hitDamage = Math.round(
      (
        attackType == 'critical strike' ?
        strength * .8 :
        strength * .4
      ) * 10
    ) / 10

    
    if(spirit != 0)
    this.fighting.spirit --
      this.fighting.stamina = stamina - hitDamage
    console.log(`${fighter.name} took ${hitDamage} from ${attackingFighter.name}'s ${attackType} attack`);
    
    if(this.fighting.knockedOut){
      console.error('should not be attacked when knocked out');
      debugger
    }
    if (this.fighting.stamina <= 0){
      this.fighting.knockedOut = true
      console.warn(`${this.fighting.fighter.name} has been knocked out`);
    }

    try{
      await animation.start({
        name: 'taking a hit',
        duration: animation.speedModifier(800),
        model: 'Taking Hit'
      })
      .then(() => {
        if(this.fighting.knockedOut)
          return
        return animation.cooldown(300)
      })
      .finally(() => {
        if(this.fighting.knockedOut)
          this.fighting.modelState = 'Knocked Out'
      })  
    }
    catch(reason){
      console.log(`${fighter.name}'s take hit was interupted because ${reason}`);
      return
    }

    this.fighting.actions.decideAction()
  }

  resetNoActionTimer(){
    const {timers, logistics} = this.fighting
    logistics.noCombatForAWhile = false
    timers.start('no combat for a while')
  }  
};
