import { Game } from "../../game"
import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"
import { handleUnderSurveillance } from "./do-surveillance"


const sellDrugs: Ability = {
  name: 'Sell Drugs',
  cost: { money: 200, actionPoints: 1 },
  possibleSources: ['Drug Dealer'],
  notValidTargetIf: ['fighter'],
  validTargetIf: [],
  executes: 'End Of Round',
  canOnlyTargetSameTargetOnce: false
}

export const sellDrugsServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const manager = game.has.managers.find(manager => manager.has.employees.some(employee => employee.name == abilityData.source.name))

    if(!manager){
      return
    }
    const drugDealer = manager.has.employees.find(employee => employee.name == abilityData.source.name)

    if(manager.state.underSurveillance){
      handleUnderSurveillance({surveilledManager: manager, abilityData, game})
    }


    const moneyFromDrugDealing =  50 * drugDealer.skillLevel + 200

    manager.has.money += moneyFromDrugDealing

    manager.functions.addToLog({message: `${abilityData.source.name} has made ${moneyFromDrugDealing} money from selling drugs`, type:'employee outcome'})
  },
  ...sellDrugs
}

export const sellDrugsClient: ClientAbility = {
  shortDescription: 'Make money from selling drugs',
  longDescription: 'Make money relative to skill level. Make less money if other drug dealers are selling',
  ...sellDrugs
}

