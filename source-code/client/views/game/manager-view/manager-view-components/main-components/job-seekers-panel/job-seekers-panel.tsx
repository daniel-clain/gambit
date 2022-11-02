
import * as React from 'react';
import '../employee-list.scss'
import {showFighter, showJobSeeker} from '../../../../../../front-end-service/front-end-service';
import { frontEndState } from '../../../../../../front-end-state/front-end-state';
import { observer } from 'mobx-react';

export const JobSeekersPanel = observer(() => {

  const {serverUIState: {serverGameUIState}} = frontEndState
  const {jobSeekers} = serverGameUIState!.playerManagerUIState!
    
  return (
    <div className='panel job-seekers'>
      <div className='heading'>Job Seekers</div>
      <div className='list employee-list'>
        {jobSeekers.map((jobSeeker, i) =>
          <div 
            className={'list__row'} 
            key={`${jobSeeker.name}${i}`} 
            onClick={() => {jobSeeker.type == 'Fighter' ?
              showFighter(jobSeeker.name):
              showJobSeeker(jobSeeker)
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

  
})
