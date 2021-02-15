import * as React from 'react';
import './bet-box.scss'
import {connect} from 'react-redux'
import gameConfiguration from '../../../../../../../../game-settings/game-configuration';
import { Bet } from '../../../../../../../../interfaces/game/bet';
import ClientGameAction from '../../../../../../../../types/client-game-actions';
import { frontEndService } from '../../../../../../../front-end-service/front-end-service';
import { FrontEndState } from '../../../../../../../front-end-state/front-end-state';

export interface BetBoxProps{
  fighterName: string
  money: number
  nextFightBet: Bet
}

const BetBox = ({
  fighterName,
  money, 
  nextFightBet
}: BetBoxProps) => {

  const {sendUpdate} = frontEndService()

  const {betSizePercentages} = gameConfiguration
  const smallAmount = Math.round(betSizePercentages.small/100 * money)
  const mediumAmount = Math.round(betSizePercentages.medium/100 * money)
  const largeAmount = Math.round(betSizePercentages.large/100 * money)

  return (
    <div className="bet-box">
      <div 
        className={`bet-box__heading ${nextFightBet && nextFightBet.fighterName == fighterName ? 'bet-box__heading--selected' : ''}`}
        onClick={() => sendUpdate.betOnFighter(null)}
      >Place Bet</div>
      <div className="bet-options">
        <div 
          onClick={() => placeBet({size: 'small', fighterName})}
          className={`bet-option ${nextFightBet && nextFightBet.fighterName == fighterName && nextFightBet.size == 'small' ? 'bet-option--selected' : ''}`}>
          <span className='bet-option__size'>Small</span>
          <span className="bet-option__amount">{smallAmount}</span>
        </div>
        <div 
          onClick={() => placeBet({size: 'medium', fighterName})}
          className={`bet-option ${nextFightBet && nextFightBet.fighterName == fighterName && nextFightBet.size == 'medium' ? 'bet-option--selected' : ''}`}>
          <span className='bet-option__size'>Medium</span>
          <span className="bet-option__amount">{mediumAmount}</span>
        </div>
        <div
          onClick={() => placeBet({size: 'large', fighterName})}
          className={`bet-option 
            ${nextFightBet && nextFightBet.fighterName == fighterName && nextFightBet.size == 'large' ? 'bet-option--selected' : ''
          }`}
        >
          <span className='bet-option__size'>Large</span>
          <span className="bet-option__amount">{largeAmount}</span>
        </div>          
      </div>
    </div>
  )
    
  
  function placeBet(bet: Bet) {
    if(nextFightBet == bet)
      sendUpdate.betOnFighter(null)
    else {
      console.log(`you have placed a ${bet.size} bet on ${bet.fighterName}`);
      sendUpdate.betOnFighter(bet)
    }
  }  
};


function mapStateToProps({
  serverUIState: { serverGameUIState: {playerManagerUIState: {
    managerInfo: {money, nextFightBet}
  }}}
}: FrontEndState) {
  return {
    money,
    nextFightBet
  }
}

export default connect(mapStateToProps)(BetBox)

