
import * as React from 'react';
import '../../styles/global.scss'
import Fight from '../../../game-components/abilities-general/fight/fight';
import { fightUiService } from './fight-ui-service';
import { useEffect, useState } from 'react';
import { ConfigureTestFighters } from './configure-test-fighters';
import { Fight_View } from '../../views/game/fight-view/fight.view';




const FighterTest = () => {

  const [paused, setPaused] = useState(false)
  const [fight, setFight] = useState<Fight>(undefined)
  const [fightersList, setFightersList] = useState([])

  paused ? fight?.pause() : fight?.unpause()


  const startNewFight = () => {
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
    {fight &&
      <Fight_View/>
    }
  </>
}
export {FighterTest}
