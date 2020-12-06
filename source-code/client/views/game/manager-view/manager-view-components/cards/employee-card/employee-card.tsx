
import * as React from 'react';
import './employee-card.scss'
import '../modal-card.scss';
import { AbilityData, ClientAbility } from '../../../../../../../game-components/abilities-reformed/ability';
import { abilityServiceClient } from '../../../../../../../game-components/abilities-reformed/ability-service-client';
import { ManagerInfo } from '../../../../../../../game-components/manager';
import { Employee } from '../../../../../../../interfaces/server-game-ui-state.interface';
import AbilityBlock from '../ability-block/ability-block';
import { InfoBoxListItem } from '../../../../../../../interfaces/game/info-box-list';
import InfoBox from '../../partials/info-box/info-box';

export interface EmployeeCardProps{
  delayedExecutionAbilities: AbilityData[]
  employee: Employee
  managerInfo: ManagerInfo
  abilitySelected(abilityData: AbilityData)
}

export class EmployeeCard extends React.Component<EmployeeCardProps>{

  render(){
    const {employee, abilitySelected, managerInfo, delayedExecutionAbilities} = this.props
    const {weeksRemaining, weeklyCost} = employee.activeContract
    const employeeAbilities: ClientAbility[] = abilityServiceClient.abilities.filter(ability => !ability.disabled && employee.abilities.includes(ability.name))
    
    const infoBoxList: InfoBoxListItem[] = [
      {label: 'Weeks remaining', value: weeksRemaining},
      {label: 'Cost per week', value: weeklyCost}
    ]

    return (
      <div className='card employee-card'>
        <div className='heading'>{employee.name}</div>
        <div className="card__two-columns">
          <div className='card__two-columns__left employee-card__image'></div>
          <div className='card__two-columns__right'>    
            <div className='employee-card__profession'>
              Profession: {employee.profession}
            </div>     
            <div className='employee-card__skill-level'>
              Skill level: {employee.skillLevel}
            </div>     
            <InfoBox heading={'Active Contract'} list={infoBoxList}/>
          </div>
        </div>
        
        <div className='card__options'>
          <div className='heading'>{employee.profession} Abilities</div>
          {employeeAbilities.map((employeeAbility: ClientAbility) => (
            <AbilityBlock 
              key={employeeAbility.name} 
              managerInfo={managerInfo}
              delayedExecutionAbilities={delayedExecutionAbilities}
              abilityData={{
                name: employeeAbility.name,
                source: {
                  name: employee.name,
                  type: employee.profession
                },
                target: undefined
              }} 
              onSelected={abilitySelected} 
            />
          ))}      
        </div>
        
      </div>
    )
  }
}