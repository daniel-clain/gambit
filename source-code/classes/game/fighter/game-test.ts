import fighterGenerator, { xFighter } from "./fighter-generator";
var allFighterNames
var getTenRandomFighterNames

const tenRandomFighterNames: string[] = getTenRandomFighterNames()

const tenFighters: xFighter[] = tenRandomFighterNames.map(name => fighterGenerator.createNewFighter(name))


tenFighters.forEach(fighter => fighter.startFighting())



getTenRandomFighterNames = (): string[] => {
  return allFighterNames.shuffle().then((names: string[]) => names.slice(0, 9))
}