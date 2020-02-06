
import { Cost } from "../../interfaces/game/cost";
import { AbilityTargetType } from "../../types/game/ability-target-type";
import { AbilitySourceType } from "../../types/game/ability-source-type";
import { ExecutesWhenOptions } from "../../types/game/executes-when-options";
import Game from "../game";


export interface Ability {
  name: AbilityName
  cost: Cost
  possibleTargets: AbilityTargetType[]
  executes: ExecutesWhenOptions 
  canOnlyTargetSameTargetOnce: boolean
}

export interface ServerAbility extends Ability {
  execute(abilityData: AbilityData, game: Game)
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
'Sue Manager' |
'Offer Contract' |
'Sell Drugs' |
'Gather Evidence' |
'Murder Fighter' |
'Promote Fighter'
