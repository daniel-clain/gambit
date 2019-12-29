import { AbilitySourceType, AbilityTargetType, IAbility, AbilityNames } from "../../game-components/abilities/abilities";
import { ManagerInfo } from "../../game-components/manager/manager";

export interface AbilitySourceInfo{
  name: string
  type: AbilitySourceType
}


export interface AbilityTargetInfo{
  name: string
  type: AbilityTargetType
}

export default interface IClientAbility extends IAbility{  
  name: AbilityNames
  shortDescription: string
  longDescription: string

  isValidTarget?(target: AbilityTargetInfo, managerInfo: ManagerInfo): boolean
}


export interface AbilityData{
  name: AbilityNames
  target: AbilityTargetInfo
  source: AbilitySourceInfo
  additionalData?: any
}