import * as React from 'react';
import { useEffect, useState } from 'react';
import { FightReport } from '../../../../../../interfaces/front-end-state-interface';
import { fightSound } from '../../../../../sound-effects/sound-effects';
import { FightStartAnimation } from '../../fight-start-animation/fight-start-animation';

interface Props { 
  report: FightReport, 
  timeRemaining: number, 
  startCountdown: number, 
  doStartAnimation: boolean
  hasGameDisplay: boolean
  sound: boolean
  setSound: (val: boolean) => void
  isDisplay: boolean
}

export const OverlayMessaging = ({ report, timeRemaining, startCountdown, doStartAnimation, hasGameDisplay, sound, setSound, isDisplay }: Props) => {


  useEffect(() => {
    if(doStartAnimation && sound){
      fightSound.play().catch(() => null)
    }
  },[doStartAnimation])

  return <>
    {doStartAnimation &&
      <FightStartAnimation {...{ doStartAnimation }} />
    }
    {startCountdown != 0 &&
      <div className='fight-ui__count-down'>{startCountdown}</div>
    }
    {startCountdown == 0 && timeRemaining != 0 &&
      <div className='fight-ui__time-remaining'>Time Remaining: {timeRemaining}</div>
    }
    {report?.winner &&
      <div className='fight-ui__winner'>{report.winner.name} Wins!</div>
    }
    {timeRemaining == 0 && report?.draw &&
      <div className='fight-ui__winner'>Fight Was A Draw</div>
    }
    <div className="turn-phone">
      <div className="turn-phone__message">
        Turn your phone to landscape view
        </div>
      <div className="turn-phone__image"></div>
    </div>
    {hasGameDisplay && !isDisplay ?
      <div 
        className={`
          sound-icon
          sound-icon--${sound ? 'on' : 'off'}
        `}
        onClick={_ => setSound(!sound)}
      ></div>
    : ''}
  </>
}
