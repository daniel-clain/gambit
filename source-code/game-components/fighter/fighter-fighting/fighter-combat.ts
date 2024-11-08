import { round } from "lodash"
import {
  randomNumber,
  selectByProbability,
} from "../../../helper-functions/helper-functions"
import {
  AttackAction,
  AttackResponseAction,
} from "../../../types/fighter/action-name"
import FighterModelState from "../../../types/fighter/fighter-model-states"
import { Sound } from "../../../types/fighter/sound"
import { FighterAction } from "../../../types/game/ui-fighter-state"
import Fighter from "../fighter"
import AttackResponseProbability from "./attack-response-probability"
import FighterFighting from "./fighter-fighting"

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

export default class FighterCombat {
  attackResponseProbability: AttackResponseProbability

  constructor(public fighting: FighterFighting) {
    this.attackResponseProbability = new AttackResponseProbability(fighting)
  }

  startDefending() {
    const { fighting } = this
    const { logistics, actions, fighter, fight } = fighting
    const { enemyIsBehind } = logistics

    const defendAction: FighterAction = {
      actionName: "defend",
      modelState: "Defending",
      duration: 1000,
    }
    if (enemyIsBehind) {
      fighting.addFighterAction(
        actions.turnAround(() => {
          fighting.addFighterAction(defendAction)
        })
      )
    } else {
      fighting.addFighterAction(defendAction)
    }
  }
  punch() {
    const { fighting } = this
    const { fighter } = fighting

    const durations = {
      warmUp: 20,
      attack: 150,
      postHit: 400,
      postMiss: 500,
      cooldownHit: 300,
      cooldownMiss: 500,
    }

    fighting.addFighterAction({
      actionName: "punch warmup",
      modelState: "Idle",
      duration: fighting.speedModifier(durations.warmUp),
      onResolve: () => {
        fighting.addFighterAction({
          actionName: "punch",
          modelState: "Punching",
          duration: fighting.speedModifier(durations.attack),
          onResolve: () => {
            const attackResult = this.doAttack("punch")
            console.log(`punch result ${attackResult}(${fighter.name})`)

            if (attackResult == "take hit") {
              fighting.addFighterAction({
                actionName: "post punch hit",
                soundMade: "punch",
                duration: fighting.speedModifier(durations.postHit),
                onResolve: () => {
                  fighting.addFighterAction({
                    actionName: "punch cooldown",
                    modelState: "Idle",
                    duration: fighting.speedModifier(durations.cooldownHit),
                  })
                },
              })
            } else {
              fighting.addFighterAction({
                actionName: "post punch miss",
                duration: fighting.speedModifier(durations.postMiss),
                onResolve: () => {
                  fighting.addFighterAction({
                    actionName: "punch cooldown",
                    modelState: "Idle",
                    duration: fighting.speedModifier(durations.cooldownMiss),
                  })
                },
              })
            }
          },
        })
      },
    })
  }
  kick() {
    const { fighting } = this
    const { fighter } = fighting
    const durations = {
      warmUp: 50,
      attack: 350,
      postHit: 500,
      postMiss: 600,
      cooldownHit: 400,
      cooldownMiss: 600,
    }

    fighting.addFighterAction({
      actionName: "kick warmup",
      modelState: "Idle",
      duration: fighting.speedModifier(durations.warmUp),
      onResolve: () => {
        fighting.addFighterAction({
          actionName: "kick",
          modelState: "Kicking",
          duration: fighting.speedModifier(durations.attack),
          onResolve: () => {
            const attackResult = this.doAttack("kick")
            console.log(`kick result ${attackResult}(${fighter.name})`)

            if (attackResult == "take hit") {
              fighting.addFighterAction({
                actionName: "post kick hit",
                soundMade: "kick",
                duration: fighting.speedModifier(durations.postHit),
                onResolve: () => {
                  fighting.addFighterAction({
                    actionName: "kick cooldown",
                    modelState: "Idle",
                    duration: fighting.speedModifier(durations.cooldownHit),
                  })
                },
              })
            } else {
              fighting.addFighterAction({
                actionName: "post kick miss",
                duration: fighting.speedModifier(durations.postMiss),
                onResolve: () => {
                  fighting.addFighterAction({
                    actionName: "kick cooldown",
                    modelState: "Idle",
                    duration: fighting.speedModifier(durations.cooldownMiss),
                  })
                },
              })
            }
          },
        })
      },
    })
  }

