
import { ClientAbility, AbilityData, AbilitySourceInfo, AbilityTargetInfo } from "./ability"
import { researchFighterClient } from "./abilities/research-fighter"
import { assaultFighterClient } from "./abilities/assault-fighter"
import { doSurveillanceClient } from "./abilities/do-surveillance"
import { gatherEvidenceClient } from "./abilities/gather-evidence"
import { guardFighterClient } from "./abilities/guard-fighter"
import { murderFighterClient } from "./abilities/murder-fighter"
import { offerContractClient } from "./abilities/offer-contract"
import { poisonFighterClient } from "./abilities/poison-fighter"
import { promoteFighterClient } from "./abilities/promote-fighter"
import { sellDrugsClient } from "./abilities/sell-drugs"
import { prosecuteManagerClient } from "./abilities/prosecute-manager"
import { trainFighterClient } from "./abilities/train-fighter"
import { Employee, JobSeeker } from "../../interfaces/server-game-ui-state.interface"
import { dopeFighterClient } from "./abilities/dope-fighter"
import {tryToWinGameClient} from './abilities/try-to-win-game'
import { ManagerInfo } from "../manager"

interface AbilityServiceClient {
  abilities: ClientAbility[]

  getAbilitiesFighterCanBeTheTargetOf(fighterOwnedByManager: boolean): ClientAbility[]

  validateAbilityConfirm(clientAbility: ClientAbility, managerInfo: ManagerInfo, abilityData: AbilityData, delayedExecutionAbilities: AbilityData[])

  isPossibleToPerformAbility(abilityData: AbilityData, managerInfo: ManagerInfo, delayedExecutionAbilities: AbilityData[]): boolean

  getAppropriateSource(clientAbility: ClientAbility, managerInfo: ManagerInfo): AbilitySourceInfo

  getPossibleSources(clientAbility: ClientAbility, managerInfo: ManagerInfo): AbilitySourceInfo[]

  getPossibleTargets(clientAbility: ClientAbility, managerInfo: ManagerInfo, jobSeekers: JobSeeker[]): AbilityTargetInfo[]

  canOnlyBeTargetedOnceConflict (ability: ClientAbility, abilityData: AbilityData, delayedExecutionAbilities: AbilityData[], managerInfo: ManagerInfo): boolean
}

