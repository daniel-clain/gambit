
import * as React from 'react';
import '../employee-list.scss'
import {connect} from 'react-redux'
import { FighterInfo, FrontEndState, JobSeeker } from '../../../../../..//../interfaces/front-end-state-interface';
import {frontEndService} from '../../../../../../front-end-service/front-end-service';
import { hot } from 'react-hot-loader/root';

export interface JobSeekersPanelProps{
  jobSeekers: JobSeeker[]
}

const JobSeekersPanel = ({jobSeekers}: JobSeekersPanelProps) => {

  const {showFighter, showjobSeeker} = frontEndService .setClientState
    
  return (
    <div className='panel job-seekers'>
      <div className='heading'>Job Seekers</div>
      <div className='list employee-list'>
        {jobSeekers.map((jobSeeker, i) =>
          <div 
            className={'list__row'} 
            key={`${jobSeeker.name}${i}`} 
            onClick={() => {console.log(jobSeeker); jobSeeker.type == 'Fighter' ?
              showFighter(jobSeeker.name):
              showjobSeeker(jobSeeker)
            }}
          >
            <span className='list__row__image'></span>
            <span className='list__row__name'>
              {jobSeeker.name}
              <span className="small">
                ({jobSeeker.type == 'Fighter' ? 'Fighter' : jobSeeker.profession})
              </span>   
            </span>
          </div>
        )}
      </div>
    </div>
  )

  
};
const mapStateToProps = ({
  serverUIState:{ serverGameUIState: {playerManagerUIState: {jobSeekers}}}
}: FrontEndState): JobSeekersPanelProps => ({jobSeekers})
export default connect(mapStateToProps)(
  hot(JobSeekersPanel))
