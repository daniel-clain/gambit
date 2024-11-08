import FighterFighting from "./fighter-fighting"

export default class FighterStats {
  private _baseStrength: number = 2
  private _baseFitness: number = 2
  private _baseIntelligence: number = 2
  private _baseAggression: number = 2

  maxSpirit = 5
  maxEnergy = 10

  constructor(public fighting: FighterFighting) {}

  get fitness() {
    const { sick, injured, doping } = this.fighting.fighter.state
    let x = this._baseFitness
    if (sick) x *= 0.4
    if (injured) x *= 0.4
    if (doping) x = x * 1.25 + 1
    return Math.round(x)
  }

  get intelligence() {
    const { sick, hallucinating, doping } = this.fighting.fighter.state
    let x = this._baseIntelligence
    if (hallucinating) x *= 0.5
    if (doping) x *= 0.8
    return Math.round(x)
  }

  get strength() {
    const { sick, injured, doping } = this.fighting.fighter.state
    let x = this.baseStrength
    if (sick) x *= 0.4
    if (injured) x *= 0.4
    if (doping) x = x * 1.3 + 1
    return Math.round(x)
  }

  get aggression() {
    const { sick, doping, takingADive } = this.fighting.fighter.state
    const { onARampage } = this.fighting.logistics

    if (!onARampage && takingADive) return 0

    let x = this.baseAggression
    if (doping) x += 3
    if (onARampage) x *= 1.6
    if (sick) x *= 0.6
    if (x < 0) return 0
    return Math.round(x)
  }

  get speed() {
    const { logistics, energy } = this.fighting
    const { takingADive } = this.fighting.fighter.state
    const { onARampage } = logistics
    const speed = Math.round(
      2 + this.aggression * 0.5 + -this.strength * 0.3 + this.fitness * 0.9
    )
    if (logistics.lowEnergy) return speed * 0.5
    if (!onARampage && takingADive) return speed * 0.5
    if (speed < 1) return 1
    return speed
  }

  get maxStamina() {
    const { sick, injured } = this.fighting.fighter.state
    const maxStamina = Math.round(
      2 +
        this.baseStrength * 0.8 +
        this.baseFitness * 0.5 +
        this.baseAggression * 0.2 -
        (sick || injured ? 2 : 0)
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