export const abilityServiceClient: AbilityServiceClient = (() => {

  const abilities: ClientAbility[] = [
    assaultFighterClient,
    doSurveillanceClient,
    gatherEvidenceClient,
    guardFighterClient,
    murderFighterClient,
    offerContractClient,
    poisonFighterClient,
    promoteFighterClient,
    researchFighterClient,
    sellDrugsClient,
    prosecuteManagerClient,
    trainFighterClient,
    dopeFighterClient,
    tryToWinGameClient
  ]

  const getPossibleSources = (ability: ClientAbility, managerInfo: ManagerInfo): AbilitySourceInfo[] => {

    const possibleSources: AbilitySourceInfo[] = []


    possibleSources.push(
      ...managerInfo.employees
        .filter(employee =>
          employee.abilities.includes(ability.name) &&
          employee.actionPoints >= ability.cost.actionPoints
        )
        .map(({ name, profession }: Employee): AbilitySourceInfo => ({
          name,
          type: profession
        }))
    )

    if (
      managerInfo.abilities.includes(ability.name) &&
      managerInfo.actionPoints >= ability.cost.actionPoints
    )
      possibleSources.push({
        type: 'Manager',
        name: managerInfo.name
      })

    return possibleSources
  }

  const getAppropriateSource = (clientAbility: ClientAbility, managerInfo: ManagerInfo): AbilitySourceInfo => {
    const employeeThatCanDoAbility = managerInfo.employees.find(employee => employee.abilities.includes(clientAbility.name) && employee.actionPoints >= clientAbility.cost.actionPoints)
    let managerSource
    let employeeSource

    if (
      managerInfo.abilities.includes(clientAbility.name) &&
      managerInfo.actionPoints >= clientAbility.cost.actionPoints
    )
      managerSource = {
        type: 'Manager',
        name: managerInfo.name
      }
    if (employeeThatCanDoAbility)
      employeeSource = {
        type: employeeThatCanDoAbility.profession,
        name: employeeThatCanDoAbility.name
      }

    if(clientAbility.name == 'Offer Contract' && managerSource)
      return managerSource
    else if(employeeSource)
      return employeeSource
    else if(managerSource)
      return managerSource
    
  }
  const isPossibleToPerformAbility = (abilityData: AbilityData, managerInfo: ManagerInfo, delayedExecutionAbilities: AbilityData[]): boolean => {


    const clientAbility: ClientAbility = abilities.find(ability => ability.name == abilityData.name)

    if (!canAffordAbility(clientAbility, managerInfo.money))
      return false

    const possibleSources: AbilitySourceInfo[] = getPossibleSources(clientAbility, managerInfo)

    if (possibleSources.length == 0)
      return false

    const hasDrugDealer = managerInfo.employees.some(employee => employee.profession == 'Drug Dealer')
    if(
      (clientAbility.name == 'Dope Fighter' || 
      clientAbility.name == 'Poison Fighter') 
      && !hasDrugDealer
    )
      return false

    if (
      clientAbility.possibleTargets.includes('fighter owned by manager') &&
      !clientAbility.possibleTargets.includes('fighter not owned by manager')

    )
      if (managerInfo.fighters.length == 0)
        return false

    if (canOnlyBeTargetedOnceConflict(clientAbility, abilityData, delayedExecutionAbilities, managerInfo))
      return false

    return true
  }

  const canOnlyBeTargetedOnceConflict = (ability: ClientAbility, abilityData: AbilityData, delayedExecutionAbilities: AbilityData[], managerInfo: ManagerInfo): boolean => {
    if(
      ability.canOnlyTargetSameTargetOnce && 
      abilityData.target && 
      delayedExecutionAbilities.some(delayedAbility => {
        if(
          (
            delayedAbility.source.name == managerInfo.name || 
            managerInfo.employees.some(employee => employee.name == delayedAbility.source.name)
          ) &&
          delayedAbility.name == ability.name && 
          delayedAbility.target.name == abilityData.target.name
        )
          return true
      })
    )
      return true
  }

  const canAffordAbility = (ability: ClientAbility, managerMoney: number): boolean => {

    return ability.cost.money <= managerMoney
  }

  const validateAbilityConfirm = (clientAbility: ClientAbility, managerInfo: ManagerInfo, abilityData: AbilityData, delayedExecutionAbilities: AbilityData[]) => {

    if (!abilityData.source)
      throw (`${clientAbility.name} requires a source`)


    if (clientAbility.possibleTargets.length != 0 && !abilityData.target)
      throw (`${clientAbility.name} requires a target`)
    if (managerInfo.money < clientAbility.cost.money)
      throw (`manager does not have enough money to pay for ${clientAbility.name}`)

    let sourceActionPoints: number
    if (abilityData.source.type == 'Manager')
      sourceActionPoints = managerInfo.actionPoints
    else
      sourceActionPoints = managerInfo.employees.find(employee => employee.name == abilityData.source.name).actionPoints

    if (sourceActionPoints < clientAbility.cost.actionPoints)
      throw (`${abilityData.source.type} ${abilityData.source.name} does not have enough action points for ${clientAbility.name}`)

    if((clientAbility.name == 'Dope Fighter' || clientAbility.name == 'Poison Fighter') && !managerInfo.employees.some(employee => employee.profession == 'Drug Dealer'))
      throw(`${clientAbility.name} can only be used unless if you have a Drug Dealer employed`)

    if (canOnlyBeTargetedOnceConflict(clientAbility, abilityData, delayedExecutionAbilities, managerInfo))
      throw (`${abilityData.target.name} has already been targeted for ${clientAbility.name} and can not be the target of this ability again`)

  }
  const getAbilitiesFighterCanBeTheTargetOf = (fighterOwnedByManager: boolean): ClientAbility[] => {
    return abilities.filter((ability: ClientAbility) => {
      if(ability.disabled)
        return false
      if(fighterOwnedByManager)
        return ability.possibleTargets.includes('fighter owned by manager')  
      else
        return ability.possibleTargets.includes('fighter not owned by manager')
    })
  }

  function getPossibleTargets(clientAbility: ClientAbility, managerInfo: ManagerInfo, jobSeekers: JobSeeker[]): AbilityTargetInfo[] {
    const targetList: AbilityTargetInfo[] = []
    if (clientAbility.possibleTargets.includes('fighter owned by manager'))
      targetList.push(...managerInfo.fighters.map((fighter): AbilityTargetInfo => ({ name: fighter.name, type: 'fighter owned by manager' })))
    if (clientAbility.possibleTargets.includes('fighter not owned by manager'))
      targetList.push(...managerInfo.knownFighters.map((fighter): AbilityTargetInfo => ({ name: fighter.name, type: 'fighter not owned by manager' })))
    if (clientAbility.possibleTargets.includes('opponent manager'))
      targetList.push(...managerInfo.otherManagers.map((fighter): AbilityTargetInfo => ({ name: fighter.name, type: 'opponent manager' })))

    if (clientAbility.possibleTargets.includes('job seeker'))
      targetList.push(...jobSeekers.map((jobSeeker): AbilityTargetInfo => ({ name: jobSeeker.name, type: 'job seeker' })))

    return targetList
  }


  return {
    abilities,
    getAbilitiesFighterCanBeTheTargetOf,
    validateAbilityConfirm,
    getPossibleSources,
    getPossibleTargets,
    getAppropriateSource,
    isPossibleToPerformAbility,
    canOnlyBeTargetedOnceConflict
  }
})()