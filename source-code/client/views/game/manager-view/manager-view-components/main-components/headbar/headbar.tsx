
import * as React from 'react';
import {useEffect, useState} from 'react'
import './headbar.scss'
import Money from '../../partials/money/money';
import ActionPoints from '../../partials/action-points/action-points';
import {connect} from 'react-redux'
import gameConfiguration from '../../../../../../../game-settings/game-configuration';
import { Bet } from '../../../../../../../interfaces/game/bet';
import { FrontEndState } from '../../../../../../../interfaces/front-end-state-interface';
import {frontEndService} from '../../../../../../front-end-service/front-end-service';
import { Socket } from 'socket.io-client';

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

  let {sendUpdate} = frontEndService 

  let [timeLeft, setTimeLeft] = useState(managerOptionsTimeLeft)
  let timeLeftTimeout

  useEffect(() => {
    if(timeLeftTimeout) clearTimeout(timeLeftTimeout)
    timeLeftTimeout = setTimeout(() => {
      setTimeLeft(--timeLeft)
    }, 1000);

    return () => clearTimeout(timeLeftTimeout)

  })


  
  

  return (
    <div className='headbar' >
      <div className='headbar__left'>
        <div>Time left: {timeLeft}</div>
      </div>
      <div className='headbar__right'>


        <span className='finished-turn'>Finished Turn?
          <input 
            type='checkbox' 
            onChange={sendUpdate.toggleReady} 
          />          
        </span>

        
        <Money money={nextFightBet ? money - Math.round(gameConfiguration.betSizePercentages[nextFightBet.size]/100* money) : money} />
        <ActionPoints {...{actionPoints}} />
      </div>
    </div>
  )
}

const mapStateToProps = ({
  serverUIState: {serverGameUIState: {playerManagerUIState: {
    managerOptionsTimeLeft,
    managerInfo: {actionPoints, money, nextFightBet}
  }}}
}: FrontEndState) : HeadbarProps => {
  return {
    managerOptionsTimeLeft,
    money,
    nextFightBet,
    actionPoints
  } 
}



export default connect(mapStateToProps)(Headbar);

