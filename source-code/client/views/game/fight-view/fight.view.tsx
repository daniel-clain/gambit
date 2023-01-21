import * as React from 'react';
import './fight.view.scss'
import { OverlayMessaging } from './fight-view-components/overlay-messaging/overlay-messaging';
import { ArenaUi } from './fight-view-components/arena-ui/arena-ui';
import {ManagersBets_C} from './fight-view-components/managers-bets/managers-bets';
import { FighterStates } from './fight-view-components/fighter-states/fighter-states';
import { frontEndState } from '../../../front-end-state/front-end-state';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';


export const Fight_View = observer(() => {

  const {
    serverUIState:{serverGameUIState},
    clientUIState: {clientPreGameUIState: {clientName}}
    
  } = frontEndState

  const {fightUIState, hasGameDisplay} = serverGameUIState!
  

  const isDisplay = clientName == 'Game Display'
  
  const [sound, setSound] = useState(true)

  useEffect(() => {
    if(hasGameDisplay){
      if(!isDisplay){
        setSound(false)
      }
    }
  },[])

  const {
    startCountdown, timeRemaining, fighterFightStates, 
    report, managersBets, knownFighterStateData
  } = fightUIState

  const doStartAnimation = startCountdown == 0
    
  return (
    <div className={`
      fight-ui
      
      ${report?.managerWinnings?.some(m => m.winnings > 0) ? 'has-winnings' : ''}
    `}>
      <OverlayMessaging {...{report, timeRemaining, startCountdown, doStartAnimation, hasGameDisplay, sound, setSound, isDisplay}}/>
      <FighterStates fighterStates={knownFighterStateData!} />

      <ArenaUi {...{fighterFightStates}} sound={sound}/>
      <ManagersBets_C {...{report, managersBets, isDisplay}}/>

    </div>
  )
  
})

