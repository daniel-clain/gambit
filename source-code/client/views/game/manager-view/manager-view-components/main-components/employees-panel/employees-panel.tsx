
import * as React from 'react';
import '../employee-list.scss'
import './employees-panel.scss'
import {connect} from 'react-redux'
import { Employee } from '../../../../../../../interfaces/server-game-ui-state.interface';
import { FrontEndState } from '../../../../../../front-end-state/front-end-state';
import { frontEndService } from '../../../../../../front-end-service/front-end-service';

export interface EmployeesPanelProps{
  employees: Employee[]
}

const EmployeesPanel = (props: EmployeesPanelProps) => {

  const {showEmployee} = frontEndService().setClientState
  
  return (
  <div className='panel employees'>
    <div className='heading'>Employees</div>
    <div className='list employee-list'>
      {props.employees.map(employee =>
        <div 
          className={`list__row ${employee.actionPoints > 0 ? 'has-action-points' : ''}`} 
          key={employee.name} 
          onClick={() => showEmployee(employee)}
        >            
          <span className='list__row__image'></span>
          <span className='list__row__name'>{employee.name}</span>
          <span>{employee.profession}</span>
        </div>
      )}
    </div>
  </div>
  )
};

export default connect(({
  serverUIState: { serverGameUIState: {
    playerManagerUIState: {
      managerInfo: {employees}
    }
  }}}: FrontEndState): EmployeesPanelProps => {
    return {employees} 
  }
)
(EmployeesPanel);
