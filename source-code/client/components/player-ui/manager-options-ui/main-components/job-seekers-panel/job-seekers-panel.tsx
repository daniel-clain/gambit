
import * as React from 'react';
import '../employee-list.scss'
import { JobSeeker } from '../../../../../../interfaces/game-ui-state.interface';

export interface JobSeekersPanelProps{
  jobSeekers: JobSeeker[]
  jobSeekerSelected(jobSeeker: JobSeeker): void
  fighterSelected(fighterName: string): void
}

export default class JobSeekersPanel extends React.Component<JobSeekersPanelProps> {
    
  render(){
    const {jobSeekers, jobSeekerSelected, fighterSelected} = this.props
    return (
    <div className='group-panel job-seekers'>
      <div className='heading'>Job Seekers</div>
      <div className='list employee-list'>
        {jobSeekers.map(jobSeeker =>
          <div 
            className={'list__row'} 
            key={jobSeeker.name} 
            onClick={() => jobSeeker.type == 'Fighter' ?
            fighterSelected(jobSeeker.name) :
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
  }
};
