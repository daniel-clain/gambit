import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import { Employee } from "../../../interfaces/front-end-state-interface"
import { random } from "../../../helper-functions/helper-functions"
import { Game } from "../../game"
import { Manager } from "../../manager"
import { handleUnderSurveillance } from "./do-surveillance"


const poisonFighter: Ability = {
  name: 'Poison Fighter',
  cost: { money: 150, actionPoints: 1 },
  possibleSources: ['Private Agent', 'Hitman'],
  notValidTargetIf: ['fighter owned by manager'],
  validTargetIf: ['fighter in next fight'],
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: false
}

export const poisonFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const fighter = game.has.fighters.find(fighter => fighter.name == abilityData.target.name)
    
    let poisoner: Employee
    let poisonersManager: Manager
    for(let manager of game.has.managers){
      poisoner = manager.has.employees.find(employee => employee.name == abilityData.source.name)
      if(poisoner){
        poisonersManager = manager
        break
      }
    }    
    
    if(fighter.state.dead){
      poisonersManager.functions.addToLog({message: `Attempt to poison ${abilityData.target.name} failed because he was already found dead`, type: 'employee outcome'})
      return
    }

    if(poisonersManager.state.underSurveillance){
      handleUnderSurveillance(poisonersManager, abilityData, game)
    }
    let success
    let guardBlocked
    const guardLevel = fighter.state.guards.reduce((totalSkill, thugGuardingFighter) => totalSkill += thugGuardingFighter.skillLevel, 0)
    if(guardLevel > 0){
      const randomNum = random(100, true)
      if(randomNum < 15 - guardLevel * 5 + poisoner.skillLevel * 5)
        success = true
      else
        guardBlocked = true
    }
    else {
      const randomNum = random(100, true)
      if(randomNum < 85 + poisoner.skillLevel * 5)
        success = true

    }
    if(success){

      const r10 = random(10)

      const severityLevel = 
        r10 < 1 ? 'death' :
        r10 < 4 ? 'hallucinate' :
        'sick'

        
      if(severityLevel == 'death'){

        game.functions.removeFighterFromTheGame(fighter.name, game)
        game.has.roundController.preFightNewsStage.newsItems.push({
          newsType: 'fighter died from poison',
          headline: `${fighter.name} had Died from Poisoning!`,
          message: `${fighter.name} has been found dead, frothing at the mouth, eyes a strange yellow color`
        })
        poisonersManager.functions.addToLog({
          message: `${poisoner.name} has successfully poisoned ${fighter.name}`, type: 'employee outcome'
        })
      }
      if(severityLevel == 'sick'){
        fighter.state.sick = true
        game.has.roundController.preFightNewsStage.newsItems.push({
          newsType: 'fighter is sick',
          headline: `${fighter.name} Poisoned!`,
          message: `${fighter.name} has been nauseous and is pale in complexion, there is reason to believe he has been poisoned`
        })
        poisonersManager.functions.addToLog({
          message: `${poisoner.name} has successfully poisoned ${fighter.name}`, type: 'employee outcome'
        })
      }

      if(severityLevel == 'hallucinate'){
        fighter.state.hallucinating = true
        game.has.roundController.preFightNewsStage.newsItems.push({
          newsType: 'fighter is hallucinating',
          headline: `${fighter.name} Poisoned!`,
          message: `${fighter.name} has been acting delirious and highly erratic, he says he cant remember`
        })
        poisonersManager.functions.addToLog({
          message: `${poisoner.name} has successfully poisoned ${fighter.name}`, type: 'employee outcome'
        })
      }
    }
    else if(guardBlocked){
      game.has.roundController.preFightNewsStage.newsItems.push({
        newsType: 'guards protect fighter from being poisoned',
        headline: `${fighter.name} Guarded from Assailant!`,
        message: `Guards have stopped a suspicious man trying to poison ${fighter.name}`
      })      
      poisonersManager.functions.addToLog({
        type: 'employee outcome',
        message: `${poisoner.profession} ${poisoner.name} failed to poison target fighter ${abilityData.target.name} because he was guarded by thugs`
      })
    }
    else
      poisonersManager.functions.addToLog({
        type: 'employee outcome', 
        message: `${poisoner.profession} ${poisoner.name} failed to poison target fighter ${abilityData.target.name}`
      })
  },
  ...poisonFighter
}

export const poisonFighterClient: ClientAbility = {
  shortDescription: 'Poison a fighter',
  longDescription: 'Has a varying chance to inflict a range of affect on a fighter, from lowering hit chance, reduction in speed and strength, or even death. Requires a Drug Dealer employee',
  ...poisonFighter
}

