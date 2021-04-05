
import * as React from 'react';
import '../../styles/global.scss'
import Fight from '../../../game-components/fight/fight';
import Fight_View from '../../views/game/fight-view/fight.view';
import { fightUiService } from './fight-ui-service';
import { hot } from 'react-hot-loader/root';
import { useEffect, useState } from 'react';




export const FighterTest = hot(() => {

  const [paused, setPaused] = useState(false)
  const [fight, setFight] = useState<Fight>(undefined)

  paused ? fight?.pause() : fight?.unpause()

  useEffect(()=> {!paused && fight?.timeRemaining == undefined && fight?.start()})

  const startNewFight = _ =>{
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
    <Fight_View/>
  </>
})
