import Coords from "../../../interfaces/game/fighter/coords"
import { LeftOrRight } from "../../../interfaces/game/fighter/left-or-right"
import { MoveAction } from "../../../types/fighter/action-name"
import { Angle } from "../../../types/game/angle"
import { toPercent } from "../../../types/game/percent"
import { FighterAction } from "../../../types/game/ui-fighter-state"
import Fighter from "../fighter"
import FighterFighting from "./fighter-fighting"
import { getRetreatDirection } from "./fighter-retreat"
import { fighterRetreatImplementation } from "./fighter-retreat.i"
import {
  getDirectionOfEnemyStrikingCenter,
  getDistanceOfEnemyStrikingCenter,
  isFacingAwayFromEnemy,
} from "./proximity"

export default class Movement {
  movingDirection: Angle
  coords: Coords = { x: 0, y: 0 }
  moveAction: MoveAction
  speedModifierType: "very fast" | "fast" | "normal" | "slow"
  fighterRetreatImplementation: ReturnType<typeof fighterRetreatImplementation>

  constructor(private fighting: FighterFighting) {
    this.fighterRetreatImplementation = fighterRetreatImplementation(fighting)
  }

  move(moveActionName: MoveAction) {
    const { fighting } = this
    const { actions } = fighting
    const thisMovement = this
    try {
      this.setupMoveAction(moveActionName)
    } catch {
      console.log("catch move action return")
      return
    }

    const moveAction: FighterAction = {
      actionName: moveActionName,
      modelState: "Walking",
      duration: 100,
      onResolve: () => {
        const oldX = thisMovement.coords.x
        thisMovement.moveABit()
        console.log(
          `after ${thisMovement.fighting.fighter.name} ${thisMovement.moveAction}, x changed from ${oldX} to ${thisMovement.coords.x}`
        )
      },
    }

    if (this.shouldTurnAround) {
      fighting.addFighterAction(
        actions.turnAround(() => fighting.addFighterAction(moveAction))
      )
    } else {
      fighting.addFighterAction(moveAction)
    }
  }

  setupMoveAction(moveActionName: MoveAction) {
    const { timers, fighter, logistics, proximity, enemyTargetedForAttack } =
      this.fighting

    if (
      this.moveAction == "move to attack" &&
      proximity.enemyWithinStrikingRange(enemyTargetedForAttack)
    ) {
      console.log(
        `${fighter.name} move to attack invalid because ${enemyTargetedForAttack.name} is close enough to strike`
      )
    }

    if (!timers.isActive("move action")) {
      timers.start("move action")
    }

    this.setMoveDirection(moveActionName)

    logistics.trapped = false
    this.moveAction = moveActionName
    if (moveActionName == "move to attack") {
      this.fighting.enemyTargetedForAttack =
        this.fighting.logistics.closestRememberedEnemy!
    }
    this.setSpeedModifier()

    if (this.fighting.energy > 0) {
      if (this.speedModifierType == "very fast") this.fighting.energy -= 0.1
      if (this.speedModifierType == "fast") this.fighting.energy -= 0.05
    }
  }

  getExponentialMoveFactor(total: number): number {
    const { timers } = this.fighting
    const { elapsedTime, duration } = timers.get("move action")

    const timerPercentage = toPercent(1 - elapsedTime! / duration!)

    const exponentialTimerPercentage = toPercent(Math.pow(timerPercentage, 1.3))

    const returnProbability = total * exponentialTimerPercentage

    return returnProbability
  }

  private getAttackDirection(): Angle {
    const { fighter, logistics, timers, proximity } = this.fighting
    const { closestRememberedEnemy, flanked } = logistics

    if (
      timers.isActive("persist direction") &&
      this.moveAction == "move to attack"
    ) {
      const { persistDirection } = logistics
      return persistDirection
    }

    return getDirectionOfEnemyStrikingCenter(closestRememberedEnemy!, fighter)
  }

  setMoveDirection(moveAction: MoveAction) {
    this.moveAction = moveAction

    if (this.moveAction == "move to attack") {
      this.movingDirection = this.getAttackDirection()
    } else {
      const retreatDirection: Angle | undefined = getRetreatDirection(
        this.fighting
      )
      if (retreatDirection) {
        this.movingDirection = retreatDirection
      } else {
        console.log("get retreate direction failed")
      }
    }
  }

  moveABit() {
    const newMoveCoords: Coords = this.calculateNewCoords()

    const oldCoords = this.coords
    this.coords = newMoveCoords
    this.handlePassedEnemy(oldCoords)
  }

  calculateNewCoords(): Coords {
    const {
      moveSpeed,
      movingDirection,
      coords,
      fighting: { fighter },
    } = this
    const trigonometricAngle = 90 - movingDirection
    const directionRadians = (Math.PI / 180) * trigonometricAngle
    const deltaX = moveSpeed * Math.cos(directionRadians)
    const deltaY = moveSpeed * Math.sin(directionRadians)
    console.log(
      `${fighter.name} moveDirection ${movingDirection}, current x ${coords.x}, x change ${deltaX}`
    )

    return {
      x: coords.x + deltaX,
      y: coords.y + deltaY,
    }
  }

  private setSpeedModifier() {
    const { onARampage } = this.fighting.logistics
    this.speedModifierType =
      ((this.moveAction == "desperate retreat" || onARampage) && "very fast") ||
      (this.moveAction == "strategic retreat" && "fast") ||
      (this.moveAction == "cautious retreat" && "slow") ||
      "normal"
  }

