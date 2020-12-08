
import * as React from 'react';
import './next-fight-panel.scss'
import BetBox from '../bet-box/bet-box'
import {connect} from 'react-redux'
import { Bet } from '../../../../../../../interfaces/game/bet';
import { FighterInfo } from '../../../../../../../interfaces/server-game-ui-state.interface';
import { frontEndService } from '../../../../../../front-end-service/front-end-service';
import { FrontEndState } from '../../../../../../front-end-state/front-end-state';

export interface NextFightPanelProps{
  nextFightFighters: FighterInfo[]
  yourFighters: FighterInfo[]
  nextFightBet: Bet
}

const NextFightPanel = ({
  yourFighters, 
  nextFightBet, 
  nextFightFighters
}: NextFightPanelProps) => {

  const {fighterSelected} = frontEndService
  
  return (
    <div className='next-fight'>
      <div className='next-fight__heading'>Next Fight Fighters</div>
      <div className='next-fight__fighters'>
        {nextFightFighters.map(fighter =>
          <div 
            className={`
              next-fight__fighter 
              ${!!nextFightBet && nextFightBet.fighterName == fighter.name && 'next-fight__fighter--bet-idle'}
            `} 
            key={`next-fight-fighters-${fighter.name}`} 
          >
            {isYourFighter(fighter) && 
              <span className='next-fight__fighter__yours'></span>
            }
            <span className='next-fight__fighter__image'
            onClick={() => fighterSelected(fighter)}>             
              <span className='next-fight__fighter__name'>{fighter.name}</span>
            </span>
            <BetBox
              fighterName={fighter.name}
            />
          </div>
        )}
      </div>
    </div>
  )

  function isYourFighter(fighterName): boolean{
    return yourFighters.some(fighter => fighter.name == fighterName)
  }
}

export default connect(
  ({
    serverGameUIState: {playerManagerUiData: {
      nextFightFighters,
      managerInfo: {yourFighters, nextFightBet}
    }}
  }: FrontEndState)
  : NextFightPanelProps => {
    return {
      yourFighters, 
      nextFightBet, 
      nextFightFighters
    } 
  }
)
(NextFightPanel);
