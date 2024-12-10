import gameConfiguration from "../../../game-settings/game-configuration"
import FighterFighting from "./fighter-fighting"

export default class FighterStats {
  private _baseStrength: number = 2
  private _baseFitness: number = 2
  private _baseIntelligence: number = 2
  private _baseAggression: number = 2

  private _maxSpirit = 5
  maxEnergy = 10

  constructor(public fighting: FighterFighting) {}

  get maxSpirit() {
    const { sick } = this.fighting.fighter.state
    const {
      sick: { startAndMaxSpiritReduced },
    } = gameConfiguration.afflictions
    return sick ? this._maxSpirit - startAndMaxSpiritReduced : this._maxSpirit
  }

  get fitness() {
    const { sick, injured, doping } = this.fighting.fighter.state
    const {
      injured: { strengthAndFitnessPercentReduction },
    } = gameConfiguration.afflictions
    let x = this._baseFitness
    if (sick) x *= 1 - strengthAndFitnessPercentReduction / 100
    if (injured) x *= 1 - strengthAndFitnessPercentReduction / 100
    if (doping) x = x * 1.2 + 0.8
    return Math.round(x)
  }

  get intelligence() {
    const { logistics } = this.fighting
    if (logistics.isHallucinating) {
      return 1
    }
    let x = this._baseIntelligence
    return Math.round(x)
  }

  get strength() {
    const { sick, injured, doping } = this.fighting.fighter.state
    const {
      injured: { strengthAndFitnessPercentReduction },
    } = gameConfiguration.afflictions

    let x = this.baseStrength

    if (sick) x *= 1 - strengthAndFitnessPercentReduction / 100
    if (injured) x *= 1 - strengthAndFitnessPercentReduction / 100
    if (doping) x = x * 1.3 + 1
    return Math.round(x)
  }

  get aggression() {
    const { sick, doping, takingADive } = this.fighting.fighter.state
    const {
      sick: { agressionPercentageReduced },
    } = gameConfiguration.afflictions
    const { onARampage } = this.fighting.logistics

    if (!onARampage && takingADive) return 0

    let x = this.baseAggression
    if (doping) x += 3
    if (onARampage) x *= 1.6
    if (sick) x *= 1 - agressionPercentageReduced / 100
    if (x < 0) return 0
    return Math.round(x)
  }

  get speed() {
    const { logistics, energy } = this.fighting
    const { takingADive } = this.fighting.fighter.state
    const { onARampage } = logistics
    const speed = Math.round(
      3 + this.aggression * 0.2 + -this.strength * 0.2 + this.fitness * 0.5
    )
    if (logistics.lowEnergy) return speed * 0.5
    if (!onARampage && takingADive) return speed * 0.5
    if (speed < 1) return 1
    return speed
  }

  get maxStamina() {
    const maxStamina = Math.round(
      2 +
        this.baseStrength * 0.8 +
        this.baseFitness * 0.5 +
        this.baseAggression * 0.2
    )

    return maxStamina
  }

  get baseStrength() {
    return this._baseStrength
  }
  get baseFitness() {
    return this._baseFitness
  }
  get baseIntelligence() {
    return this._baseIntelligence
  }
  get baseAggression() {
    return this._baseAggression
  }

  set baseIntelligence(x) {
    this._baseIntelligence = x
  }
  set baseAggression(x) {
    this._baseAggression = x
  }
  set baseStrength(val) {
    this._baseStrength = val
    this.fighting.fighter.determineSkin()
  }
  set baseFitness(val) {
    this._baseFitness = val
    this.fighting.fighter.determineSkin()
  }
}
