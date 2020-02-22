
import * as React from 'react';
import './next-fight-panel.scss'
import { ManagerInfo } from '../../../../../../game-components/manager';
import PlayerAction from '../../../../../../interfaces/player-action';
import BetBox from '../bet-box/bet-box';

export interface NextFightPanelProps{
  nextFightFighters: string[]
  managerInfo: ManagerInfo
  fighterSelected(fighterName: string): void
  sendPlayerAction(playerAction: PlayerAction): void
}

export default class NextFightPanel extends React.Component<NextFightPanelProps> {
  
  
  
  render(){
    const {fighters, nextFightBet} = this.props.managerInfo

    function isYourFighter(fighterName): boolean{
      return fighters.some(fighter => fighter.name == fighterName)
    }
    return (
    <div className='next-fight'>
      <div className='next-fight__heading'>Next Fight Fighters</div>
      <div className='next-fight__fighters'>
        {this.props.nextFightFighters.map(fighter =>
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
            onClick={() => this.props.fighterSelected(fighter)}>             
              <span className='next-fight__fighter__name'>{fighter}</span>
            </span>
            <BetBox 
              fighterName={fighter}
              managerInfo={this.props.managerInfo}
              sendPlayerAction={this.props.sendPlayerAction}
            />
          </div>
        )}
      </div>
    </div>
    )
  }
};
