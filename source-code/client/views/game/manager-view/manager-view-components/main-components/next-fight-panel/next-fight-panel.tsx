
import * as React from 'react';
import './next-fight-panel.scss'
import BetBox from './bet-box/bet-box'
import {connect} from 'react-redux'
import { Bet } from '../../../../../../../interfaces/game/bet';
import {frontEndService} from '../../../../../../front-end-service/front-end-service';
import { FighterInfo, FrontEndState } from '../../../../../../../interfaces/front-end-state-interface';
import { hot } from 'react-hot-loader/root';

export interface NextFightPanelProps{
  nextFightFighters: string[]
  fighters: FighterInfo[]
  knownFighters: FighterInfo[]
  nextFightBet: Bet
}

const NextFightPanel = ({
  fighters, 
  knownFighters,
  nextFightBet, 
  nextFightFighters
}: NextFightPanelProps) => {

  const {showFighter} = frontEndService .setClientState
  
  return (
    <div className='next-fight'>
      <div className='next-fight__heading'>Next Fight Fighters</div>
      <div className='next-fight__fighters'>
        {nextFightFighters.map(fighter =>
          <div 
            className={`
              next-fight__fighter 
              ${!!nextFightBet && nextFightBet.fighterName == fighter && 'next-fight__fighter--bet-idle'}
            `} 
            key={`next-fight-fighters-${fighter}`} 
          >
            {isYourFighter(fighter) && 
              <span className='next-fight__fighter__yours'></span>
            }
            <span className='next-fight__fighter__image'
            onClick={() => showFighter(fighter)}>             
              <span className='next-fight__fighter__name'>{fighter}</span>
            </span>
            <BetBox
              fighterName={fighter}
            />
          </div>
        )}
      </div>
    </div>
  )

  function isYourFighter(fighterName): boolean{
    return fighters.some(fighter => fighter.name == fighterName)
  }
}

export default connect(
  ({
    serverUIState: {serverGameUIState: {playerManagerUIState: {
      nextFightFighters,
      managerInfo: {fighters, nextFightBet, knownFighters}
    }}}
  }: FrontEndState)
  : NextFightPanelProps => {
    return {
      fighters,
      knownFighters, 
      nextFightBet, 
      nextFightFighters
    } 
  }
)
(hot(NextFightPanel));
