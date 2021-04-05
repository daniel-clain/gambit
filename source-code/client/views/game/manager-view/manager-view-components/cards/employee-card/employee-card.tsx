
import * as React from 'react';
import './employee-card.scss'
import '../modal-card.scss';
import {connect} from 'react-redux'
import { AbilityData, ClientAbility } from '../../../../../../../game-components/abilities-reformed/ability';
import { ManagerInfo } from '../../../../../../../game-components/manager';
import AbilityBlock from '../../partials/ability-block/ability-block';
import { InfoBoxListItem } from '../../../../../../../interfaces/game/info-box-list';
import { Modal } from '../../partials/modal/modal';
import { Employee, FrontEndState } from '../../../../../../../interfaces/front-end-state-interface';
import {frontEndService} from '../../../../../../front-end-service/front-end-service';
import { InfoBox } from '../../partials/info-box/info-box';
import { abilityService } from '../../../../../../front-end-service/ability-service-client';

export interface EmployeeCardProps{
  delayedExecutionAbilities: AbilityData[]
  employee: Employee
  managerInfo: ManagerInfo
}

const EmployeeCard = ({
  delayedExecutionAbilities, employee, managerInfo, 
}:EmployeeCardProps) => {

  const {weeksRemaining, weeklyCost} = employee.activeContract
  const employeeAbilities: ClientAbility[] = abilityService.abilities.filter(ability => !ability.disabled && employee.abilities.includes(ability.name))

  const { showAbility } = frontEndService .setClientState
  
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
              onSelected={() => showAbility({
                name: employeeAbility.name,
                source: {
                  type: employee.profession,
                  name: employee.name
                },
                target: null,

              })} 
            />
          ))}      
        </div>
        
      </div>
    </Modal>
  )
}


const mapStateToProps = ({
  serverUIState: {serverGameUIState: {
    playerManagerUIState: {
      managerInfo,
      delayedExecutionAbilities
    }
  }},
  clientUIState: {clientGameUIState: {clientManagerUIState: {activeModal}}}
}: FrontEndState): EmployeeCardProps => ({
  delayedExecutionAbilities, managerInfo, employee: activeModal.data
})

const mapDispatchToProps = dispatch => ({
  showAbility: abilityData => dispatch({type: 'showAbility', data: abilityData})
})
export default connect(mapStateToProps, mapDispatchToProps)(EmployeeCard)