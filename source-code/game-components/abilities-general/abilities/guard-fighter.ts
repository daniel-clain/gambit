import { Ability, ServerAbility, AbilityData } from "../ability"
import { Game } from "../../game"
import { getAbilitySourceManager } from "../ability-service-server"


export const guardFighter: Ability = {
  name: 'Guard Fighter',
  cost: { money: 5, actionPoints: 1 },
  executes: 'Instantly',
  canOnlyTargetSameTargetOnce: false
}

export const guardFighterServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const {source, target} = abilityData
    const fighter = game.has.fighters.find(fighter => fighter.name == target!.name)!

    const sourceManager = getAbilitySourceManager(source!, game)
    const bodyGuard = sourceManager.has.employees.find(employee => employee.name == source!.name)!


    fighter.state.guards.push(bodyGuard)
  },
  ...guardFighter
}

