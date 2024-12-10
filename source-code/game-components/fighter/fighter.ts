import { round } from "lodash"
import { randomNumber } from "../../helper-functions/helper-functions"
import { FighterInfo } from "../../interfaces/front-end-state-interface"
import { Skin } from "../../types/fighter/skin"
import FighterFighting from "./fighter-fighting/fighter-fighting"
import FighterState from "./fighter-state"

export default class Fighter {
  state: FighterState = new FighterState()
  fighting: FighterFighting
  skin: Skin

  constructor(public name: string) {
    this.fighting = new FighterFighting(this)

    console.log("stam", this.fighting.stamina)

    this.determineSkin()
  }

  determineSkin() {
    const { strength, fitness } = this.fighting.stats
    if (strength >= fitness && strength > 5) {
      this.skin = "Muscle"
    } else if (fitness > strength && fitness > 5) {
      this.skin = "Fast"
    } else {
      this.skin = "Default"
    }
  }

  determineGoalContract() {
    const { intelligence, fitness, strength, aggression } = this.fighting.stats
    const mainStatsCombined = intelligence + fitness + strength + aggression

    const halfOfMainStats = Math.round(mainStatsCombined * 0.5)

    const randomRange = round(
      randomNumber({ to: halfOfMainStats }) + halfOfMainStats
    )

    const weeklyCost = randomRange

    this.state.goalContract = {
      numberOfWeeks: round(randomNumber({ to: 1 })) ? 5 : 6,
      weeklyCost,
    }
  }

  getInfo(): FighterInfo {
    const {
      numberOfFights,
      numberOfWins,
      activeContract,
      goalContract,
      manager,
      publicityRating,
    } = this.state
    const { baseStrength, baseFitness, baseIntelligence, baseAggression } =
      this.fighting.stats

    return {
      name: this.name,
      characterType: "Fighter",
      stats: {
        strength: baseStrength,
        fitness: baseFitness,
        intelligence: baseIntelligence,
        aggression: baseAggression,
        numberOfFights,
        numberOfWins,
        manager: manager?.has.name ?? null,
        publicityRating,
      },
      activeContract,
      goalContract,
    }
  }
}
