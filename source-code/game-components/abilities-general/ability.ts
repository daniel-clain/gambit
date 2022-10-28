
import { Cost } from "../../interfaces/game/cost";
import { ExecutesWhenOptions } from "../../types/game/executes-when-options";
import { Game } from "../game";
import { Employee, FighterInfo, JobSeeker } from "../../interfaces/front-end-state-interface";
import { ManagerInfo, KnownManager } from "../manager";


export type Ability = {
  name: AbilityName
  cost: Cost
  executes: ExecutesWhenOptions | ExecutesWhenOptions[]
  canOnlyTargetSameTargetOnce?: boolean
  canOnlyBeUsedOnce?: boolean
  disabled?: boolean
  priority?: number
  notActiveUntilWeek?: number
}




export interface ServerAbility extends Ability {
  execute(abilityData: AbilityData, game: Game, executes?: ExecutesWhenOptions)
  onSelected?(abilityData: AbilityData, game: Game)
}

export interface ClientAbility extends Ability {
  longDescription
  isValidTarget?(target: TargetTypes): boolean
}


export type TargetTypes = FighterInfo | KnownManager | JobSeeker
export type SourceTypes = ManagerInfo | Employee


export type ListOption = TargetTypes | SourceTypes

export interface AbilityData{
  name: AbilityName
  target: TargetTypes
  source: SourceTypes
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
'Sinister Victory' |
'Take A Dive' |
'Give Up'
