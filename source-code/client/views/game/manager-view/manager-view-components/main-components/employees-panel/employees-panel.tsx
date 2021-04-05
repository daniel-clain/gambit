
import * as React from 'react';
import '../employee-list.scss'
import './employees-panel.scss'
import {connect} from 'react-redux'
import { Employee, FrontEndState } from '../../../../../../../interfaces/front-end-state-interface';
import {frontEndService} from '../../../../../../front-end-service/front-end-service';

export interface EmployeesPanelProps{
  employees: Employee[]
}

const EmployeesPanel = (props: EmployeesPanelProps) => {

  const {showEmployee} = frontEndService .setClientState
  
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
          <span className='list__row__name'>
            {employee.name}
              <span className="small">
                ({employee.profession})
              </span>
            </span>
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
