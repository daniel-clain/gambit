import { round } from "lodash"
import { Subscription } from "rxjs"
import gameConfiguration from "../../../game-settings/game-configuration"
import { randomNumber } from "../../../helper-functions/helper-functions"
import { ActionName } from "../../../types/fighter/action-name"
import FacingDirection from "../../../types/fighter/facing-direction"
import FighterModelState from "../../../types/fighter/fighter-model-states"
import { FighterAction } from "../../../types/game/ui-fighter-state"
import Fight from "../../fight/fight"
import Fighter from "../fighter"
import FighterActions from "./fighter-actions"
import FighterAfflictions from "./fighter-afflictions"
import FighterCombat from "./fighter-combat"
import FighterTimers from "./fighter-timers"
import Logistics from "./logistics"
import Movement from "./movement"
import Proximity from "./proximity"
import FighterStats from "./stats"

export default class FighterFighting {
  modelState: FighterModelState = "Idle"
  private _stamina: number
  private _spirit: number
  private _energy: number
  private _facingDirection: FacingDirection

  fight: Fight

  knockedOut: boolean = false
  enemyTargetedForAttack: Fighter | null

  fightStarted: boolean
  stopFighting: boolean

  otherFightersInFight: Fighter[] = []

  energyRegenInterval = 1000
  passiveRecoverInterval = 1000

  stats: FighterStats
  movement: Movement
  proximity: Proximity
  actions: FighterActions
  timers: FighterTimers
  logistics: Logistics
  combat: FighterCombat
  afflictions: FighterAfflictions

  private timeStepSubscription: Subscription

  constructor(public fighter: Fighter) {
    this.timers = new FighterTimers(this)
    this.logistics = new Logistics(this)
    this.stats = new FighterStats(this)
    this.movement = new Movement(this)
    this.proximity = new Proximity(this)
    this.actions = new FighterActions(this)
    this.combat = new FighterCombat(this)
    this.afflictions = new FighterAfflictions(this)
  }

  setup() {
    console.log("fighting setup")
    this.fightStarted = false
    this.modelState = "Idle"
    this._facingDirection = !!round(randomNumber({ to: 1 })) ? "left" : "right"
    const { injured, sick } = this.fighter.state
    const {
      injured: { startStaminaPercentReduction },
      sick: { startAndMaxSpiritReduced },
    } = gameConfiguration.afflictions

    this.stamina = injured
      ? (this.stats.maxStamina * startStaminaPercentReduction) / 100
      : this.stats.maxStamina

    this.spirit = sick ? 3 - startAndMaxSpiritReduced : 3

    this.energy = sick ? this.stats.maxEnergy * 0.3 : this.stats.maxEnergy

    this.otherFightersInFight = this.fight!.fighters.filter(
      (fighter) => fighter.name != this.fighter.name
    )
    this.startStaminaAndEnergyPassiveRecover()
  }

  setKnockedOut() {
    console.warn(`${this.fighter.name} has been knocked out`)
    this.knockedOut = true
    this.timers.cancelAllTimers()
  }

  reset() {
    this.knockedOut = false
    this.otherFightersInFight = []
    this.logistics.rememberedEnemyBehind = undefined
    this.actions.decidedActionLog = []
  }

  set facingDirection(direction: FacingDirection) {
    const { closestEnemyInFront } = this.logistics
    console.log(
      `set facing direction from ${this._facingDirection} to ${direction} (${this.fighter.name})`
    )
    if (closestEnemyInFront) {
      console.log(
        `closest that was infront was ${closestEnemyInFront.name}, their x ${closestEnemyInFront.fighting.movement.coords.x} this x ${this.movement.coords.x}`
      )
    }
    this.rememberEnemyBehind(closestEnemyInFront || null)

    this._facingDirection = direction
  }

  rememberEnemyBehind(enemy: Fighter | null | undefined) {
    const newVal = enemy ? ({ ...enemy } as Fighter) : enemy

    console.log(
      `${this.fighter.name} remembers enemy behind is ${newVal?.name}`
    )

    this.logistics.rememberedEnemyBehind = newVal

    this.timers.start("memory of enemy behind")
  }

  get facingDirection(): FacingDirection {
    return this._facingDirection
  }

  startStaminaAndEnergyPassiveRecover() {
    this.timers.start("passive recover")
    this.timeStepSubscription = this.fight!.fightGenTimeStepSubject.subscribe(
      () => {
        if (!this.timers.activeTimers["passive recover"].active) {
          this.passiveRecover()
          this.timers.start("passive recover")
        }
      }
    )
  }
  passiveRecover() {
    if (!this.timers.isActive("last combat action")) {
      if (this.stamina < this.stats.maxStamina) {
        this.stamina += 1
      }
      if (this.spirit < 3) {
        this.spirit += 1
      }
      if (this.spirit > 3) {
        this.spirit -= 1
      }
    }
    const { sick } = this.fighter.state
    const {
      sick: { energyRegenReductionPercentage },
    } = gameConfiguration.afflictions

    const energyAmount =
      0.2 +
      this.stats.fitness * 0.2 +
      this.stats.aggression * 0.1 +
      (this.logistics.onARampage ? 0.5 : 0)

    this.energy += sick
      ? energyAmount * (1 - energyRegenReductionPercentage / 100)
      : energyAmount
  }

  set energy(val: number) {
    if (val < 0) this._energy = 0
    else if (val > this.stats.maxEnergy) this._energy = this.stats.maxEnergy
    else this._energy = round(val, 2)
  }

  get energy() {
    return this._energy
  }

  set spirit(val: number) {
    if (val < 0) this._spirit = 0
    else if (val > this.stats.maxSpirit) this._spirit = this.stats.maxSpirit
    else round((this._spirit = val))
  }

  get spirit() {
    return this._spirit
  }

  set stamina(val: number) {
    if (val < 0) this._stamina = 0
    else if (val > this.stats.maxStamina) this._stamina = this.stats.maxStamina
    else this._stamina = round(val, 2)
  }

  get stamina() {
    return this._stamina
  }

  speedModifier(baseSpeed: number) {
    const { logistics } = this
    const { speed } = this.stats
    const { fasterSpeedPercentOnRampage } =
      gameConfiguration.afflictions.hallucinating
    return (
      baseSpeed *
      1.5 *
      (logistics.onARampage ? 0.8 : 1) *
      (logistics.lowEnergy && !logistics.onARampage ? 1.3 : 1) *
      (logistics.onARampage && logistics.isHallucinating
        ? 1 - fasterSpeedPercentOnRampage / 100
        : 1) *
      (1 - (speed * 1.4) / 100)
    )
  }

  addFighterAction(action: FighterAction) {
    this.fight.addActionToQueue(action, this.fighter)
  }

  fighterActionInterupted() {
    this.fight!.removeFightersActions(this.fighter)
  }

  getCurrentAction(): ActionName {
    return (
      this.fight!.fightActionsQueue.find(
        (a) => a.sourceFighter.name == this.fighter.name
      )?.actionName ?? "do nothing"
    )
  }
}
