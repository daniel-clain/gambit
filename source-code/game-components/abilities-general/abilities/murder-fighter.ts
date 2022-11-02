import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import { Employee } from "../../../interfaces/front-end-state-interface"
import { Game } from "../../game"
import { Manager } from "../../manager"
import { handleUnderSurveillance } from "./do-surveillance"
import { getAbilitySourceManager } from "../ability-service-server"
import { randomNumber } from "../../../helper-functions/helper-functions"


export const murderFighter: Ability = {
  name: 'Murder Fighter',
  cost: { money: 500, actionPoints: 1 },
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: true,
  
}

export const murderFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const {source, target} = abilityData
    const fighter = game.has.fighters.find(fighter => fighter.name == target!.name)!
    const {weekNumber} = game.has.weekController
    
    const fightersManager = fighter.state.manager

    const sourceManager = getAbilitySourceManager(source!, game)
    const hitman = sourceManager.has.employees.find(employee => employee.name == source!.name)!
    
    if(sourceManager.state.underSurveillance){
      handleUnderSurveillance({surveilledManager: sourceManager, abilityData, game})
    }
    if(fighter.state.underSurveillance){
      handleUnderSurveillance({surveilledFighter: fighter, abilityData, game})
    }

    let success
    let guardBlocked
    const guardLevel = fighter.state.guards.reduce((totalSkill, thugGuardingFighter) => totalSkill += thugGuardingFighter.skillLevel, 0)
    if(guardLevel > 0){
      const randomNum = randomNumber({to: 100})
      if(randomNum < 15 - guardLevel * 5 + hitman.skillLevel * 5)
        success = true
      else
        guardBlocked = true
    }
    else {
      const randomNum = randomNumber({to: 100})
      if(randomNum < 65 + hitman.skillLevel * 5)
        success = true
    }
    if(success){
      game.functions.removeFighterFromTheGame(fighter.name, game)
      game.has.weekController.preFightNewsStage.newsItems.push({
        newsType: 'fighter murdered',
        headline: `${fighter.name} Found Dead!`,
        message: `${fighter.name} was found in a pool of his own blood, he is dead.`
      })
      if(fightersManager)
        fightersManager.functions.addToLog({
          weekNumber,
          type: 'critical', message: `Your fighter, ${fighter.name}, has been murdered`})
        
          sourceManager.functions.addToLog({
        weekNumber,
        type: 'employee outcome',
        message: `Hitman ${hitman.name} has murdered fighter ${target!.name}`
      })
    }
    else if(guardBlocked){
      game.has.weekController.preFightNewsStage.newsItems.push({
        newsType: 'fighter',
        headline: `${fighter.name} Guarded from Assailant!`,
        message: `Guards have protected ${fighter.name} from an attempted murder`
      })      
      sourceManager.functions.addToLog({
        weekNumber,        
        type: 'employee outcome',
        message: `Hitman ${hitman.name} failed to murder target fighter ${target!.name} because he was guarded by thugs`
      })
    }
    else
      sourceManager.functions.addToLog({
        weekNumber,        
        type: 'employee outcome', 
        message: `Hitman ${hitman.name} failed to murder target fighter ${target!.name}`
      })

  },
  ...murderFighter
}

