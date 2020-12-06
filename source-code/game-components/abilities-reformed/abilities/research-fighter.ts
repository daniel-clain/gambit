import { Ability, ClientAbility, ServerAbility, AbilityData, AbilitySourceInfo } from "../ability"

import Game from "../../game"
import { KnownFighter, FighterInfo, Employee, KnownFighterStatValue } from "../../../interfaces/server-game-ui-state.interface"
import Manager from "../../manager"
import SkillLevel from "../../../types/game/skill-level.type"
import { AbilitySourceType } from "../../../types/game/ability-source-type"
import { random } from "../../../helper-functions/helper-functions"


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
    const fighterInfo: FighterInfo = game.fighters.find(fighter => fighter.name == abilityData.target.name).getInfo()

    const manager: Manager = determineSourceManager(abilityData, game)
    const skillLevel: SkillLevel = determineSkillLevel(abilityData.source, game)
    
    const existingFighter: KnownFighter = manager.knownFighters.find(fighter => fighter.name == abilityData.target.name)

    const knownStatsKeys = Object.getOwnPropertyNames(existingFighter.knownStats)
    const researchedStats = getRandomStatsFromFighter(abilityData.source.type, skillLevel, fighterInfo, knownStatsKeys, existingFighter)

    for(let key in researchedStats){
      existingFighter.knownStats[key] = researchedStats[key]
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



const getRandomStatsFromFighter = (sourceType: AbilitySourceType, skillLevel: SkillLevel, fighterInfo: FighterInfo, knownStatsKeys: string[], existingFighter: KnownFighter): any => {
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
    const alreadyHasThatStat = !!returnStatsObj[randomKey]
    const alreadyDiscoveredThatStatThisTurn = existingFighter.knownStats[randomKey] && existingFighter.knownStats[randomKey].roundsSinceUpdated === 0
    if(!alreadyHasThatStat && !alreadyDiscoveredThatStatThisTurn)
      returnStatsObj[randomKey] = <KnownFighterStatValue>{lastKnownValue: fighterInfo[randomKey], roundsSinceUpdated: 0}
    
  }
  return returnStatsObj
}

const determineSkillLevel = (sourceInfo: AbilitySourceInfo, game: Game): SkillLevel => {
  if(sourceInfo.type == 'Manager')
    return 1

  const employee = game.managers.reduce((foundEmployee: Employee, manager) => {
    if(foundEmployee)
      return foundEmployee
    
    return manager.employees.find(employee => employee.name == sourceInfo.name)
  }, undefined)

  return employee.skillLevel
  
}
const determineSourceManager = (abilityData: AbilityData, game: Game): Manager => {
  if(abilityData.source.type == 'Manager'){
    return game.managers.find(manager => manager.name == abilityData.source.name)
  }
  else{
    return game.managers.find(manager => manager.employees.some(employee => employee.name == abilityData.source.name))
  }
}
