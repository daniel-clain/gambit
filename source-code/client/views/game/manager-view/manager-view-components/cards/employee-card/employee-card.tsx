
import * as React from 'react';
import './employee-card.scss'
import '../modal-card.scss';
import { ClientAbility } from '../../../../../../../game-components/abilities-reformed/ability';
import AbilityBlock from '../../partials/ability-block/ability-block';
import { InfoBoxListItem } from '../../../../../../../interfaces/game/info-box-list';
import { Modal } from '../../partials/modal/modal';
import { Employee } from '../../../../../../../interfaces/front-end-state-interface';
import {frontEndService} from '../../../../../../front-end-service/front-end-service';
import { InfoBox } from '../../partials/info-box/info-box';
import { abilityService } from '../../../../../../front-end-service/ability-service-client';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader/root';

const {managerMap} = frontEndService

const map = managerMap<Employee>(({activeModal: {data}}) => data)
export const EmployeeCard = connect(map)(hot(employee => {

  const {weeksRemaining, weeklyCost} = employee.activeContract
  const employeeAbilities: ClientAbility[] = abilityService.abilities.filter(ability => !ability.disabled && employee.abilities.includes(ability.name))
  
  const infoBoxList: InfoBoxListItem[] = [
    {label: 'Weeks remaining', value: weeksRemaining},
    {label: 'Cost per week', value: weeklyCost}
  ]

  return (
    <Modal>
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
              abilityData={{
                name: employeeAbility.name,
                source: {
                  name: employee.name,
                  type: employee.profession
                },
                target: undefined
              }}
            />
          ))}      
        </div>
        
      </div>
    </Modal>
  )
}))

