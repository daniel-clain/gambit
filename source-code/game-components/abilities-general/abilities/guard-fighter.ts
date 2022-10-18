import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import { Employee } from "../../../interfaces/front-end-state-interface"
import { Game } from "../../game"
import { Manager } from "../../manager"


export const guardFighter: Ability = {
  name: 'Guard Fighter',
  cost: { money: 5, actionPoints: 1 },
  executes: 'Instantly',
  canOnlyTargetSameTargetOnce: false
}

export const guardFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const fighter = game.has.fighters.find(fighter => fighter.name == abilityData.target.name)

    
    let bodyGuard: Employee
    let guardsManager: Manager
    for(let manager of game.has.managers){
      bodyGuard = manager.has.employees.find(employee => employee.name == abilityData.source.name)
      if(bodyGuard){
        guardsManager = manager
        break
      }
    } 


    fighter.state.guards.push(bodyGuard)
  },
  ...guardFighter
}

