
import * as React from 'react';
import './next-fight-panel.scss'
import {BetBox} from './bet-box/bet-box'
import { observer } from 'mobx-react';
import { frontEndState } from '../../../../../../front-end-state/front-end-state';
import { showFighter } from '../../../../../../front-end-service/front-end-service';

export const NextFightPanel = observer(() => {

  const {
    nextFightFighters, managerInfo
  } = frontEndState.serverUIState.serverGameUIState.playerManagerUIState
  const {nextFightBet, fighters} = managerInfo
  
  return (
    <div className='next-fight'>
      <div className='next-fight__heading'>Next Fight Fighters</div>
      <div className='next-fight__fighters'>
        {nextFightFighters.map(fighterName =>
          <div 
            className={`
              next-fight__fighter 
              ${nextFightBet?.fighterName == fighterName && 'next-fight__fighter--bet-idle'}
            `} 
            key={`next-fight-fighters-${fighterName}`} 
          >
            {isYourFighter(fighterName) && 
              <span className='next-fight__fighter__yours'></span>
            }
            <span className='next-fight__fighter__image'
            onClick={() => showFighter(fighterName)}>             
              <span className='next-fight__fighter__name'>{fighterName}</span>
            </span>
            <BetBox fighterName={fighterName}  />
          </div>
        )}
      </div>
    </div>
  )

  function isYourFighter(fighterName): boolean{
    return fighters.some(fighter => fighter.name == fighterName)
  }
})
