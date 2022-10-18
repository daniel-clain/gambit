import * as React from 'react';
import './fight.view.scss'
import { OverlayMessaging } from './fight-view-components/overlay-messaging/overlay-messaging';
import { ArenaUi } from './fight-view-components/arena-ui/arena-ui';
import ManagersBets from './fight-view-components/managers-bets/managers-bets';
import { FighterStates } from './fight-view-components/fighter-states/fighter-states';
import { frontEndState } from '../../../front-end-state/front-end-state';
import { observer } from 'mobx-react';


export const Fight_View = observer(() => {
  const {
    serverUIState:{serverGameUIState:{
      fightUIState,
      displayManagerUIState
    }} 
  } = frontEndState

  const isDisplay = !!displayManagerUIState

  const {
    startCountdown, timeRemaining, fighterFightStates, 
    report, managersBets, knownFighterStates
  } = fightUIState

  const doStartAnimation = startCountdown == 0
    
  return (
    <div className={`
      fight-ui
      
      ${report?.managerWinnings?.some(m => m.winnings > 0) ? 'has-winnings' : ''}
    `}>
      <OverlayMessaging {...{report, timeRemaining, startCountdown, doStartAnimation}}/>
      <FighterStates fighterStates={knownFighterStates} />

      <ArenaUi {...{fighterFightStates}}/>
      <ManagersBets {...{report, managersBets, isDisplay}}/>

    </div>
  )
  
})

