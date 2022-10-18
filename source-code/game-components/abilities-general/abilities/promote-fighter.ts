import { Ability, ServerAbility, AbilityData, SourceTypes } from "../ability"
import { Game } from "../../game"
import { Employee } from "../../../interfaces/front-end-state-interface"
import { getAbilitySourceManager } from "../ability-service-server"


export const promoteFighter: Ability = {
  name: 'Promote Fighter',
  cost: { money: 30, actionPoints: 1 },
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: true
}

export const promoteFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const {target} = abilityData
    const fighter = game.has.fighters.find(fighter => fighter.name == target.name)
    let promoter: Employee
    
    for(let manager of game.has.managers){
      promoter = manager.has.employees.find(employee => employee.name == abilityData.source.name)
      if(promoter)
        break
    }
    fighter.state.publicityRating += promoter.skillLevel
  },
  ...promoteFighter
}