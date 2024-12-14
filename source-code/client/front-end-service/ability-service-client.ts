import {
  AbilityData,
  ClientAbility,
  SourceTypes,
  TargetTypes,
} from "../../game-components/abilities-general/ability"
import { KnownManager, ManagerInfo } from "../../game-components/manager"
import gameConfiguration from "../../game-settings/game-configuration"
import {
  FighterInfo,
  JobSeeker,
  KnownFighterInfo,
} from "../../interfaces/front-end-state-interface"
import { abilities } from "../client-abilities/client-abilities"
import { frontEndState } from "../front-end-state/front-end-state"

const { tryToWinAvailableFromWeek } = gameConfiguration
const { serverGameUIState } = frontEndState.serverUIState

export function getAbilitiesThatCanTargetThis(target: TargetTypes) {
  return abilities.filter((ability) => ability.isValidTarget?.(target))
}

export function getAbilitiesThisSourceCanDo(source: SourceTypes) {
  return abilities.filter((ability) => source.abilities.includes(ability.name))
}

export function getAppropriateSource(
  clientAbility: ClientAbility,
  managerInfo: ManagerInfo
): SourceTypes | undefined {
  const managerSource =
    managerInfo.abilities.includes(clientAbility.name) &&
    managerInfo.actionPoints >= clientAbility.cost.actionPoints &&
    managerInfo
  const employeeSource = managerInfo.employees.find(
    (employee) =>
      employee.abilities.includes(clientAbility.name) &&
      employee.actionPoints >= clientAbility.cost.actionPoints
  )

  if (clientAbility.name == "Offer Contract" && managerSource)
    return managerSource
  else if (employeeSource) return employeeSource
  else if (managerSource) return managerSource
}

export function canOnlyBeTargetedOnceConflict(
  ability: ClientAbility,
  abilityData: Partial<AbilityData>,
  delayedExecutionAbilities: AbilityData[],
  managerInfo: ManagerInfo
): boolean {
  return (
    !!ability.canOnlyTargetSameTargetOnce &&
    !!abilityData.target &&
    delayedExecutionAbilities.some(
      ({ source, name, target }) =>
        (source?.name == managerInfo.name ||
          managerInfo.employees.some((e) => e.name == source?.name)) &&
        name == ability.name &&
        target?.name == abilityData.target?.name
    )
  )
}

export function getPossibleTargets(
  clientAbility: ClientAbility,
  managerInfo: ManagerInfo,
  jobSeekers: JobSeeker[]
): TargetTypes[] {
  return [
    ...managerInfo.fighters,
    ...managerInfo.knownFighters,
    ...managerInfo.otherManagers,
    ...jobSeekers.filter((j) => j.type != "Fighter"),
  ].filter((target) => clientAbility.isValidTarget?.(target))
}

export function getPossibleSources(
  ability: ClientAbility,
  managerInfo: ManagerInfo
): SourceTypes[] {
  const possibleSources: SourceTypes[] = []

  possibleSources.push(
    ...managerInfo.employees.filter(
      (employee) =>
        employee.abilities.includes(ability.name) &&
        employee.actionPoints >= ability.cost.actionPoints
    )
  )

  if (
    managerInfo.abilities.includes(ability.name) &&
    managerInfo.actionPoints >= ability.cost.actionPoints
  ) {
    possibleSources.push(managerInfo)
  }

  return possibleSources
}

export function validateAbilityConfirm(
  clientAbility: ClientAbility,
  managerInfo: ManagerInfo,
  abilityData: AbilityData,
  delayedExecutionAbilities: AbilityData[],
  currentWeek: number,
  enoughFightersForFinalTournament: boolean
) {
  const { source, target } = abilityData

  if (!source) {
    throw `${clientAbility.name} requires a source`
  }

  if (
    clientAbility.canOnlyBeUsedOnce &&
    delayedExecutionAbilities.some((a) => a.name == clientAbility.name)
  ) {
    throw "Ability can only be used once"
  }

  if (
    clientAbility.name == "Domination Victory" &&
    !enoughFightersForFinalTournament
  ) {
    throw `Not enough manager owned fighters for final tournament (minimum 8)`
  }

  if (
    clientAbility.name == "Wealth Victory" &&
    !managerInfo.employees.find((e) => e.profession == "Lawyer")
  ) {
    throw `You need at least 1 Lawyer for a Wealth Victory`
  }

  if (
    clientAbility.name == "Sinister Victory" &&
    !managerInfo.employees.find((e) => e.profession == "Hitman")
  ) {
    throw `You need at least 1 Hitman for a Sinister Victory`
  }

  if (clientAbility.name == "Give Up" && managerInfo.money > 0) {
    throw `You still have money, dont give up`
  }

  if (
    clientAbility.notActiveUntilWeek &&
    clientAbility.notActiveUntilWeek > currentWeek
  ) {
    throw `${clientAbility.name} is not available until Week ${clientAbility.notActiveUntilWeek}`
  }

  if (!!clientAbility.isValidTarget && !target) {
    throw `${clientAbility.name} requires a target`
  }

  if (
    managerInfo.money < clientAbility.cost.money &&
    clientAbility.name != "Give Up"
  ) {
    throw `manager does not have enough money to pay for ${clientAbility.name}`
  }

  if (source) {
    if (source.actionPoints < clientAbility.cost.actionPoints)
      throw `${source.characterType} ${source.name} does not have enough action points for ${clientAbility.name}`
  }

  if (prosecuteManagerHasNoEvidence()) {
    throw `${clientAbility.name} requires a evidence`
  }

  if (
    (clientAbility.name == "Dope Fighter" ||
      clientAbility.name == "Poison Fighter") &&
    !managerInfo.employees.some(
      (employee) => employee.profession == "Drug Dealer"
    )
  ) {
    throw `${clientAbility.name} can only be used unless if you have a Drug Dealer employed`
  }

  if (
    canOnlyBeTargetedOnceConflict(
      clientAbility,
      abilityData,
      delayedExecutionAbilities,
      managerInfo
    )
  )
    throw `${abilityData.target!.name} has already been targeted for ${
      clientAbility.name
    } and can not be the target of this ability again`

  function prosecuteManagerHasNoEvidence() {
    if (abilityData.name != "Prosecute Manager") return false
    if (!abilityData.additionalData || !(abilityData.additionalData.length > 0))
      return true
    return false
  }
}

