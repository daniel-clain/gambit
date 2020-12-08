
import * as React from 'react';
import { JobSeeker } from '../../../../../../../interfaces/server-game-ui-state.interface';
import '../employee-list.scss'
import {connect} from 'react-redux'
import { FrontEndState } from '../../../../../../front-end-state/front-end-state';
import { frontEndService } from '../../../../../../front-end-service/front-end-service';

export interface JobSeekersPanelProps{
  jobSeekers: JobSeeker[]
}

const JobSeekersPanel = ({jobSeekers}: JobSeekersPanelProps) => {

  let {fighterSelected, jobSeekerSelected, getKnownFighter} = frontEndService
    
  return (
    <div className='group-panel job-seekers'>
      <div className='heading'>Job Seekers</div>
      <div className='list employee-list'>
        {jobSeekers.map((jobSeeker, i) =>
          <div 
            className={'list__row'} 
            key={`${jobSeeker.name}${i}`} 
            onClick={() => jobSeeker.type == 'Fighter' ?
            fighterSelected(getKnownFighter(jobSeeker.name)) :
            jobSeekerSelected(jobSeeker)
          }
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
  serverGameUIState: {playerManagerUiData: {jobSeekers}}
}: FrontEndState): JobSeekersPanelProps => ({jobSeekers})
export default connect(mapStateToProps)(JobSeekersPanel)
