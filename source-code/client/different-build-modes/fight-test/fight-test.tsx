
import * as React from 'react';
import '../../styles/global.scss'
import Fight from '../../../game-components/fight/fight';
import { fightUiService } from './fight-ui-service';
import { useEffect, useState } from 'react';
import Fight_View from '../../views/game/fight-view/fight.view';




export const FighterTest = () => {

  const [paused, setPaused] = useState(false)
  const [fight, setFight] = useState<Fight>(undefined)

  paused ? fight?.pause() : fight?.unpause()

  useEffect(()=> {
    startNewFight()
  },[])

  const startNewFight = () => {
    fightUiService.newFight()
    setFight(fightUiService.fight)
  }  
  return <>
    <button
      style={{position: 'absolute', left: '60px', zIndex: 1}} 
      onClick={() => setPaused(!paused)}
    >
      {paused ? 'Un-Pause' : 'Pause'}
    </button>
    <button
      style={{position: 'absolute', left: '150px', zIndex: 1}} 
      onClick={startNewFight}
    >
      Start New Fight
    </button>
    {fight &&
      <Fight_View/>
    }
  </>
}
