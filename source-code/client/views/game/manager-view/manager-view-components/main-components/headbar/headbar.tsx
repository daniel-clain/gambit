
import * as React from 'react';
import {useEffect, useState} from 'react'
import './headbar.scss'
import Money from '../../partials/money/money';
import ActionPoints from '../../partials/action-points/action-points';
import {connect} from 'react-redux'
import gameConfiguration from '../../../../../../../game-settings/game-configuration';
import { Bet } from '../../../../../../../interfaces/game/bet';
import { DisconnectedPlayerVote, FrontEndState } from '../../../../../../../interfaces/front-end-state-interface';
import {frontEndService} from '../../../../../../front-end-service/front-end-service';
import { Socket } from 'socket.io-client';

export interface HeadbarProps{
  actionPoints: number
  money: number
  managerOptionsTimeLeft: number
  nextFightBet: Bet
  disconnectedPlayerVotes: DisconnectedPlayerVote[] 
  otherPlayersReady
  thisManagerReady
}

const Headbar = ({
  actionPoints,
  money,
  managerOptionsTimeLeft,
  nextFightBet,
  disconnectedPlayerVotes,
  otherPlayersReady,
  thisManagerReady
}: HeadbarProps) => {

  let {sendUpdate} = frontEndService 

  let [timeLeft, setTimeLeft] = useState(managerOptionsTimeLeft)
  let timeLeftTimeout

  useEffect(() => {
    const playersDisconnected = disconnectedPlayerVotes?.length
    timeLeftTimeout = setTimeout(() => {
      if(timeLeft && !playersDisconnected){
        setTimeLeft(--timeLeft)
      }
    }, 1000);

    return () => {    
      clearTimeout(timeLeftTimeout)
    }

  }, [timeLeft])

  useEffect(() => {
    setTimeLeft(managerOptionsTimeLeft)
  }, [managerOptionsTimeLeft, disconnectedPlayerVotes])


  
  

  return (
    <div className='headbar' >
      <div className='headbar__left'>
        <div>Time left: {timeLeft}</div>
      </div>
      {otherPlayersReady?.map(ready => 
        <div className={`
          player-ready
          player-ready${ready ? '--true' : '--false'}
        `}></div>
      )}
      <div className='headbar__right'>


        <span className='finished-turn'>Finished Turn?
          <input 
            type='checkbox' 
            onChange={sendUpdate.toggleReady} 
            defaultChecked={thisManagerReady}
          />          
        </span>

        
        <Money money={nextFightBet ? money - Math.round(gameConfiguration.betSizePercentages[nextFightBet.size]/100* money) : money} />
        <ActionPoints {...{actionPoints}} />
      </div>
    </div>
  )
}

const mapStateToProps = ({
  serverUIState: {serverGameUIState: {disconnectedPlayerVotes, playerManagerUIState: {
    managerOptionsTimeLeft,
    managerInfo: {actionPoints, money, nextFightBet}, otherPlayersReady, thisManagerReady
  }}}
}: FrontEndState) : HeadbarProps => {
  return {
    disconnectedPlayerVotes,
    managerOptionsTimeLeft,
    money,
    nextFightBet,
    actionPoints, 
    otherPlayersReady,
    thisManagerReady
  } 
}



export default connect(mapStateToProps)(Headbar);

