import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import Game from "../../game"
import { random } from "../../../helper-functions/helper-functions"
import { Employee } from "../../../interfaces/game-ui-state.interface"
import Manager from "../../manager"


const prepareForProsecution: Ability = {
  name: 'Prepare For Prosecution',
  cost: { money: 10, actionPoints: 1 },
  possibleSources: ['Lawyer'],
  possibleTargets: ['fighter not owned by manager'],
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: false
}

export const prepareForProsectionServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const fighter = game.has.fighters.find(fighter => fighter.name == abilityData.target.name)
    
    let assaulter: Employee
    let assaultersManager: Manager
    for(let manager of game.has.managers){
      assaulter = manager.has.employees.find(employee => employee.name == abilityData.source.name)
      if(assaulter){
        assaultersManager = manager
        break
      }
    }

    
    if(fighter.state.dead){
      assaultersManager.functions.addToLog({message: `Attempt to assault ${abilityData.target.name} failed beacuse he was already found dead`})
      return
    }

    let success
    let guardBlocked
    const guardLevel = fighter.state.guards.reduce((totalSkill, thugGuardingFighter) => totalSkill += thugGuardingFighter.skillLevel, 0)
    if(guardLevel > 0){
      const randomNum = random(100, true)
      if(randomNum < 15 - guardLevel * 5 + assaulter.skillLevel * 5)
        success = true
      else
        guardBlocked = true
    }
    else {
      const randomNum = random(100, true)
      if(randomNum < 85 + assaulter.skillLevel * 5)
        success = true

    }
    if(success){
      fighter.state.injured = true
      game.has.roundController.preFightNewsStage.newsItems.push({
        newsType: 'fighter was assaulted',
        headline: `${fighter.name} Assaulted!`,
        message: `${fighter.name} has been assaulted, his injuries will affect his fight performance`
      })
      assaultersManager.functions.addToLog({
        message: `${assaulter.name} has successfully assaulted ${fighter.name} and he is now injured`
      })
    }
    else if(guardBlocked){
      game.has.roundController.preFightNewsStage.newsItems.push({
        newsType: 'guards protect fighter from being assaulted',
        headline: `${fighter.name} Guarded from Assailant!`,
        message: `Guards have protected ${fighter.name} from an attempted assault`
      })     
      assaultersManager.has.postFightReportItems.push({
        type: 'employee outcome',
        message: `${assaulter.profession} ${assaulter.name} failed to assault target fighter ${abilityData.target.name} because he was guarded by thugs`
      })
    }
    else
      assaultersManager.has.postFightReportItems.push({
        type: 'employee outcome', 
        message: `${assaulter.profession} ${assaulter.name} failed to assault target fighter ${abilityData.target.name}`
      })
  },
  ...prepareForProsecution
}

export const prepareForProsecutionClient: ClientAbility = {
  shortDescription: 'Chance to take a large amount of money from other manager',
  longDescription: 'An injured fighter will be slower in a fight and have less stamina and recovery',
  ...prepareForProsecution
}

