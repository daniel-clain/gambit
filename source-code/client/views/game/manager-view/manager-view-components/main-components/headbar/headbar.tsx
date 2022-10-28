
import * as React from 'react';
import {useEffect, useState} from 'react'
import './headbar.scss'
import Money from '../../partials/money/money';
import ActionPoints from '../../partials/action-points/action-points';
import gameConfiguration from '../../../../../../../game-settings/game-configuration';
import { websocketService } from '../../../../../../front-end-service/websocket-service';
import { frontEndState } from '../../../../../../front-end-state/front-end-state';
import { observer } from 'mobx-react';

export const Headbar = observer(() => {

  let {sendUpdate} = websocketService 
  const {
    serverUIState: {serverGameUIState: {disconnectedPlayerVotes, playerManagerUIState: {
      managerOptionsTimeLeft,
      managerInfo: {actionPoints, money, nextFightBet}, otherPlayersReady, thisManagerReady
    }}}
  } = frontEndState


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
        <div>Time left: {isNaN(timeLeft) ? '...' : timeLeft }</div>
      </div>
      {otherPlayersReady?.map(({name, ready}) => 
        <div 
          key={name}
          className={`
            player-ready
            player-ready${ready ? '--true' : '--false'}
          `}
        ></div>
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
})