export function isPossibleToPerformAbility(
  abilityData: Partial<AbilityData>,
  managerInfo: ManagerInfo,
  delayedExecutionAbilities: AbilityData[],
  currentWeek: number,
  enoughFightersForFinalTournament: boolean,
  jobSeekers: JobSeeker[]
): boolean {
  const clientAbility: ClientAbility = abilities.find(
    (ability) => ability.name == abilityData.name
  )!

  const possibleTargets = getPossibleTargets(
    clientAbility,
    managerInfo,
    jobSeekers
  )

  if (clientAbility.isValidTarget && !possibleTargets.length) return false

  // ability already used
  if (
    clientAbility.canOnlyBeUsedOnce &&
    delayedExecutionAbilities.some((a) => a.name == clientAbility.name)
  )
    return false

  // can afford money
  if (
    clientAbility.cost.money > managerInfo.money &&
    clientAbility.name != "Give Up"
  )
    return false

  // active at Week number
  if (
    clientAbility.notActiveUntilWeek &&
    clientAbility.notActiveUntilWeek > currentWeek
  ) {
    return false
  }

  // need fighters for domination victory
  if (
    clientAbility.name == "Domination Victory" &&
    !enoughFightersForFinalTournament
  ) {
    return false
  }

  // need lawyers for wealth victory
  if (
    clientAbility.name == "Wealth Victory" &&
    !managerInfo.employees.find((e) => e.profession == "Lawyer")
  ) {
    return false
  }

  if (
    clientAbility.name == "Sinister Victory" &&
    !managerInfo.employees.find((e) => e.profession == "Hitman")
  ) {
    return false
  }

  // need fighters for domination victory
  if (clientAbility.name == "Give Up" && managerInfo.money > 0) {
    return false
  }

  // has a source
  const possibleSources: SourceTypes[] = getPossibleSources(
    clientAbility,
    managerInfo
  )
  if (possibleSources.length == 0) {
    return false
  }

  const hasDrugDealer = managerInfo.employees.some(
    (employee) => employee.profession == "Drug Dealer"
  )
  if (
    (clientAbility.name == "Dope Fighter" ||
      clientAbility.name == "Poison Fighter") &&
    !hasDrugDealer
  )
    return false

  if (
    canOnlyBeTargetedOnceConflict(
      clientAbility,
      abilityData,
      delayedExecutionAbilities,
      managerInfo
    )
  )
    return false

  return true
}

export function fighterOwnedByManager(
  fighter: FighterInfo | KnownFighterInfo,
  manager?: ManagerInfo
): boolean {
  // this manager if manager not specified
  const { managerInfo } =
    frontEndState.serverUIState.serverGameUIState!.playerManagerUIState!
  return (manager || managerInfo).fighters.some((f) => f.name == fighter.name)
}

export function fighterInNextFight(
  fighter: KnownFighterInfo | FighterInfo
): boolean {
  const { nextFightFighters } =
    frontEndState.serverUIState.serverGameUIState!.playerManagerUIState!
  return nextFightFighters.some((fighterName) => fighterName == fighter.name)
}
export function isThisManager(manager: KnownManager): boolean {
  const { managerInfo } =
    frontEndState.serverUIState.serverGameUIState!.playerManagerUIState!
  return managerInfo.name == manager.name
}

export function ifTargetIsFighter(
  target: TargetTypes,
  effect: (fighter: KnownFighterInfo | FighterInfo) => void
): { else?: (effect: () => void) => void } {
  const condition = target.characterType == "Fighter"

  if (condition) {
    let convertToKnown = target
    if (target.stats.intelligence) {
      target.stats
    } else if (typeof target.stats.intelligence == "number") {
      target.stats.intelligence
    }
    effect(target)
  }
  return {
    else(effect) {
      if (!condition) effect()
    },
  }
}

export function tryToWinUnlocked(): boolean {
  const { playerManagerUIState } =
    frontEndState.serverUIState.serverGameUIState!
  return playerManagerUIState!.week >= tryToWinAvailableFromWeek
}

export function getTryToWinAbilities() {
  return abilities.filter((a) =>
    ["Domination Victory", "Wealth Victory", "Sinister Victory"].includes(
      a.name
    )
  )
}
