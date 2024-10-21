import FighterFighting from "./fighter-fighting"
import Fighter from "../fighter"
import { AttackAction, AttackResponseAction, MainActionName } from "../../../types/fighter/action-name"
import AttackResponseProbability from "./attack-response-probability"
import { randomNumber, selectByProbability } from "../../../helper-functions/helper-functions"
import { MainAction } from "./action-promises"
import { Sound } from "../../../types/fighter/sound"
import FighterModelState from "../../../types/fighter/fighter-model-states"
import Logistics from "./logistics"

type AttackTypeData = {
  warmUp: number
  preAttack: number
  model: FighterModelState
  sound: Sound
  postHit: number
  postMiss: number
  cooldownHit: number
  cooldownMiss: number
}

const punchData: AttackTypeData = {
  warmUp: 20,
  preAttack: 150,
  model: 'Punching',
  sound: 'Punch',
  postHit: 400,
  postMiss: 500,
  cooldownHit: 300,
  cooldownMiss: 500
}
const criticalStrikeData: AttackTypeData = {
  warmUp: 50,
  preAttack: 350,
  model: 'Kicking',
  sound: 'Critical Strike',
  postHit: 500,
  postMiss: 600,
  cooldownHit: 400,
  cooldownMiss: 600
}

export default class FighterCombat {

  attackResponseProbability: AttackResponseProbability
  
  constructor(public fighting: FighterFighting){
    this.attackResponseProbability = new AttackResponseProbability(fighting)
  }



  startDefending(): MainAction {   
    const {logistics, actions} = this.fighting
    const { mainAction, interruptibleAction } = actions.actionPromises
    const {enemyIsBehind} = logistics
    
    return mainAction({
      name: 'defend',
      actionChain: [
        ...(enemyIsBehind ? actions.turnAroundActionChain: []),
        interruptibleAction({
          name: 'defend',
          model: 'Defending',
          duration: 1000
        })
      ]
    })
  }

  attack(attackType: AttackAction): MainAction{
    const { actions, logistics} = this.fighting
    const {enemyIsBehind, closestRememberedEnemy} = logistics
    const { mainAction, interruptibleAction, instantAction } = actions.actionPromises

    this.fighting.enemyTargetedForAttack = closestRememberedEnemy

    const attackTypeData: AttackTypeData = (
      attackType == 'punch' && punchData ||
      attackType == 'critical strike' && criticalStrikeData
    )

    let attackResult: AttackResponseAction | 'miss'

    return mainAction({
      name: attackType,
      actionChain: [
        ...(enemyIsBehind ? actions.turnAroundActionChain: []),
        interruptibleAction({
          name: `${attackType} warmup`,
          model: 'Idle',
          duration: actions.speedModifier(attackTypeData.warmUp)
        }),
        interruptibleAction({
          name: `pre ${attackType}`,
          model: attackTypeData.model,
          duration: actions.speedModifier(attackTypeData.preAttack)
        }),
        instantAction({
          name: attackType,
          action: () => {
            attackResult = this.doAttack(attackType)
            console.log(`attack result ${attackResult}(${this.fighting.fighter.name})`);
            if(attackResult == 'take hit')
              this.makeSound(attackTypeData.sound)
            if(attackResult == 'miss')
              this.makeSound('Dodge')

            return Promise.resolve()
          }
        }),
        interruptibleAction({
          name: `post ${attackType} ${attackResult == 'take hit' ? 'hit' : 'miss'}`,
          duration: actions.speedModifier(attackResult == 'take hit' ? attackTypeData.postHit : attackTypeData.postMiss)
        }),
        interruptibleAction({
          name: `${attackType} cooldown`,
          model: 'Idle',
          duration: (
            (attackResult == 'take hit' ? attackTypeData.cooldownHit : attackTypeData.cooldownMiss)
            + (logistics.lowEnergy ? 200 : 0)
          )
        })
      ]
    })
  }


  

