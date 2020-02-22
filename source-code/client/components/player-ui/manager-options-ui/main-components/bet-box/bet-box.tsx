import * as React from 'react';
import './bet-box.scss'
import { ManagerInfo } from '../../../../../../game-components/manager';
import PlayerAction from '../../../../../../interfaces/player-action';
import { Bet } from '../../../../../../interfaces/game/bet';
import gameConfiguration from '../../../../../../game-components/game-configuration';

export interface BetBoxProps{
  fighterName: string
  managerInfo: ManagerInfo
  sendPlayerAction(playerAction: PlayerAction)
}
export default class BetBox extends React.Component<BetBoxProps> {

  
  placeBet(bet: Bet) {
    const {nextFightBet} = this.props.managerInfo
    if(
      nextFightBet &&
      bet.fighterName == nextFightBet.fighterName &&
      bet.size == nextFightBet.size
    )
      this.cancelBet()
    else {
      console.log(`you have placed a ${bet.size} bet on ${bet.fighterName}`);

      
      const playerAction: PlayerAction = {
        name: 'Bet On Fighter',
        args: bet
      }
      this.props.sendPlayerAction(playerAction)
    }
  }
  
  cancelBet(){    
    
    const playerAction: PlayerAction = {
      name: 'Bet On Fighter',
      args: null
    }
    this.props.sendPlayerAction(playerAction)
  }

  render(){
    const {fighterName} = this.props
    const {money, nextFightBet} = this.props.managerInfo
    const {betSizePercentages} = gameConfiguration

    const smallAmount = Math.round(betSizePercentages.small/100 * money)
    const mediumAmount = Math.round(betSizePercentages.medium/100 * money)
    const largeAmount = Math.round(betSizePercentages.large/100 * money)
    return (
      <div className="bet-box">
        <div 
          className={`bet-box__heading ${nextFightBet && nextFightBet.fighterName == fighterName ? 'bet-box__heading--selected' : ''}`}
          onClick={this.cancelBet.bind(this)}
        >Place Bet</div>
        <div className="bet-options">
          <div 
            onClick={() => this.placeBet({size: 'small', fighterName})}className={`bet-option ${nextFightBet && nextFightBet.fighterName == fighterName && nextFightBet.size == 'small' ? 'bet-option--selected' : ''}`}>
            <span className='bet-option__size'>Small</span>
            <span className="bet-option__amount">{smallAmount}</span>
          </div>
          <div 
            onClick={() => this.placeBet({size: 'medium', fighterName})}className={`bet-option ${nextFightBet && nextFightBet.fighterName == fighterName && nextFightBet.size == 'medium' ? 'bet-option--selected' : ''}`}>
            <span className='bet-option__size'>Medium</span>
            <span className="bet-option__amount">{mediumAmount}</span>
          </div>
          <div
            onClick={() => this.placeBet({size: 'large', fighterName})}
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
  }
};
