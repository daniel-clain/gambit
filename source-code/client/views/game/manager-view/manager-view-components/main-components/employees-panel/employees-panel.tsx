
import * as React from 'react';
import '../employee-list.scss'
import {connect, ConnectedProps} from 'react-redux'
import { AllManagerUIState, Employee, FrontEndState } from '../../../../../../../interfaces/front-end-state-interface';
import {frontEndService} from '../../../../../../front-end-service/front-end-service';
import { hot } from 'react-hot-loader/root';

const mapState = (s: FrontEndState): {employees: Employee[]} => {
  const {managerInfo:{employees}} = frontEndService.toAllManagerState(s)
  return {employees}
}
  


const mapDispatch = {
  showEmployee: (e: Employee) => ({type: 'showEmployee', payload: e})
}
const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>


export const EmployeesPanel = connector(hot(
  ({employees, showEmployee}: PropsFromRedux) => {

  
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
}))
