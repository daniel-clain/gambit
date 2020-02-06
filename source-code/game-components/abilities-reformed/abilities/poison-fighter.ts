import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import Game from "../../game"
import { Employee } from "../../../interfaces/game-ui-state.interface"
import Manager from "../../manager/manager"
import { random } from "../../../helper-functions/helper-functions"


const poisonFighter: Ability = {
  name: 'Poison Fighter',
  cost: { money: 150, actionPoints: 1 },
  possibleTargets: ['fighter not owned by manager'],
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: false
}

export const poisonFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const fighter = game.fighters.find(fighter => fighter.name == abilityData.target.name)
    
    let poisoner: Employee
    let poisonersManager: Manager
    for(let manager of game.managers){
      poisoner = manager.employees.find(employee => employee.name == abilityData.source.name)
      if(poisoner)
        poisonersManager = manager
        break
    }    
    
    if(fighter.state.dead){
      poisonersManager.addToLog({message: `Attempt to poison ${abilityData.target.name} failed beacuse he was already found dead`})
      return
    }

    let success
    const guardLevel = fighter.state.guards.reduce((totalSkill, thugGuardingFighter) => totalSkill += thugGuardingFighter.skillLevel, 0)
    if(guardLevel > 0){
      const randomNum = random(100, true)
      if(randomNum > 85 + guardLevel * 5 - poisoner.skillLevel * 5)
        success = true
    }
    else {
      const randomNum = random(100, true)
      if(randomNum < 85 + poisoner.skillLevel * 5)
        success = true

    }
    if(success){
      fighter.state.poisoned = true
      game.roundController.preFightNewsStage.newsItems.push({
        newsType: 'fighter was poisoned',
        message: `${fighter.name} has been behaving in a delerious and nausious, he looks pale and weak, there is reason to belive he has been poisoned`
      })
      poisonersManager.addToLog({
        message: `${poisoner.name} has successfully poisoned ${fighter.name}`
      })
    }
    else
      game.roundController.preFightNewsStage.newsItems.push({
        newsType: 'guards protect fighter from being poisoned',
        message: `Guards have found ${poisoner.name} behaving suspiciously around ${fighter.name} `
      })
  },
  ...poisonFighter
}

export const poisonFighterClient: ClientAbility = {
  shortDescription: 'Poison a fighter',
  longDescription: 'Has a varying chance to inflict a range of affect on a fighter, from lowering hit chance, reduction in speed and strength, or even death. Requires a Drug Dealer employee',
  ...poisonFighter
}

