

import { ExecutesWhenOptions } from '../manager/manager-options/manager-option';
import { AbilityData } from '../../interfaces/game/client-ability.interface';

export type AbilityNames = 
'Research fighter' |
'Train fighter' |
'Assault fighter' |
'Guard fighter' |
'Poison fighter' |
'Spy on manager' |
'Dope fighter' |
'Sue manager' |
'Discover fighter' |
'Offer contract'

export type AbilityExecuteReport = string

export type AbilityValidationError = string

export type AbilitySourceType = 'Manager' | 'Employee'
export type AbilityTargetType = 'Manager' | 'Job Seeker' | 'Fighter'

export interface AbilityTarget{
  name: string
  type: AbilityTargetType
}
export interface AbilitySource{
  name: string
  type: AbilitySourceType
}


export interface IAbility{
  name: AbilityNames
  source: AbilitySource
  target: AbilityTarget

  executesWhen: ExecutesWhenOptions
  validSourceTypes: AbilitySourceType[]
  validateData(data: AbilityData): AbilityValidationError
  setSourceAndTarget(data: AbilityData)
  execute(): AbilityExecuteReport
}


/* export interface IHasAbilities{
  actionPoints: number
  abilities: AbilityNames[]
  type: AbilityUserType
  processSelectedAbility(selectedAbility: AbilityData)
  executeEndOfManagerOptionStageAbilities()
  executeEndOfRoundAbilities()
  resetActionPoints()
} */



/* export const hasAbilities = (name, type: AbilityUserType, allAbilities): IHasAbilities => {
  const actionPoints = 1
  let source: AbilitySource

  const delayedExecutionAbilities: IAbility[] = []
  
  const abilities: IAbility[] = [...allAbilities.filter((ability: IAbility) => ability.validateUserType(type))]

  const processSelectedAbility = (selectedAbility: AbilityData): AbilityExecuteReport => {
    const ability: IAbility = abilities.find(ability => ability.name == selectedAbility.name)
    selectedAbility.source = {name, type}
    const validationError: AbilityValidationError = ability.validateData(selectedAbility)
    if(validationError)
      return validationError


    if(ability.executesWhen == 'Instantly')
      return ability.execute()
    else
      delayedExecutionAbilities.push(ability)    
  }

  const abilityNames: AbilityNames[] = abilities.map(ability => ability.name)

  const executeEndOfManagerOptionStageAbilities = (): AbilityExecuteReport[] => {
    return delayedExecutionAbilities
    .filter((deleyedAbility: IAbility) => 
      deleyedAbility.executesWhen == 'After Manager Options Stage')
    .map((deleyedAbility: IAbility) => deleyedAbility.execute())
  }
  const executeEndOfRoundAbilities = (): AbilityExecuteReport[] => {
    return delayedExecutionAbilities
    .filter((deleyedAbility: IAbility) => 
      deleyedAbility.executesWhen == 'End Of Round')
    .map((deleyedAbility: IAbility) => deleyedAbility.execute())
  }
  const resetActionPoints = () => {}

  return {
    type,
    abilities: abilityNames,
    actionPoints,
    processSelectedAbility,
    executeEndOfManagerOptionStageAbilities,
    executeEndOfRoundAbilities,
    resetActionPoints
  }
} */



/* const createEmployee = (name, type: EmployeeTypes, manager: IManager): IEmployee => {
  return {
    name,
    type,
    manager,
    ...hasAbilities(name, type, allAbilities)
  }
} */



/* console.log('started');
const fred: IManager = createManager('Fred')
const bob: IEmployee = createEmployee('Bob', 'Talent Scout', fred) 
const jim: IEmployee = createEmployee('Jim', 'Private Investigator', fred)


console.log(bob.abilities)
console.log('finished');
 */
