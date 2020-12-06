
import * as React from 'react';
import './headbar.scss'
import Money from '../../partials/money/money';
import ActionPoints from '../../partials/action-points/action-points';
import {connect} from 'react-redux'
import gameConfiguration from '../../../../../../../game-settings/game-configuration';
import { Bet } from '../../../../../../../interfaces/game/bet';
import ClientGameAction from '../../../../../../../types/client-game-actions';
import { FrontEndState } from '../../../../../../front-end-state/front-end-state';

export interface HeadbarProps{
  actionPoints: number
  money: number
  managerOptionsTimeLeft: number
  nextFightBet: Bet
}

const Headbar = ({
  actionPoints,
  money,
  managerOptionsTimeLeft,
  nextFightBet
}: HeadbarProps) => {

  return (
    <div className='headbar' >
      <div className='headbar__left'>
        <div>Time left: {managerOptionsTimeLeft}</div>
      </div>
      <div className='headbar__right'>
        <span className='finished-turn'>Finished Turn? 
          <input type='checkbox' onChange={handleReadyToggle.bind(this)} />
        </span>
        <Money money={nextFightBet ? money - Math.round(gameConfiguration.betSizePercentages[nextFightBet.size]/100* money) : money} />
        <ActionPoints {...{actionPoints}} />
      </div>
    </div>
  )
  
  function handleReadyToggle(e) {
    let ready: boolean = e.target.checked
    const gameAction: ClientGameAction = {
      name: 'Toggle Ready',
      data: { ready }
    }
    this.props.sendGameAction( gameAction)
  }
}


export default connect(
  ({
    serverGameUIState: {playerManagerUiData: {
      managerOptionsTimeLeft,
      managerInfo: {actionPoints, money, nextFightBet}
    }}
  }: FrontEndState)
  : HeadbarProps => {
    return {
      managerOptionsTimeLeft,
      money,
      nextFightBet,
      actionPoints
    } 
  }
)
(Headbar);

