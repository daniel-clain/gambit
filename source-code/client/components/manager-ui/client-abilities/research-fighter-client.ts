import { ResearchFighter } from "../../../../game-components/abilities/research-fighter"
import IClientAbility, { AbilityTargetInfo } from "../../../../interfaces/game/client-ability.interface"
import { FighterInfo } from "../../../../interfaces/game-ui-state.interface"
import { ManagerInfo } from "../../../../game-components/manager/manager"


export class ResearchFighterClient extends ResearchFighter implements IClientAbility{

  name: 'Research fighter'
  shortDescription: `
  Chance to gain updated info about fighter's public stats    
  `
  longDescription: ``
  
  constructor(){
    super(null)
  }



  isValidTarget(target: AbilityTargetInfo, managerInfo: ManagerInfo): boolean {
    let isManagersFighter = managerInfo.fighters.some(managersFighter => managersFighter.name == target.name)
    if(isManagersFighter){
      return false
    }
    return true
  }

}