
import * as React from 'react';
import { Employee, JobSeeker } from '../../../interfaces/game-ui-state.interface';
import AbilityBlock from './ability-block';
import { ManagerInfo } from '../../../classes/game/manager/manager';
import { IAbility } from '../../../classes/game/abilities/abilities';
import AbilityService from './ability-service';
import IClientAbility, { AbilityData } from './client-abilities/client-ability.interface';

interface EmployeeCardProps{
  employee: Employee
  managerInfo: ManagerInfo
  onAbilityBlockSelected(abilityData: AbilityData)
  abilityService: AbilityService
}

export class EmployeeCard extends React.Component<EmployeeCardProps>{

  render(){
    const {employee, onAbilityBlockSelected, managerInfo, abilityService} = this.props

    const employeeAbilities: IClientAbility[] = abilityService
    .allAbilities.filter((ability: IClientAbility) => 
      ability.validSourceTypes.some(abilitySourceType => abilitySourceType == employee.type))
    


    return (
      <div className='card'>
        <div className='card__name'>{employee.name}</div>
        <div className='card__left'></div>
        <div className='card__right'>    
          <div>
            Type: {employee.type} <br/>
            Skill level: {employee.skillLevel}
          </div>     
          <div className='contract-details'>
            <div className='heading'>Contract Details</div>
            Weeks remaining: {employee.activeContract.weeksRemaining} <br/>
            Cost per week: {employee.activeContract.costPerWeek} 
          </div>
          }
        </div>
        <div className='card__options'>
          <div className='heading'>Options</div>
          {employeeAbilities.map((ability: IClientAbility) => (
            <AbilityBlock key={ability.name} abilityData={ability} onSelected={onAbilityBlockSelected} abilityService={abilityService}/>
          ))}      
        </div>
        
      </div>
    )
  }
}