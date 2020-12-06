import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import Game from "../../game"
import { Professional, Employee } from "../../../interfaces/server-game-ui-state.interface"


const promoteFighter: Ability = {
  name: 'Promote Fighter',
  cost: { money: 30, actionPoints: 1 },
  possibleSources: ['Promoter'],
  possibleTargets: ['fighter owned by manager'],
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: true
}

export const promoteFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const fighter = game.fighters.find(fighter => fighter.name == abilityData.target.name)
    let promoter: Employee
    for(let manager of game.managers){
      promoter = manager.employees.find(employee => employee.name == abilityData.source.name)
      if(promoter)
        break
    }
    fighter.state.publicityRating += promoter.skillLevel
  },
  ...promoteFighter
}

export const promoteFighterClient: ClientAbility = {
  shortDescription: 'Promote one of your fighters',
  longDescription: 'Increases the chance your fighter will be put into fights, and increases the amount of prize money for the fight',
  ...promoteFighter
}

