import FighterFighting from "./fighter-fighting"
import Fighter from "../fighter"
import { AttackType } from "../../../types/fighter/attack-types"
import { AttackResponseAction, ActionName } from "../../../types/fighter/action-name"
import AttackResponseProbability from "./attack-response-probability"
import { isFacingAwayFromEnemy } from "./proximity"
import { selectRandomResponseBasedOnProbability } from "./random-based-on-probability"
import { Interrupt } from "../../../types/game/interrupt"
import { randomNumber } from "../../../helper-functions/helper-functions"

export default class FighterCombat {

  attackResponseProbability: AttackResponseProbability
  
  constructor(public fighting: FighterFighting){
    this.attackResponseProbability = new AttackResponseProbability(fighting)
  }



  startDefending(enemy: Fighter) {   
    const {fighter, animation, movement, actions} = this.fighting
    const willTurnAround = isFacingAwayFromEnemy(enemy, fighter) && !fighter.state.hallucinating
    
    return actions.actionPromise({
      isMain: true,
      promise: (
        willTurnAround ? 
        actions.actionPromise({promise: movement.turnAround()}) : Promise.resolve()
        .then(() => actions.actionPromise({
          name: 'defend',
          promise: animation.start({      
            name: 'defending',
            model: 'Defending',
            duration: animation.speedModifier(1000)
          })
        }))
      )
    })
  }

  
  attackEnemy(enemy: Fighter, attackType: AttackType) { 
    const {fighting} = this
    const {animation, proximity, fighter, movement, timers, stats, spirit, actions, energy} = fighting
    
    fighting.enemyTargetedForAttack = enemy
    let landedAttack: boolean
    return actions.actionPromise({
      isMain: true,
      promise: (
        preAttack()
        .then(() => {
          
          if(landedAttack){
            onAttackLanded()
            if(this.fighting.energy > 0){
              this.fighting.energy -= 1
            }
            return postAttackHit()
          }
          else{
            return postAttackMissed()
          }
        })
      )
    })


    function preAttack(){
      const willTurnAround = isFacingAwayFromEnemy(enemy, fighter) && !fighter.state.hallucinating
          
      return (
        willTurnAround ? 
        actions.actionPromise({promise: movement.turnAround()}) : Promise.resolve()
        .then(() => actions.actionPromise({
          name: 'pre attack',
          promise: animation.start(
            attackType == 'punch' && {
              name: 'trying to punch',
              model: 'Punching',
              duration: animation.speedModifier(200)
            }
            ||
            attackType == 'critical strike' && {
              name: 'trying to critical strike',
              model: 'Kicking',
              duration: animation.speedModifier(300)
            }      
          )
          .then(() => {
            timers.start('had action recently')
            timers.start('just did attack')

            const stillInRange = proximity.enemyWithinStrikingRange(enemy)
            
            landedAttack = stillInRange && enemy.fighting.combat.getAttacked(fighter, attackType)
            return
          })
        }))
      )
    }

    function onAttackLanded(){
      if(spirit < stats.maxSpirit)
        fighting.spirit ++  

      if(attackType == 'critical strike' && energy == stats.maxEnergy){
        const chanceToGoOnARampage = randomNumber({to: 60})
        if(chanceToGoOnARampage < (fighting.stats.aggression * fighting.spirit + (enemy.fighting.knockedOut ? 10 : 0))){
          fighting.combat.goOnRampage()
        }
      }
      fighting.enemyTargetedForAttack.fighting.combat.takeAHit(attackType, fighter)
    }

    function postAttackHit(): Promise<void>{
      return fighting.actions.actionPromise({
        name: 'post attack hit',
        promise: animation.start(
          attackType == 'punch' && {
            name: 'punching',
            sound: 'Punch',
            model: 'Punching',
            duration: animation.speedModifier(700)
          } ||
          attackType == 'critical strike' && {
            name: 'critical striking',
            sound: 'Critical Strike',
            model: 'Kicking',
            duration: animation.speedModifier(900)
          }
        )
        .then(() => fighting.actions.actionPromise({
          name: 'post attack hit cooldown',
          promise: animation.cooldown(
            attackType == 'punch' && animation.speedModifier(700) ||
            attackType == 'critical strike' && animation.speedModifier(1000)
          )
        }))
      })
    }


    
    function postAttackMissed(): Promise<void>{
      const stillInRange = proximity.enemyWithinStrikingRange(enemy)
      if(stillInRange && fighting.spirit != 0)
        fighting.spirit --

      
      return fighting.actions.actionPromise({
        name: 'post attack missed',
        promise: animation.start(
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
        )        
        .then(() => fighting.actions.actionPromise({
          name: 'post attack missed cooldown',
          promise: animation.cooldown(
            attackType == 'punch' && animation.speedModifier(800) ||
            attackType == 'critical strike' && animation.speedModifier(1100)
          )
        }))
      })
    }
  }
    
