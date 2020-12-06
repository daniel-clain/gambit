import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import Game from "../../game"
import { random } from "../../../helper-functions/helper-functions"
import { Employee } from "../../../interfaces/server-game-ui-state.interface"
import Manager from "../../manager"


const tryToWinGame: Ability = {
  name: 'Try To Win',
  cost: { money: 10, actionPoints: 1 },
  possibleSources: ['Manager'],
  possibleTargets: ['fighter not owned by manager'],
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: false
}

export const tryToWinGameServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const fighter = game.fighters.find(fighter => fighter.name == abilityData.target.name)
    
    let assaulter: Employee
    let assaultersManager: Manager
    for(let manager of game.managers){
      assaulter = manager.employees.find(employee => employee.name == abilityData.source.name)
      if(assaulter){
        assaultersManager = manager
        break
      }
    }

    
    if(fighter.state.dead){
      assaultersManager.addToLog({message: `Attempt to assault ${abilityData.target.name} failed beacuse he was already found dead`})
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
      game.roundController.preFightNewsStage.newsItems.push({
        newsType: 'fighter was assaulted',
        headline: `${fighter.name} Assaulted!`,
        message: `${fighter.name} has been assaulted, his injuries will affect his fight performance`
      })
      assaultersManager.addToLog({
        message: `${assaulter.name} has successfully assaulted ${fighter.name} and he is now injured`
      })
    }
    else if(guardBlocked){
      game.roundController.preFightNewsStage.newsItems.push({
        newsType: 'guards protect fighter from being assaulted',
        headline: `${fighter.name} Guarded from Assailant!`,
        message: `Guards have protected ${fighter.name} from an attempted assault`
      })     
      assaultersManager.postFightReportItems.push({
        type: 'employee outcome',
        message: `${assaulter.profession} ${assaulter.name} failed to assault target fighter ${abilityData.target.name} because he was guarded by thugs`
      })
    }
    else
      assaultersManager.postFightReportItems.push({
        type: 'employee outcome', 
        message: `${assaulter.profession} ${assaulter.name} failed to assault target fighter ${abilityData.target.name}`
      })
      


  },
  ...tryToWinGame
}

export const tryToWinGameClient: ClientAbility = {
  shortDescription: 'Chance to win the game',
  longDescription: 'Chose 1 of 3 avenues to attempt to win the game',
  ...tryToWinGame
}

