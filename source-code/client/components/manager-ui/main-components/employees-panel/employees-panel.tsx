
import * as React from 'react';
import './../employee-list.scss'
import './employees-panel.scss'
import { Employee } from '../../../../../interfaces/game-ui-state.interface';

export interface EmployeesPanelProps{
  employees: Employee[]
  employeeSelected(employee: Employee): void
}

export default class EmployeesPanel extends React.Component<EmployeesPanelProps> {
    
  render(){
    const {employees, employeeSelected} = this.props
    return (
    <div className='group-panel employees'>
      <div className='heading'>Employees</div>
      <div className='list employee-list'>
        {employees.map(employee =>
          <div 
            className={`list__row ${employee.actionPoints > 0 ? 'has-action-points' : ''}`} 
            key={employee.name} 
            onClick={() => employeeSelected(employee)}
          >            
            <span className='list__row__image'></span>
            <span className='list__row__name'>{employee.name}</span>
            <span>{employee.profession}</span>
          </div>
        )}
      </div>
    </div>
    )
  }
};
