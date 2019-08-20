import {ResearchFighter} from './../../../../classes/game/abilities/research-fighter';
import {ManagerInfo} from './../../../../classes/game/manager/manager';
import IClientAbility, { AbilityData } from './client-ability.interface';
import { FighterInfo } from '../../../../interfaces/game-ui-state.interface';
import { AbilityValidationError } from '../../../../classes/game/abilities/abilities';


export class ResearchFighterClient extends ResearchFighter implements IClientAbility{

  name: 'Research fighter'
  shortDescription: `
  Chance to gain updated info about fighter's public stats    
  `
  longDescription: ``
  
  constructor(){
    super(null)
  }



  isValidTarget(fighter: FighterInfo, managerInfo: ManagerInfo): boolean {
    let isManagersFighter = managerInfo.fighters.some(managersFighter => managersFighter.name == fighter.name)
    if(isManagersFighter){
      return false
    }
    return true
  }

}