import * as React from 'react';
import {connect} from 'react-redux'
import './fight.view.scss'
import FighterFightState, { FighterStateData, FightReport, FrontEndState, ManagersBet } from '../../../../interfaces/front-end-state-interface';
import { OverlayMessaging } from './fight-view-components/overlay-messaging/overlay-messaging';
import { ArenaUi } from './fight-view-components/arena-ui/arena-ui';
import ManagersBets from './fight-view-components/managers-bets/managers-bets';
import { hot } from 'react-hot-loader/root';
import { useEffect, useState } from 'react';
import { FighterStates } from './fight-view-components/fighter-states/fighter-states';


interface FightUiProps{
  startCountdown: number
  timeRemaining: number 
  fighterFightStates: FighterFightState[]
  knownFighterStates: FighterStateData[]
  report: FightReport
  managersBets: ManagersBet[]
}

const Fight_View = ({
    startCountdown, timeRemaining, fighterFightStates, 
    report, managersBets, knownFighterStates
  }:FightUiProps) => {

    const [doStartAnimation, setDoStartAnimation] = useState(startCountdown == 0)

    useEffect(() => {
      if(startCountdown == 0){
        setDoStartAnimation(true)
      } else {
        setDoStartAnimation(false)
      }
    }, [startCountdown])
    
  return (
    <div className={`
      fight-ui
      
      ${report?.managerWinnings?.some(m => m.winnings > 0) ? 'has-winnings' : ''}
    `}>
      <OverlayMessaging {...{report, timeRemaining, startCountdown, doStartAnimation}}/>
      <FighterStates fighterStates={knownFighterStates} />

      <ArenaUi {...{fighterFightStates}}/>
      <ManagersBets {...{report, managersBets}}/>

    </div>
  )
  
}
const mapStateToProps = (frontEndState: FrontEndState): FightUiProps | {} => {
  const fightUIState = frontEndState?.serverUIState?.serverGameUIState?.fightUIState

  if(fightUIState){
    const {startCountdown, timeRemaining, fighterFightStates, report, managersBets, knownFighterStates} = fightUIState
    return {startCountdown, timeRemaining, fighterFightStates, report, managersBets, knownFighterStates}
  }
  return {}
}

export default connect(mapStateToProps)(hot(Fight_View))