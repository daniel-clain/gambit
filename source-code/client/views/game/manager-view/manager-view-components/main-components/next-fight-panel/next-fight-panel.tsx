
import * as React from 'react';
import './next-fight-panel.scss'
import BetBox from './bet-box/bet-box'
import {connect, ConnectedProps} from 'react-redux'
import { Bet } from '../../../../../../../interfaces/game/bet';
import {frontEndService} from '../../../../../../front-end-service/front-end-service';
import { FighterInfo, FrontEndState } from '../../../../../../../interfaces/front-end-state-interface';
import { hot } from 'react-hot-loader/root';
import { AbilityData } from '../../../../../../../game-components/abilities-reformed/ability';

export interface NextFightPanelProps extends PropsFromRedux{
  nextFightFighters: string[]
  fighters: FighterInfo[]
  nextFightBet: Bet
}

const mapState = (s: FrontEndState) => {
  const {nextFightFighters, managerInfo:{fighters, knownFighters, nextFightBet}} = frontEndService.toAllManagerState(s)
  return {nextFightFighters, fighters, knownFighters, nextFightBet}
}


const mapDispatch = {
  showFighter: name => ({type: 'showFighter', payload: name})
}

 const connector = connect(mapState, mapDispatch)
 type PropsFromRedux = ConnectedProps<typeof connector>

export const NextFightPanel = connector(hot(({
  fighters, 
  showFighter,
  nextFightBet, 
  nextFightFighters
}: PropsFromRedux) => {

  
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
}))
