import {
  Employee,
  FighterInfo,
  JobSeeker,
  KnownFighterInfo,
} from "../../interfaces/front-end-state-interface"
import { Cost } from "../../interfaces/game/cost"
import { Evidence } from "../../types/game/evidence.type"
import { ExecutesWhenOptions } from "../../types/game/executes-when-options"
import { Game } from "../game"
import { KnownManager, ManagerInfo } from "../manager"

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
  execute(
    abilityData: AbilityData,
    game: Game,
    executes?: ExecutesWhenOptions
  ): void
  onSelected?(abilityData: AbilityData, game: Game): void
}

export interface ClientAbility extends Ability {
  longDescription: string
  isValidTarget?(target: TargetTypes): boolean
}

export type TargetTypes =
  | FighterInfo
  | KnownManager
  | KnownFighterInfo
  | JobSeeker

export type SourceTypes = ManagerInfo | Employee

export type ListOption = TargetTypes | SourceTypes

export interface AbilityData {
  name: AbilityName
  target: TargetTypes | undefined
  source: SourceTypes
  additionalData?: any
}

export type DataEvidence = {
  id: string
  evidence: Evidence
}

export type AbilityName =
  | "Research Fighter"
  | "Train Fighter"
  | "Assault Fighter"
  | "Guard Fighter"
  | "Poison Fighter"
  | "Do Surveillance"
  | "Dope Fighter"
  | "Prosecute Manager"
  | "Offer Contract"
  | "Sell Drugs"
  | "Murder Fighter"
  | "Promote Fighter"
  | "Prepare For Prosecution"
  | "Investigate Manager"
  | "Domination Victory"
  | "Wealth Victory"
  | "Sinister Victory"
  | "Take A Dive"
  | "Give Up"
