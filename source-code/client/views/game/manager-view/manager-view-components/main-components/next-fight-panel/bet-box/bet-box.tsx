import * as React from 'react';
import './bet-box.scss'
import {connect} from 'react-redux'
import gameConfiguration from '../../../../../../../../game-settings/game-configuration';
import { Bet } from '../../../../../../../../interfaces/game/bet';
import {frontEndService} from '../../../../../../../front-end-service/front-end-service';
import { FrontEndState } from '../../../../../../../../interfaces/front-end-state-interface';

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

  const {sendUpdate} = frontEndService 

  const getBetAmount = percent => money <= 0 ? 0 : 
    Math.round(percent/100 * money)

  const {betSizePercentages} = gameConfiguration
  const smallAmount = getBetAmount(betSizePercentages.small)
  const mediumAmount = getBetAmount(betSizePercentages.medium)
  const largeAmount = getBetAmount(betSizePercentages.large)

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
    if(money <= 0) return
    if(JSON.stringify(nextFightBet) === JSON.stringify(bet))
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

