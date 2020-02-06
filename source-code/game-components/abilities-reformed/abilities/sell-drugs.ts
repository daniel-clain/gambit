import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import Game from "../../game"


const sellDrugs: Ability = {
  name: 'Sell Drugs',
  cost: { money: 200, actionPoints: 1 },
  possibleTargets: [],
  executes: 'End Of Round',
  canOnlyTargetSameTargetOnce: false
}

export const sellDrugsServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const manager = game.managers.find(manager => manager.employees.some(employee => employee.name == abilityData.source.name))
    const drugDealer = manager.employees.find(employee => employee.name == abilityData.source.name)
    const moneyFromDrugDealing =  50 * drugDealer.skillLevel + 200
    manager.money += moneyFromDrugDealing
    manager.addToLog({message: `${abilityData.source.name} has made ${moneyFromDrugDealing} money from selling drugs`})
  },
  ...sellDrugs
}

export const sellDrugsClient: ClientAbility = {
  shortDescription: 'Make money from selling drugs',
  longDescription: 'Make money relative to skill level. Make less money if other drug dealers are selling',
  ...sellDrugs
}

