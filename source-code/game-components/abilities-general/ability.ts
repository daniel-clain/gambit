
import { Cost } from "../../interfaces/game/cost";
import { AbilityTargetType } from "../../types/game/ability-target-type";
import { AbilitySourceType } from "../../types/game/ability-source-type";
import { ExecutesWhenOptions } from "../../types/game/executes-when-options";
import { Game } from "../game";


export class Ability {
  name: AbilityName
  cost: Cost
  possibleSources: AbilitySourceType[]
  possibleTargets: AbilityTargetType[]
  executes: ExecutesWhenOptions 
  canOnlyTargetSameTargetOnce: boolean
  disabled?: boolean

}
export const removeFighterFromTheGame = (fighterName, game: Game) => {
  const fighter = game.has.fighters.find(fighter => fighter.name == fighterName)
  fighter.state.dead = true

  game.has.managers.forEach(manager => {
    const {fighters, knownFighters} = manager.has
    fighters.splice(
      fighters.findIndex(f => f.name == fighterName), 0
    )
    knownFighters.splice(
      fighters.findIndex(f => f.name == fighterName), 0
    )
  })

  const {fighters} = game.has.roundController.activeFight
  fighters.splice(
    fighters.findIndex(f => f.name == fighterName), 0
  )
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
'Prosecute Manager' |
'Offer Contract' |
'Sell Drugs' |
'Gather Evidence' |
'Murder Fighter' |
'Promote Fighter' |
'Prepare For Prosecution' |
'Try To Win'