  private doAttack(attackAction: AttackAction): AttackResponseAction | 'miss'{
    const {proximity, fighter, timers, logistics, actions} = this.fighting
    timers.start('last combat action')

    const enemy = logistics.closestRememberedEnemy

    this.fighting.enemyTargetedForAttack = enemy
    this.fighting.energy -= {'punch': 2, 'critical strike': 3}[attackAction]


    const stillInRange = proximity.enemyWithinStrikingRange(enemy)
    if(stillInRange){
      const attackResult: AttackResponseAction = enemy.fighting.combat.getAttacked(fighter, attackAction)

      if(attackResult == 'take hit'){
        this.fighting.spirit ++  
        actions.nextDecisionFactors.justHitAttack = true

        if(attackAction == 'critical strike'){
          this.chanceToRampage()
        }
      }
      else {
        actions.nextDecisionFactors.justMissedAttack = true
        this.fighting.spirit --
      }
      return attackResult
    }
    else {
      return 'miss'
    }
    

  }

  private makeSound(sound: Sound){
    this.fighting.soundsMade.push({soundName: sound, time: Date.now()})
  }



    
  getAttacked(enemy: Fighter, attackType: AttackAction) {  

    const {actions, fighter, logistics} = this.fighting
    const {mainAction, interruptibleAction} = actions.actionPromises

    const result: AttackResponseAction = this.getAttackedResult(enemy, attackType)

    console.log(`${enemy.name} attacked ${fighter.name}, result ${result}`);

    actions.rejectCurrentAction({
      name: `${result} main`,
      interruptAction: () => (
        mainAction({
          name: result,
          actionChain: [
            interruptibleAction({
              name: result,
              model: (
                result == 'dodge' && 'Dodging' ||
                result == 'block' && 'Blocking' ||
                result == 'take hit' && 'Taking Hit' || null
              )!,
              duration: (
                result == 'dodge' && actions.speedModifier(500) ||
                result == 'block' && actions.speedModifier(500) ||
                result == 'take hit' && 600 || null
              )!,
            }),
            interruptibleAction({
              name: `${result} cooldown`,
              model: 'Idle',
              duration: (
                result == 'dodge' && actions.speedModifier(300) ||
                result == 'block' && actions.speedModifier(300) ||
                result == 'take hit' && (
                  this.fighting.knockedOut ? 0 : 400
                )
              )
            })
          ]
        })
      )      
    })

    return result
  }


  private getAttackedResult(enemy: Fighter, attackType: AttackAction): AttackResponseAction{
    
    const {proximity, timers, fighter, actions} = this.fighting
    const {strength} = enemy.fighting.stats

    timers.start('last combat action')

    if(proximity.isEnemyBehind(enemy)){
      //console.log(`behind attack by ${enemy.name} on ${fighter.name}, ${fighter.name} will remember that ${enemy.name} is behind him`);
      this.fighting.rememberEnemyBehind(enemy)
    }
    

    const attackResponseActions: AttackResponseAction[] = ['dodge', 'block', 'take hit']

    const responseProbabilities = attackResponseActions.map(response => 
      this.attackResponseProbability.getProbabilityTo(response, enemy, attackType)
    )
    const result = selectByProbability(responseProbabilities)

    if(result == 'block'){
      this.fighting.spirit ++
      this.makeSound('Block')
      actions.nextDecisionFactors.justBlocked = true
    }
    if(result == 'dodge'){
      this.fighting.spirit ++
      this.makeSound('Dodge')
      actions.nextDecisionFactors.justDodged = true
    }

    if(result == 'take hit'){

      let hitDamage = Math.round(
        (
          attackType == 'critical strike' ?
          1 + (strength * .6) :
          0.5 + strength * .3
        ) * 10
      ) / 10

      this.fighting.stamina -= hitDamage
      //console.log(`${this.fighting.fighter.name} took ${hitDamage} from ${attackingFighter.name}'s ${attackType} attack`);
      

      if(!this.fighting.stamina){
        this.fighting.knockedOut = true
        console.warn(`${fighter.name} has been knocked out`);
      }  

      if(!this.fighting.knockedOut){
        this.fighting.spirit --
        actions.nextDecisionFactors.justTookHit = true
        this.chanceToRampage(enemy)
      }
    }

    return result
  }

  
  private chanceToRampage(enemy?: Fighter) {
    const {timers, energy, stats, spirit, stamina} = this.fighting    
    const randomNum = randomNumber({to: 100})

    const goOnRampage = randomNum < (
      stats.aggression * spirit
      + (enemy?.fighting.knockedOut ? 10 : 0)
      - (stats.maxEnergy - energy) 
      - (stats.maxStamina - stamina)
    )
    if(goOnRampage){
      timers.start('on a rampage')
    }
  }

};