  private doAttack(attackAction: AttackAction): AttackResponseAction | "miss" {
    const { proximity, fighter, timers, logistics, actions } = this.fighting
    timers.start("last combat action")

    const enemy = logistics.closestRememberedEnemy!

    this.fighting.enemyTargetedForAttack = enemy
    this.fighting.energy -= { punch: 2, kick: 3 }[attackAction]

    const stillInRange = proximity.enemyWithinStrikingRange(enemy)
    if (stillInRange) {
      const attackResult: AttackResponseAction =
        enemy.fighting.combat.getAttacked(fighter, attackAction)

      if (attackResult == "take hit") {
        this.fighting.spirit++
        actions.nextDecisionFactors.justHitAttack = true

        if (attackAction == "kick") {
          this.chanceToRampage()
        }
      } else {
        actions.nextDecisionFactors.justMissedAttack = true
        this.fighting.spirit--
      }
      return attackResult
    } else {
      return "miss"
    }
  }

  getAttacked(enemy: Fighter, attackType: AttackAction) {
    const { fighting } = this
    const { fighter } = fighting

    const result: AttackResponseAction = this.getAttackedResult(
      enemy,
      attackType
    )

    console.log(`${enemy.name} attacked ${fighter.name}, result ${result}`)

    fighting.fighterActionInterupted()

    fighting.addFighterAction(
      ((): FighterAction => {
        switch (result) {
          case "block":
            return {
              actionName: "block",
              modelState: "Blocking",
              soundMade: "block",
              duration: fighting.speedModifier(500),
              onResolve: () => {
                fighting.addFighterAction({
                  modelState: "Idle",
                  actionName: "block cooldown",
                  duration: fighting.speedModifier(300),
                })
              },
            }
          case "dodge":
            return {
              actionName: "dodge",
              modelState: "Dodging",
              soundMade: "dodge",
              duration: fighting.speedModifier(500),

              onResolve: () => {
                fighting.addFighterAction({
                  modelState: "Idle",
                  actionName: "block cooldown",
                  duration: fighting.speedModifier(300),
                })
              },
            }
          case "take hit":
            return {
              actionName: "take hit",
              modelState: "Taking Hit",
              duration: fighting.speedModifier(600),
              onResolve: () => {
                if (fighting.knockedOut) {
                  fighting.addFighterAction({
                    actionName: "knocked out",
                    duration: 0,
                    modelState: "Knocked Out",
                  })
                } else {
                  fighting.addFighterAction({
                    actionName: "take hit cooldown",
                    modelState: "Idle",
                    duration: fighting.speedModifier(400),
                  })
                }
              },
            }
        }
      })()
    )

    return result
  }

  private getAttackedResult(
    enemy: Fighter,
    attackType: AttackAction
  ): AttackResponseAction {
    const { fighting } = this
    const { proximity, timers, fighter, actions } = fighting
    const { strength } = enemy.fighting.stats

    timers.start("last combat action")

    if (proximity.isEnemyBehind(enemy)) {
      //console.log(`behind attack by ${enemy.name} on ${fighter.name}, ${fighter.name} will remember that ${enemy.name} is behind him`);
      fighting.rememberEnemyBehind(enemy)
    }

    const attackResponseActions: AttackResponseAction[] = [
      "dodge",
      "block",
      "take hit",
    ]

    const responseProbabilities = attackResponseActions.map((response) =>
      this.attackResponseProbability.getProbabilityTo(
        response,
        enemy,
        attackType
      )
    )
    const result = selectByProbability(responseProbabilities)

    if (result == "block") {
      fighting.spirit++
      actions.nextDecisionFactors.justBlocked = true
    }
    if (result == "dodge") {
      fighting.spirit++
      actions.nextDecisionFactors.justDodged = true
    }

    if (result == "take hit") {
      let hitDamage =
        Math.round(
          (attackType == "kick" ? 1 + strength * 0.6 : 0.5 + strength * 0.3) *
            10
        ) / 10
      const preHitStamina = fighting.stamina

      fighting.stamina = round(fighting.stamina - hitDamage, 2)
      if (!fighting.stamina) {
        fighting.setKnockedOut()
      }
      console.log(
        `${fighting.fighter.name} took ${hitDamage} from ${enemy.name}'s ${attackType} attack and went from ${preHitStamina} to ${this.fighting.stamina}`
      )

      if (!fighting.knockedOut) {
        fighting.spirit--
        actions.nextDecisionFactors.justTookHit = true
        this.chanceToRampage(enemy)
      }
    }

    return result
  }

  private chanceToRampage(enemy?: Fighter) {
    const { timers, energy, stats, spirit, stamina } = this.fighting
    const randomNum = randomNumber({ to: 100 })

    const goOnRampage =
      randomNum <
      stats.aggression * spirit +
        (enemy?.fighting.knockedOut ? 10 : 0) -
        (stats.maxEnergy - energy) -
        (stats.maxStamina - stamina)
    if (goOnRampage) {
      timers.start("on a rampage")
    }
  }
}
