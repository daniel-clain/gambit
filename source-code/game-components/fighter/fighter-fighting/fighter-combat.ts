import { round } from "lodash"
import gameConfiguration from "../../../game-settings/game-configuration"
import {
  randomNumber,
  selectByProbability,
} from "../../../helper-functions/helper-functions"
import {
  ActionName,
  AttackAction,
  AttackResponseAction,
} from "../../../types/fighter/action-name"
import { FighterAction } from "../../../types/game/ui-fighter-state"
import Fighter from "../fighter"
import AttackResponseProbability from "./attack-response-probability"
import FighterFighting from "./fighter-fighting"

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

  getSpeedAndLog = (
    duration: number,
    actionName: ActionName,
    fighting: FighterFighting
  ) => {
    const {
      fighter: { name },
    } = fighting
    const speed = fighting.speedModifier(duration)
    if (["Strong", "Passive", "Fit", "Average"].includes(name)) {
      console.log(
        `logspeed ${name}, ${actionName}, ${speed}, lowEnergy: ${fighting.logistics.lowEnergy}`
      )
    }
    return speed
  }

  punch() {
    const { fighting } = this
    const { fighter, logistics, combat, actions, timers } = fighting
    const { enemyIsBehind } = logistics

    const durations = {
      warmUp: 100,
      attack: 100,
      postHit: 330,
      cooldownHit: 440,
      postMiss: 430,
      cooldownMiss: 640,
    }

    if (enemyIsBehind) {
      fighting.addFighterAction(actions.turnAround(addAttackActions))
    } else {
      addAttackActions()
    }

    function addAttackActions() {
      fighting.addFighterAction({
        actionName: "punch warmup",
        modelState: "Idle",
        duration: combat.getSpeedAndLog(
          durations.warmUp,
          "punch warmup",
          fighting
        ),
        onResolve: () => {
          fighting.addFighterAction({
            actionName: "punch",
            modelState: "Punching",
            duration: combat.getSpeedAndLog(
              durations.attack,
              "punch",
              fighting
            ),
            onResolve: () => {
              const attackResult = combat.doAttack("punch")
              const makeMissSound = attackResult == "miss"
              console.log(`punch result ${attackResult}(${fighter.name})`)

              if (attackResult == "take hit") {
                fighting.addFighterAction({
                  actionName: "post punch hit",
                  soundMade: "punch",
                  duration: combat.getSpeedAndLog(
                    durations.postHit,
                    "post punch hit",
                    fighting
                  ),
                  onResolve: () => {
                    timers.start("just landed attack")
                    fighting.addFighterAction({
                      actionName: "punch cooldown",
                      modelState: "Idle",
                      duration: combat.getSpeedAndLog(
                        durations.cooldownHit,
                        "punch cooldown",
                        fighting
                      ),
                    })
                  },
                })
              } else {
                fighting.addFighterAction({
                  actionName: "post punch miss",
                  soundMade: makeMissSound ? "dodge" : undefined,
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
  }
  kick() {
    const { fighting } = this
    const { fighter, logistics, combat, actions, timers } = fighting
    const { enemyIsBehind } = logistics
    const durations = {
      warmUp: 200,
      attack: 240,
      postHit: 440,
      cooldownHit: 530,
      postMiss: 540,
      cooldownMiss: 730,
    }
    if (enemyIsBehind) {
      fighting.addFighterAction(actions.turnAround(addAttackActions))
    } else {
      addAttackActions()
    }

    function addAttackActions() {
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
              const attackResult = combat.doAttack("kick")
              const makeMissSound = attackResult == "miss"
              console.log(`kick result ${attackResult}(${fighter.name})`)

              if (attackResult == "take hit") {
                fighting.addFighterAction({
                  actionName: "post kick hit",
                  soundMade: "kick",
                  duration: fighting.speedModifier(durations.postHit),
                  onResolve: () => {
                    timers.start("just landed attack")
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
                  soundMade: makeMissSound ? "dodge" : undefined,
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
  }

  private doAttack(attackAction: AttackAction): AttackResponseAction | "miss" {
    const { proximity, fighter, timers, logistics, actions } = this.fighting
    timers.start("last combat action")

    const enemy = logistics.closestRememberedEnemy!

    if (enemy.fighting.knockedOut) {
      return "miss"
    }
    this.fighting.energy -= { punch: 3, kick: 4 }[attackAction]

    const stillInRange = proximity.enemyWithinStrikingRange(enemy)
    if (stillInRange) {
      const attackResult: AttackResponseAction =
        enemy.fighting.combat.getAttacked(fighter, attackAction)

      if (attackResult == "take hit") {
        this.fighting.spirit++
        actions.nextDecisionFactors.justHitAttack = true

        if (attackAction == "kick") {
          this.chanceToRampage(enemy)
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
                  actionName: "dodge cooldown",
                  duration: fighting.speedModifier(300),
                })
              },
            }
          case "take hit":
            return {
              actionName: "take hit",
              modelState: "Taking Hit",
              duration: fighting.speedModifier(500),
              onResolve: () => {
                if (fighting.knockedOut) {
                  fighting.addFighterAction({
                    actionName: "knocked out",
                    duration: 0,
                    commentary: `${fighter.name} has been knocked out by ${enemy.name}`,
                    modelState: "Knocked Out",
                  })
                } else {
                  fighting.addFighterAction({
                    actionName: "take hit cooldown",
                    modelState: "Idle",
                    duration: fighting.speedModifier(500),
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
    const { sick, injured } = fighter.state
    const {
      sick: { damageDealtReduction },
      injured: { extraDamagePercentTaken },
    } = gameConfiguration.afflictions

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
    const result = selectByProbability(responseProbabilities)!

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

      if (sick) {
        hitDamage *= 1 - damageDealtReduction / 100
      }

      const damageTaken = injured
        ? hitDamage * (1 + extraDamagePercentTaken / 100)
        : hitDamage
      const preHitStamina = fighting.stamina

      fighting.stamina = round(fighting.stamina - damageTaken, 2)
      console.log(
        `${fighting.fighter.name} took ${damageTaken} from ${enemy.name}'s ${attackType} attack and went from ${preHitStamina} to ${this.fighting.stamina}`
      )
      if (!fighting.stamina) {
        fighting.setKnockedOut()
      }

      if (!fighting.knockedOut) {
        fighting.spirit--
        timers.start("just took hit")
        this.chanceToRampage(enemy)
      }
    }

    return result
  }

  private chanceToRampage(enemy?: Fighter) {
    const { timers, energy, stats, spirit, stamina, logistics, fighter } =
      this.fighting
    const { injured } = fighter.state
    const {
      injured: { increasedChanceToRampageAfterAttack },
      hallucinating: { extraChanceToRampage },
    } = gameConfiguration.afflictions
    const randomNum = randomNumber({ to: 100 })
    const rampageChance =
      (stats.aggression * (spirit * 1.5) +
        (logistics.justLandedAttack ? 10 : 0) +
        (logistics.isHallucinating ? extraChanceToRampage : 0) +
        (enemy?.fighting.knockedOut ? 15 : 0) -
        (logistics.lowEnergy ? 5 : 0) -
        (stats.maxStamina - stamina)) *
      (injured ? 1 + increasedChanceToRampageAfterAttack / 100 : 1)
    console.log(`${fighter.name} rampageChance`, rampageChance)

    const goOnRampage = randomNum < rampageChance
    if (goOnRampage) {
      timers.start("on a rampage")
    }
  }
}
