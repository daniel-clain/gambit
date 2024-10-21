import { randomNumber } from "../../helper-functions/helper-functions"
import { FighterInfo } from "../../interfaces/front-end-state-interface"
import { Skin } from "../../types/fighter/skin"
import Fight from "../fight/fight"
import FighterFighting from "./fighter-fighting/fighter-fighting"
import FighterStats from "./fighter-fighting/stats"
import FighterState from "./fighter-state"

export default class Fighter {
  state: FighterState = new FighterState()
  fighting: FighterFighting
  skin: Skin

  constructor(public name: string) {
    this.fighting = new FighterFighting(this)

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

    const randomRange = randomNumber({ to: halfOfMainStats }) + halfOfMainStats

    const weeklyCost = randomRange

    this.state.goalContract = {
      numberOfWeeks: randomNumber({ to: 1 }) ? 5 : 6,
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
    } = this.state
    return {
      name: this.name,
      characterType: "Fighter",
      ...getStats(this.fighting.stats),
      numberOfFights: { weeksSinceUpdated: 0, lastKnownValue: numberOfFights },
      numberOfWins: { weeksSinceUpdated: 0, lastKnownValue: numberOfWins },
      manager: { weeksSinceUpdated: 0, lastKnownValue: manager?.has.name },
      activeContract,
      goalContract,
    }

    function getStats({
      baseStrength,
      baseFitness,
      baseIntelligence,
      baseAggression,
    }: FighterStats) {
      return {
        strength: { weeksSinceUpdated: 0, lastKnownValue: baseStrength },
        fitness: { weeksSinceUpdated: 0, lastKnownValue: baseFitness },
        intelligence: {
          weeksSinceUpdated: 0,
          lastKnownValue: baseIntelligence,
        },
        aggression: { weeksSinceUpdated: 0, lastKnownValue: baseAggression },
      }
    }
  }

  startFighting() {
    this.fighting.start()
  }

  stopFighting() {
    this.fighting.stop()
  }

  reset() {
    this.fighting.reset()
  }

  getPutInFight(fight: Fight) {
    this.state.fight = fight
  }
}
