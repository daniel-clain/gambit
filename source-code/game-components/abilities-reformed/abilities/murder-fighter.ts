import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import Game from "../../game"
import { Employee } from "../../../interfaces/game-ui-state.interface"
import Manager from "../../manager"
import { random } from "../../../helper-functions/helper-functions"


const murderFighter: Ability = {
  name: 'Murder Fighter',
  cost: { money: 500, actionPoints: 1 },
  possibleTargets: ['fighter not owned by manager'],
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: true
}

export const murderFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const fighter = game.fighters.find(fighter => fighter.name == abilityData.target.name)
    
    const fightersManager = fighter.state.manager
    let hitman: Employee
    let hitmansManager: Manager
    for(let manager of game.managers){
      hitman = manager.employees.find(employee => employee.name == abilityData.source.name)
      if(hitman){
        hitmansManager = manager
        break
      }
    }

    
    if(fighter.state.dead){
      hitmansManager.addToLog({message: `Attempt to murder ${abilityData.target.name} failed beacuse he was already found dead`})
      return
    }

    let success
    const guardLevel = fighter.state.guards.reduce((totalSkill, thugGuardingFighter) => totalSkill += thugGuardingFighter.skillLevel, 0)
    if(guardLevel > 0){
      const randomNum = random(100, true)
      if(randomNum > 85 + guardLevel * 5 - hitman.skillLevel * 5)
        success = true
    }
    else {
      const randomNum = random(100, true)
      if(randomNum < 40 + hitman.skillLevel * 5)
        success = true
    }
    if(success){
      removeFighterFromTheGame(fighter.name, game)
      game.roundController.preFightNewsStage.newsItems.push({
        newsType: 'fighter murdered',
        message: `${fighter.name} was found in a pool of his own blood, he is dead.`
      })
      hitmansManager.addToLog({
        message: `${hitman.name} has murdered ${fighter.name}, he is dead`
      })
      if(fightersManager)
        fightersManager.addToLog({type: 'critical', message: `Your fighter, ${fighter.name}, has been murdered`})
    }
    else
      game.roundController.preFightNewsStage.newsItems.push({
        newsType: 'guards protect frighter from being murdered',
        message: `Guards have protected ${fighter.name} from an attempted murder`
      })

  },
  ...murderFighter
}

export const murderFighterClient: ClientAbility = {
  shortDescription: 'Attempt to kill fighter',
  longDescription: 'Chance to kill target fighter',
  ...murderFighter
}


function removeFighterFromTheGame(fighterName, game: Game){
  const fighter = game.fighters.find(fighter => fighter.name == fighterName)
  fighter.state.dead = true

  game.managers.forEach(manager => {
    manager.fighters = manager.fighters.filter(fighter => fighter.name != fighterName)
    manager.knownFighters = manager.knownFighters.filter(fighter => fighter.name != fighterName)
  })

  const fighterFightIndex = game.roundController.activeFight.fighters.findIndex(fighter => fighter.name == fighterName)
  game.roundController.activeFight.fighters.splice(fighterFightIndex, 1)
}