  getAttacked(enemy: Fighter, attackType: AttackType): boolean {  

    const {proximity, fighter, timers} = this.fighting

    if(proximity.isEnemyBehind(enemy)){
      //console.log(`behind attack by ${enemy.name} on ${fighter.name}, ${fighter.name} will remember that ${enemy.name} is behind him`);
      proximity.rememberEnemyBehind(enemy)
    }

    const attackResponseActions: AttackResponseAction[] = ['dodge', 'block', 'take hit']

    const responseProbabilities = attackResponseActions.map(response => 
      this.attackResponseProbability.getProbabilityTo(response, enemy, attackType)
    )
  
    const result: ActionName = selectRandomResponseBasedOnProbability(responseProbabilities)

    if(result == 'take hit'){
      if(this.fighting.spirit != 0)
        this.fighting.spirit --
        
    }
    else{
      if(this.fighting.spirit < this.fighting.stats.maxSpirit)
        this.fighting.spirit ++

    }  


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

  
  goOnRampage() {
    const {proximity, timers} = this.fighting
    proximity.trapped = false
    timers.start('on a rampage')
  }


  blockEnemyAttack(enemy: Fighter, attackType: AttackType){
    const {animation, fighter, timers, actions} = this.fighting
    timers.start('just blocked')
    //console.log(`${fighter.name} blocked ${enemy.name}'s ${attackType}`);
    actions.rejectCurrentAction({
      promiseFunc: () => (
        actions.actionPromise({
          isMain: true,
          promise: (
            actions.actionPromise({
              name: 'block',
              promise: animation.start({
                name: 'blocking',
                model: 'Blocking',
                sound: 'Block',
                duration: animation.speedModifier(700)
              })
            })
            .then(() => actions.actionPromise({
              promise: animation.cooldown(animation.speedModifier(300))
            }))
          )
        })     
      )
    })
  }


  dodgeEnemyAttack(enemy: Fighter, attackType: AttackType){
    const {animation, fighter, timers, actions} = this.fighting
    timers.start('just dodged')
    //console.log(`${fighter.name} dodged ${enemy.name}'s ${attackType}`); 
    actions.rejectCurrentAction({
      promiseFunc: () => (
        actions.actionPromise({
          isMain: true,  
          promise: (
            actions.actionPromise({
              name: 'dodge',
              promise: animation.start({
                name: 'dodging',
                duration: animation.speedModifier(600),
                model: 'Dodging'
              })
            })
            .then(() => actions.actionPromise({
              promise: animation.cooldown(animation.speedModifier(200))
            }))
          )
        })
      )     
    })
  }


  takeAHit(attackType: AttackType, attackingFighter: Fighter){

    let {stamina, timers, animation, actions, energy} = this.fighting
    const {strength, maxEnergy} = attackingFighter.fighting.stats
    
    let hitDamage = Math.round(
      (
        attackType == 'critical strike' ?
        1 + (strength * .6) :
        0.5 + strength * .3
      ) * 10
    ) / 10

    this.fighting.stamina = stamina - hitDamage
    //console.log(`${this.fighting.fighter.name} took ${hitDamage} from ${attackingFighter.name}'s ${attackType} attack`);
    

    if (this.fighting.stamina <= 0){
      this.fighting.knockedOut = true
      console.warn(`${this.fighting.fighter.name} has been knocked out`);
    }  
    if(!this.fighting.knockedOut){
      timers.start('had action recently')
      if(energy == maxEnergy){
        const chanceToGoOnARampage = randomNumber({to: 60})
        if(chanceToGoOnARampage < (this.fighting.stats.aggression *.5 * this.fighting.spirit)){
          this.goOnRampage()
        }
      }
    }


    actions.rejectCurrentAction({
      name: 'taking hit reject',
      promiseFunc: () => (
        actions.actionPromise({
          isMain: true,
          promise: (
            actions.actionPromise({
              name: 'taking hit',
              promise: animation.start({
                name: 'taking a hit',
                duration: animation.speedModifier(800),
                model: 'Taking Hit'
              })
            })
            .then(() => 
              this.fighting.knockedOut ?
                Promise.resolve() :
                actions.actionPromise({
                  name: 'taking hit cooldown',
                  promise: animation.cooldown(300)
                })
            )
          )
        })
      )     
    })
  }

};
