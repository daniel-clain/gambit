import * as React from 'react';
import { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { FightReport } from '../../../../../../interfaces/front-end-state-interface';
import { fightSound } from '../../../../../sound-effects/sound-effects';
import { FightStartAnimation } from '../../fight-start-animation/fight-start-animation';

interface Props { report: FightReport, timeRemaining: number, startCountdown: number, doStartAnimation: boolean }

export const OverlayMessaging = hot(({ report, timeRemaining, startCountdown, doStartAnimation }: Props) => {


  useEffect(() => {
    if(doStartAnimation){
      console.log('fightSound');
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
  </>
});
