import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import { Employee } from "../../../interfaces/front-end-state-interface"
import { Game } from "../../game"
import { Manager } from "../../manager"
import { handleUnderSurveillance } from "./do-surveillance"
import { getAbilitySourceManager } from "../ability-service-server"
import { randomNumber } from "../../../helper-functions/helper-functions"


export const assaultFighter: Ability = {
  name: 'Assault Fighter',
  cost: { money: 10, actionPoints: 1 },
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: false
}

export const assaultFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const {source, target} = abilityData
    const fighter = game.has.fighters.find(fighter => fighter.name == target!.name)!
    
    const {weekNumber} = game.has.weekController
    
    const assaultersManager = getAbilitySourceManager(source!, game)    

    const assaulter = assaultersManager.has.employees.find(employee => employee.name == abilityData.source!.name)!

    if(assaultersManager.state.underSurveillance){
      handleUnderSurveillance({surveilledManager: assaultersManager, abilityData, game})
    }
    if(fighter.state.underSurveillance){
      handleUnderSurveillance({surveilledFighter: fighter, abilityData, game})
    }

    let success
    let guardBlocked
    const guardLevel = fighter.state.guards.reduce((totalSkill, thugGuardingFighter) => totalSkill += thugGuardingFighter.skillLevel, 0)
    if(guardLevel > 0){
      const randomNum = randomNumber({to: 100})
      if(randomNum < 15 - guardLevel * 5 + assaulter.skillLevel * 5)
        success = true
      else
        guardBlocked = true
    }
    else {
      const randomNum = randomNumber({to: 100})
      if(randomNum < 75 + assaulter.skillLevel * 5)
        success = true

    }
    if(success){
      fighter.state.injured = true
      game.has.weekController.preFightNewsStage.newsItems.push({
        newsType: 'fighter was assaulted',
        headline: `${fighter.name} Assaulted!`,
        message: `${fighter.name} has been assaulted, his injuries will affect his fight performance`
      })
      assaultersManager.functions.addToLog({        
        weekNumber,
        message: `${assaulter.name} has successfully assaulted ${fighter.name} and he is now injured`, type: 'report'
      })
    }
    else if(guardBlocked){
      game.has.weekController.preFightNewsStage.newsItems.push({
        newsType: 'guards protect fighter from being assaulted',
        headline: `${fighter.name} Guarded from Assailant!`,
        message: `Guards have protected ${fighter.name} from an attempted assault`
      })   
      assaultersManager.functions.addToLog({        
        weekNumber,
        message: `${assaulter.profession} ${assaulter.name} failed to assault target fighter ${target!.name} because he was guarded by thugs`, type: 'employee outcome'
      })  
    }
    else
      assaultersManager.functions.addToLog({
        weekNumber,
        type: 'employee outcome',         
        message: `${assaulter.profession} ${assaulter.name} failed to assault target fighter ${target!.name}`
      })
      


  },
  ...assaultFighter
}