  get moveSpeed(): number {
    const { stats } = this.fighting
    const { speed } = stats

    let moveSpeed = speed

    if (this.fighting.energy > 0) {
      if (this.speedModifierType == "very fast") {
        moveSpeed = speed * 1.5
      }
      if (this.speedModifierType == "fast") {
        moveSpeed = speed * 1.1
      }
    }

    if (this.speedModifierType == "slow") {
      moveSpeed = speed * 0.7
    }

    return moveSpeed
  }

  get shouldTurnAround(): boolean {
    const { facingDirection, fighter, logistics } = this.fighting
    const movingLeftOrRight: LeftOrRight =
      this.movingDirection < 180 ? "right" : "left"

    if (this.moveAction == "cautious retreat") {
      const isFacingAway =
        logistics.closestRememberedEnemy &&
        isFacingAwayFromEnemy(logistics.closestRememberedEnemy, fighter)
      if (isFacingAway) {
        return true
      }
      return false
    } else if (this.moveAction == "move to attack") {
      if (
        logistics.closestRememberedEnemy &&
        isFacingAwayFromEnemy(logistics.closestRememberedEnemy, fighter)
      ) {
        return true
      }
      return false
    } else {
      // for all retreat actions
      if (movingLeftOrRight != facingDirection) {
        return true
      }
      return false
    }
  }

  private handlePassedEnemy(oldCoords: Coords) {
    const { logistics, fighter, facingDirection } = this.fighting
    const movingLeftOrRight: LeftOrRight =
      this.movingDirection <= 180 ? "right" : "left"
    let passedEnemy: Fighter | undefined

    if (movingLeftOrRight == "left") {
      passedEnemy = logistics.otherFightersStillFighting.find((f) => {
        const { x } = f.fighting.movement.coords
        if (x < oldCoords.x && x > this.coords.x) return true
      })!
    }

    if (movingLeftOrRight == "right") {
      passedEnemy = logistics.otherFightersStillFighting.find((f) => {
        const { x } = f.fighting.movement.coords
        if (x > oldCoords.x && x < this.coords.x) return true
      })!
    }
    if (passedEnemy) {
      console.log(
        `${fighter.name} ${this.coords.x} has passed ${passedEnemy.name} ${passedEnemy.fighting.movement.coords.x}. facing ${facingDirection}, moving ${movingLeftOrRight}, remembered enemy behind ${logistics.rememberedEnemyBehind?.name}`
      )

      // this fighter update memory
      if (facingDirection == movingLeftOrRight) {
        //if moving forward
        if (logistics.rememberedEnemyBehind) {
          const rememberedDistance = getDistanceOfEnemyStrikingCenter(
            logistics.rememberedEnemyBehind,
            fighter
          )
          const passedDistance = getDistanceOfEnemyStrikingCenter(
            passedEnemy,
            fighter
          )
          if (passedDistance < rememberedDistance) {
            console.log(
              `${fighter.name}'s memory of behind is now ${passedEnemy.name}`
            )
            this.fighting.rememberEnemyBehind(passedEnemy)
          } else {
            console.log(
              `${fighter.name}'s original memory of behind is  ${logistics.rememberedEnemyBehind.name} who is closer than ${passedEnemy.name}`
            )
          }
        } else {
          console.log(
            `${fighter.name}'s memory of behind is now ${passedEnemy.name}`
          )
          this.fighting.rememberEnemyBehind(passedEnemy)
        }
      } else {
        console.log(`${fighter.name} was moving backwards ${this.moveAction}`)
        if (logistics.rememberedEnemyBehind?.name == passedEnemy.name) {
          console.log(
            `${fighter.name}'s memory of behind was ${logistics.rememberedEnemyBehind?.name}, but now its undefined`
          )
          this.fighting.rememberEnemyBehind(undefined)
        }
      }

      // enemy fighter update memory

      const passedRememberedEnemyBehind =
        passedEnemy.fighting.logistics.rememberedEnemyBehind

      if (passedEnemy.fighting.facingDirection == movingLeftOrRight) {
        console.log(
          `${passedEnemy.name} was passed by ${fighter.name}from behind`
        )
        if (passedRememberedEnemyBehind?.name == fighter.name) {
          console.log(
            `${passedEnemy.name}'s memory or behind was ${fighter.name}, so he now has no memory of whose behind`
          )
          passedEnemy.fighting.rememberEnemyBehind(undefined)
        }
      } else if (!!passedRememberedEnemyBehind) {
        const rememberedDistance = getDistanceOfEnemyStrikingCenter(
          passedRememberedEnemyBehind,
          passedEnemy
        )
        const thisDistance = getDistanceOfEnemyStrikingCenter(
          fighter,
          passedEnemy
        )

        console.log(
          `${passedEnemy.name} was passed by ${fighter.name} from in front and is now behind`
        )
        if (thisDistance < rememberedDistance) {
          passedEnemy.fighting.rememberEnemyBehind(fighter)
          console.log(
            `${fighter.name} is closer than remembered enemy behind (${passedRememberedEnemyBehind.name}), so new enemy behind is now ${fighter.name}`
          )
        }
      } else {
        console.log(
          `${passedEnemy.name} was passed by ${fighter.name} and now remembers he is behind`
        )
        passedEnemy.fighting.rememberEnemyBehind(fighter)
      }
    }
  }
}
