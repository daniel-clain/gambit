import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import { Employee, FighterInfo } from "../../../interfaces/front-end-state-interface"
import { random } from "../../../helper-functions/helper-functions"
import { Game } from "../../game"
import { Manager } from "../../manager"
import { handleUnderSurveillance } from "./do-surveillance"


const murderFighter: Ability = {
  name: 'Murder Fighter',
  cost: { money: 500, actionPoints: 1 },
  possibleSources: ['Hitman'],
  notValidTargetIf: ['fighter owned by manager'],
  validTargetIf: ['fighter in next fight'],
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: true,
  
}

export const murderFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const fighter = game.has.fighters.find(fighter => fighter.name == abilityData.target.name)
    const {roundNumber} = game.has.roundController
    
    const fightersManager = fighter.state.manager
    let hitman: Employee
    let hitmansManager: Manager
    for(let manager of game.has.managers){
      hitman = manager.has.employees.find(employee => employee.name == abilityData.source.name)
      if(hitman){
        hitmansManager = manager
        break
      }
    }

    if(hitmansManager.state.beingProsecuted){
      return
    }

    
    if(fighter.state.dead){
      hitmansManager.functions.addToLog({
        roundNumber,
        message: `Attempt to murder ${abilityData.target.name} failed because he was already found dead`, type: 'employee outcome'})
      return
    }

    
    if(hitmansManager.state.underSurveillance){
      handleUnderSurveillance({surveilledManager: hitmansManager, abilityData, game})
    }
    if(fighter.state.underSurveillance){
      handleUnderSurveillance({surveilledFighter: fighter, abilityData, game})
    }

    let success
    let guardBlocked
    const guardLevel = fighter.state.guards.reduce((totalSkill, thugGuardingFighter) => totalSkill += thugGuardingFighter.skillLevel, 0)
    if(guardLevel > 0){
      const randomNum = random(100, true)
      if(randomNum < 15 - guardLevel * 5 + hitman.skillLevel * 5)
        success = true
      else
        guardBlocked = true
    }
    else {
      const randomNum = random(100, true)
      if(randomNum < 65 + hitman.skillLevel * 5)
        success = true
    }
    if(success){
      game.functions.removeFighterFromTheGame(fighter.name, game)
      game.has.roundController.preFightNewsStage.newsItems.push({
        newsType: 'fighter murdered',
        headline: `${fighter.name} Found Dead!`,
        message: `${fighter.name} was found in a pool of his own blood, he is dead.`
      })
      if(fightersManager)
        fightersManager.functions.addToLog({
          roundNumber,
          type: 'critical', message: `Your fighter, ${fighter.name}, has been murdered`})
        
      hitmansManager.functions.addToLog({
        roundNumber,
        type: 'employee outcome',
        message: `Hitman ${hitman.name} has murdered fighter ${abilityData.target.name}`
      })
    }
    else if(guardBlocked){
      game.has.roundController.preFightNewsStage.newsItems.push({
        newsType: 'fighter',
        headline: `${fighter.name} Guarded from Assailant!`,
        message: `Guards have protected ${fighter.name} from an attempted murder`
      })      
      hitmansManager.functions.addToLog({
        roundNumber,        
        type: 'employee outcome',
        message: `Hitman ${hitman.name} failed to murder target fighter ${abilityData.target.name} because he was guarded by thugs`
      })
    }
    else
      hitmansManager.functions.addToLog({
        roundNumber,        
        type: 'employee outcome', 
        message: `Hitman ${hitman.name} failed to murder target fighter ${abilityData.target.name}`
      })

  },
  ...murderFighter
}

export const murderFighterClient: ClientAbility = {
  shortDescription: 'Attempt to kill fighter',
  longDescription: 'Chance to kill target fighter',
  ...murderFighter
}


