
import * as React from 'react';
import './headbar.scss'
import { Bet } from '../../../../../../interfaces/game/bet';
import Money from '../../partials/money/money';
import ActionPoints from '../../partials/action-points/action-points';
import ClientGameAction from '../../../../../../types/client-game-actions';
import gameConfiguration from '../../../../../../game-settings/game-configuration';

export interface HeadbarProps{
  sendGameAction( gameAction: ClientGameAction): void
  actionPoints: number
  money: number
  managerOptionsTimeLeft: number
  nextFightBet: Bet
}

export default class Headbar extends React.Component<HeadbarProps> {

  
  handleReadyToggle(e) {
    let ready: boolean = e.target.checked
    const gameAction: ClientGameAction = {
      name: 'Toggle Ready',
      data: { ready }
    }
    this.props.sendGameAction( gameAction)
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
