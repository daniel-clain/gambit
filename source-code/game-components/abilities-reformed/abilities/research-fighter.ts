import { Ability, ClientAbility, ServerAbility, AbilityData, AbilitySourceInfo } from "../ability"
import { FighterInfo, Employee, KnownFighterStat } from "../../../interfaces/server-game-ui-state.interface"
import SkillLevel from "../../../types/game/skill-level.type"
import { AbilitySourceType } from "../../../types/game/ability-source-type"
import { random } from "../../../helper-functions/helper-functions"
import { Game } from "../../game"
import { Manager } from "../../manager"


const researchFighter: Ability = {
  name: 'Research Fighter',
  cost: { money: 5, actionPoints: 1 },
  possibleSources: ['Manager', 'Private Agent', 'Talent Scout'],
  possibleTargets: ['fighter not owned by manager'],
  executes: 'Instantly',
  canOnlyTargetSameTargetOnce: false
}


export const researchFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const fighterInfo: FighterInfo = game.has.fighters.find(fighter => fighter.name == abilityData.target.name).getInfo()

    const manager: Manager = determineSourceManager(abilityData, game)
    const skillLevel: SkillLevel = determineSkillLevel(abilityData.source, game)
    
    const existingFighter: FighterInfo = manager.has.knownFighters.find(fighter => fighter.name == abilityData.target.name)

    const knownStatsKeys = Object.getOwnPropertyNames(existingFighter)
    const researchedStats = getRandomStatsFromFighter(abilityData.source.type, skillLevel, fighterInfo, knownStatsKeys, existingFighter)

    for(let key in researchedStats){
      if(invalidKey(key)) continue
      console.log(key)
      existingFighter[key] = researchedStats[key]
    }

    console.log(`${abilityData.source.type} ${abilityData.source.name} used research fighter and found out the following stats about ${abilityData.target.name}`, researchedStats);
    
  },
  ...researchFighter
}

export const researchFighterClient: ClientAbility = {
  shortDescription: 'research a fighter',
  longDescription: 'find out more stats about fighter, amount of stats is relative to skill level and profession',
  ...researchFighter
}



const getRandomStatsFromFighter = (sourceType: AbilitySourceType, skillLevel: SkillLevel, fighterInfo: FighterInfo, knownStatsKeys: string[], existingFighter: FighterInfo): any => {
  const returnStatsObj = {}
  let numberOfStats
  switch (sourceType) {
    case 'Manager': numberOfStats = 4; break
    case 'Talent Scout': numberOfStats =  2 + skillLevel * 2; break
    case 'Private Agent': numberOfStats =  2 + skillLevel * 3; break
  }

  for(let loops = 0;
    Object.keys(returnStatsObj).length < numberOfStats && 
    Object.keys(returnStatsObj).length < knownStatsKeys.length &&
    loops < 20
  ;loops ++){
    const randomKey = knownStatsKeys[random(knownStatsKeys.length - 1)]

    if(invalidKey(randomKey)) continue

    const alreadyHasThatStat = !!returnStatsObj[randomKey]
    const alreadyDiscoveredThatStatThisTurn = existingFighter[randomKey] && existingFighter[randomKey]?.roundsSinceUpdated === 0
    if(!alreadyHasThatStat && !alreadyDiscoveredThatStatThisTurn)
      returnStatsObj[randomKey] = <KnownFighterStat>{lastKnownValue: fighterInfo[randomKey], roundsSinceUpdated: 0}
    
  }
  return returnStatsObj

}

const determineSkillLevel = (sourceInfo: AbilitySourceInfo, game: Game): SkillLevel => {
  if(sourceInfo.type == 'Manager')
    return 1

  const employee = game.has.managers.reduce((foundEmployee: Employee, manager) => {
    if(foundEmployee)
      return foundEmployee
    
    return manager.has.employees.find(employee => employee.name == sourceInfo.name)
  }, undefined)

  return employee.skillLevel
  
}
const determineSourceManager = (abilityData: AbilityData, game: Game): Manager => {
  if(abilityData.source.type == 'Manager'){
    return game.has.managers.find(manager => manager.has.name == abilityData.source.name)
  }
  else{
    return game.has.managers.find(manager => manager.has.employees.some(employee => employee.name == abilityData.source.name))
  }
}

const invalidKey = key => {
  return !['strength', 'fitness', 'intelligence', 'aggression', 'numberOfFights', 'numberOfWins', 'manager'].includes(key)
}
