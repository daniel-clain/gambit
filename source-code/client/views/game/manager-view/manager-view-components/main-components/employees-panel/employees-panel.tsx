
import * as React from 'react';
import '../employee-list.scss'
import './employees-panel.scss'
import {showEmployee} from '../../../../../../front-end-service/front-end-service';
import { observer } from 'mobx-react';
import { frontEndState } from '../../../../../../front-end-state/front-end-state';

export const EmployeesPanel = observer(() => {

  const {serverUIState: {serverGameUIState}} = frontEndState
  const {employees} = serverGameUIState!.playerManagerUIState!.managerInfo

  return (
  <div className='panel employees'>
    <div className='heading'>Employees</div>
    <div className='list employee-list'>
      {employees.map(employee =>
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
})
