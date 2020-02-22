
import * as React from 'react';
import './headbar.scss'
import PlayerAction from '../../../../../../interfaces/player-action';
import { Bet } from '../../../../../../interfaces/game/bet';
import gameConfiguration from '../../../../../../game-components/game-configuration';
import Money from '../../partials/money/money';
import ActionPoints from '../../partials/action-points/action-points';

export interface HeadbarProps{
  sendPlayerAction(playerAction: PlayerAction): void
  actionPoints: number
  money: number
  managerOptionsTimeLeft: number
  nextFightBet: Bet
}

export default class Headbar extends React.Component<HeadbarProps> {

  
  handleReadyToggle(e) {
    let ready: boolean = e.target.checked
    const playerAction: PlayerAction = {
      name: 'Toggle Ready',
      args: { ready }
    }
    this.props.sendPlayerAction(playerAction)
  }

  render(){
    const {managerOptionsTimeLeft, money, actionPoints, nextFightBet} = this.props
    return (
      <div className='headbar' >
        <div className='headbar__left'>
          <div>Time left: {managerOptionsTimeLeft}</div>
        </div>
        <div className='headbar__right'>
          <span className='finished-turn'>Finished Turn? 
            <input type='checkbox' onChange={this.handleReadyToggle.bind(this)} />
          </span>
          <Money money={nextFightBet ? money - Math.round(gameConfiguration.betSizePercentages[nextFightBet.size]/100* money) : money} />
          <ActionPoints {...{actionPoints}} />
        </div>
      </div>
    )
  }
};
