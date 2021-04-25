
import * as React from 'react';
import '../../styles/global.scss'
import Fight from '../../../game-components/fight/fight';
import { fightUiService } from './fight-ui-service';
import { useEffect, useState } from 'react';
import Fight_View from '../../views/game/fight-view/fight.view';
import { preLoadImages } from '../../front-end-service/pre-load-images';




const FighterTest = () => {

  const [paused, setPaused] = useState(false)
  const [fight, setFight] = useState<Fight>(undefined)
  const [imagesPreloaded, setImagesPreloaded] = useState(false)

  paused ? fight?.pause() : fight?.unpause()

  useEffect(()=> {
    preLoadImages(true)
    .then(() => {
      setImagesPreloaded(true)
      //startNewFight()
    })
  },[])

  const startNewFight = () => {
    fightUiService.newFight()
    setFight(fightUiService.fight)
  }  
  return <>
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
    {fight && imagesPreloaded &&
      <Fight_View/>
    }
  </>
}
export {FighterTest}
