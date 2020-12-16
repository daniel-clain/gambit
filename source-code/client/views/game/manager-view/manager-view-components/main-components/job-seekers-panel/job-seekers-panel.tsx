
import * as React from 'react';
import { FighterInfo, JobSeeker } from '../../../../../../../interfaces/server-game-ui-state.interface';
import '../employee-list.scss'
import {connect, useDispatch} from 'react-redux'
import { FrontEndState } from '../../../../../../front-end-state/front-end-state';
import { frontEndService } from '../../../../../../front-end-service/front-end-service';
import { Dispatch } from 'redux';
import { ClientManagerUIAction } from '../../../../../../front-end-state/reducers/manager-ui.reducer';

export interface JobSeekersPanelProps{
  jobSeekers: JobSeeker[]
  knownFighters: FighterInfo[]
}

const JobSeekersPanel = ({jobSeekers, knownFighters}: JobSeekersPanelProps) => {

  const dispatch: Dispatch<ClientManagerUIAction> = useDispatch()
    
  return (
    <div className='panel job-seekers'>
      <div className='heading'>Job Seekers</div>
      <div className='list employee-list'>
        {jobSeekers.map((jobSeeker, i) =>
          <div 
            className={'list__row'} 
            key={`${jobSeeker.name}${i}`} 
            onClick={() => {console.log(jobSeeker); jobSeeker.type == 'Fighter' ?
              dispatch({
                type: 'Fighter Selected', 
                payload: knownFighters.find(f => f.name == jobSeeker.name)
              }) :
              dispatch({type: 'Jobseeker Selected', payload: jobSeeker})
            }}
          >
            <span className='list__row__image'></span>
            <span className='list__row__name'>{jobSeeker.name}</span>
            <span>{
              jobSeeker.type == 'Fighter' ?
              'Fighter' : jobSeeker.profession
            }</span>
          </div>
        )}
      </div>
    </div>
  )

  
};
const mapStateToProps = ({
  serverUIState:{ serverGameUIState: {playerManagerUiData: {jobSeekers, managerInfo: {knownFighters}}}}
}: FrontEndState): JobSeekersPanelProps => ({jobSeekers, knownFighters})
export default connect(mapStateToProps)(JobSeekersPanel)
