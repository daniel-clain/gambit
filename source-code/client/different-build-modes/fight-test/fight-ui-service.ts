import Fight from "../../../game-components/fight/fight"
import Fighter from "../../../game-components/fighter/fighter"
import FighterStats from "../../../game-components/fighter/fighter-fighting/stats"
import gameConfiguration from "../../../game-settings/game-configuration"
import { shuffle } from "../../../helper-functions/helper-functions"
gameConfiguration.stageDurations.maxFightDuration = 180
type BaseStats = Pick<
  FighterStats,
  "baseAggression" | "baseFitness" | "baseIntelligence" | "baseStrength"
>
const fighters = [
  /*
	
	new Fighter('Superman'),
	new Fighter('Daniel'),
	new Fighter('Hyper'),
	new Fighter('Crafty'),
	new Fighter('Dave'),
	new Fighter('Bob'),
	new Fighter('Fred'),
	new Fighter('Jeff'),
	new Fighter('Kevin'),
	new Fighter('Joe'),
	new Fighter('Steve'),*/
  new Fighter("Stupid"),
  new Fighter("Intelligent"),

  new Fighter("Average"),
  new Fighter("Passive"),

  new Fighter("Fit"),
  new Fighter("Strong"),
  new Fighter("Aggressive"),
  /**/
]

export const fightUiService = {
  fight: undefined as Fight | undefined,
  newFight(): Fight {
    return new Fight(fighters)
  },
  fighters: shuffle(fighters),
}

const f = (n: string) => fighters.find((f) => f.name == n)!
const s = (f: Fighter, u: Partial<BaseStats>) =>
  f &&
  (Object.keys(u) as (keyof BaseStats)[]).forEach(
    (updateKey) => (f.fighting.stats[updateKey] = u[updateKey]!)
  )

//set base stats
fighters.forEach((fighter) => {
  s(f(fighter.name), {
    baseStrength: 2,
    baseFitness: 2,
    baseIntelligence: 2,
    baseAggression: 2,
  })
})

s(f("Strong"), { baseStrength: 10 })
s(f("Fit"), { baseFitness: 10 })
s(f("Intelligent"), { baseIntelligence: 10 })
s(f("Aggressive"), { baseAggression: 10 })

s(f("Stupid"), { baseIntelligence: 0 })
s(f("Passive"), { baseAggression: 0 })

s(f("Average"), {
  baseStrength: 5,
  baseFitness: 5,
  baseIntelligence: 5,
  baseAggression: 5,
})

s(f("Hyper"), {
  baseAggression: 10,
  baseFitness: 10,
})
s(f("Crafty"), {
  baseIntelligence: 10,
  baseFitness: 10,
})

s(f("Daniel"), {
  baseStrength: 8,
  baseFitness: 8,
  baseIntelligence: 10,
  baseAggression: 3,
})

s(f("Dave"), {
  baseAggression: 8,
  baseStrength: 10,
  baseIntelligence: 1,
  baseFitness: 1,
})
s(f("Sam"), {
  baseStrength: 4,
  baseFitness: 8,
  baseIntelligence: 8,
  baseAggression: 4,
})

s(f("Superman"), {
  baseStrength: 10,
  baseFitness: 10,
  baseIntelligence: 10,
  baseAggression: 10,
})
