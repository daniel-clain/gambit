
import { Cost } from "../../interfaces/game/cost";
import { AbilityTargetType } from "../../types/game/ability-target-type";
import { AbilitySourceType } from "../../types/game/ability-source-type";
import { ExecutesWhenOptions } from "../../types/game/executes-when-options";
import { Game } from "../game";


export class Ability {
  name: AbilityName
  cost: Cost
  possibleSources: AbilitySourceType[]
  notValidTargetIf?: AbilityTargetType[]
  validTargetIf: AbilityTargetType[]
  executes: ExecutesWhenOptions | ExecutesWhenOptions[]
  canOnlyTargetSameTargetOnce: boolean
  disabled?: boolean
  priority?: number
  notActiveUntilRound?: number
  canOnlyBeUsedOnce?: boolean
}



export interface ServerAbility extends Ability {
  execute(abilityData: AbilityData, game: Game, executes?: ExecutesWhenOptions)
  onSelected?(abilityData: AbilityData, game: Game)
}

export interface ClientAbility extends Ability {
  shortDescription
  longDescription
}


export interface AbilitySourceInfo{
  name: string
  type: AbilitySourceType
}


export interface AbilityTargetInfo{
  name: string
  type: AbilityTargetType
}


export interface AbilityData{
  name: AbilityName
  target: AbilityTargetInfo
  source: AbilitySourceInfo
  additionalData?: any
}

export type AbilityName = 
'Research Fighter' |
'Train Fighter' |
'Assault Fighter' |
'Guard Fighter' |
'Poison Fighter' |
'Do Surveillance' |
'Dope Fighter' |
'Prosecute Manager' |
'Offer Contract' |
'Sell Drugs' |
'Murder Fighter' |
'Promote Fighter' |
'Prepare For Prosecution' |
'Investigate Manager' |
'Domination Victory' |
'Wealth Victory' |
'Sinister Victory'
