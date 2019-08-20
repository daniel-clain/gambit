import {ResearchFighterClient} from './client-abilities/research-fighter-client';
import {OfferContractClient} from './client-abilities/offer-contract-client';
import {Employee} from './../../../interfaces/game-ui-state.interface';
import {ManagerInfo} from './../../../classes/game/manager/manager';

import IClientAbility, { AbilityData, AbilitySourceInfo } from './client-abilities/client-ability.interface';
import { FighterInfo } from '../../../interfaces/game-ui-state.interface';

export default class AbilityService{
  
  allAbilities: IClientAbility []
  constructor(){
    this.allAbilities = [
      new OfferContractClient(),
      new ResearchFighterClient()
    ]
  }

  getAbilitiesFighterCanBeTheTargetOf(fighterInfo: FighterInfo, managerInfo: ManagerInfo): AbilityData[]{
    return this.allAbilities.filter((ability: IClientAbility) => ability.isValidTarget(fighterInfo, managerInfo)).map((ability: IClientAbility): AbilityData => {
      return {
        name: ability.name,
        source: this.determineAbilitySource(ability, managerInfo),
        target: fighterInfo
      }
    })
  }

  determineAbilitySource(ability: IClientAbility, managerInfo: ManagerInfo): AbilitySourceInfo{

    const validEmployees: Employee[] = managerInfo.employees.filter(
      (employee: Employee) => ability.validSourceTypes.some(
        sourceType => sourceType == employee.type) && employee.actionPoints != 0)
    
    if(validEmployees.length > 0)
      return {
        name: validEmployees[0].name,
        type: validEmployees[0].type
      }
    else if(managerInfo.actionPoints != 0)
      return {
        name: managerInfo.name,
        type: 'Manager'
      }

  }
}