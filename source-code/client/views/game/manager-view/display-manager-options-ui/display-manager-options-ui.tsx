
import { observer } from 'mobx-react';
import * as React from 'react';
import { ManagerDisplayInfo } from "../../../../../interfaces/front-end-state-interface"
import { frontEndState } from '../../../../front-end-state/front-end-state';
import './display-manager-options-ui.scss'

export const DisplayManagerOptionsUi = observer(() => {

  const {
    serverUIState: { serverGameUIState: { weekStage, displayManagerUIState: {
        timeLeft, nextFightFighters, jobSeekers, managersDisplayInfo
      }
    }}
  } = frontEndState
  return (
    <div className='game-display-manager-options'>
      <div className="game-display-manager-options__background"></div>
      <div className="time-left">Time Left: {timeLeft}</div>

      <div className="heading">Managers</div>
      <div className="managers-ready game-display-manager-options__group">
        {managersDisplayInfo.map((managerDisplayInfo: ManagerDisplayInfo) => 
          <div key={managerDisplayInfo.name} className={`manager-ready ${managerDisplayInfo.ready ? 'manager-ready--ready' : ''}`}>
            <div className={`manager-ready__image manager-ready__image--${managerDisplayInfo.image.split(' ').join('-').toLowerCase()}`}></div>
            <div className="manager-ready__name">{managerDisplayInfo.name}</div>
          </div>
        )}
      </div>
      <div className="heading">Next Fight Fighters</div>
      <div className="next-fight-fighters game-display-manager-options__group">
        {nextFightFighters.map(nextFightFighter => 
          <div key={nextFightFighter} className='next-fight-fighter'>
            <div className="next-fight-fighter__image"></div>
            <div className="next-fight-fighter__name">{nextFightFighter}</div>
          </div>
        )}
      </div>
      <div className="heading">Job Seekers</div>
      <div className="job-seekers game-display-manager-options__group">
        {jobSeekers.map(jobSeeker => 
          <div key={jobSeeker.name} className='job-seeker'>
            <div className="job-seeker__name">{jobSeeker.name}:</div>
            <div className="job-seeker__profession">{jobSeeker.type == 'Fighter' ? 'Fighter' : jobSeeker.profession}</div>
          </div>
        )}
      </div>
    </div>
  )
})