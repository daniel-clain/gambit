
import * as React from 'react';
import '../../styles/global.scss'
import Fight from '../../../game-components/fight/fight';
import { fightUiService } from './fight-ui-service';
import { useState } from 'react';
import { ConfigureTestFighters } from './configure-test-fighters';
import { Fight_View } from '../../views/game/fight-view/fight.view';
import { frontEndState } from '../../front-end-state/front-end-state';


export const FighterTest_C = () => {

  const [paused, setPaused] = useState(false)
  const [fight, setFight] = useState<Fight>()
  const [fightersList, setFightersList] = useState([])


  paused ? fight?.pause() : fight?.unpause()

  const fightState = frontEndState.serverUIState.serverGameUIState?.fightUIState

  const startNewFight = () => {
    //promTest()
    fightUiService.newFight(fightersList)
    setFight(fightUiService.fight)
  }  
  return <>
    <ConfigureTestFighters onFightersUpdated={x => {
      setFightersList(x)
    }}/>
    <button
      style={{position: 'absolute', left: '60px', zIndex: 3}} 
      onClick={() => setPaused(!paused)}
    >
      {paused ? 'Un-Pause' : 'Pause'}
    </button>
    <button
      style={{position: 'absolute', left: '150px', zIndex: 3}} 
      onClick={startNewFight}
    >
      Start New Fight
    </button>
    {fightState &&
      <Fight_View/>
    }
  </>
}
