
import * as React from 'react';
import '../fighters-list.scss'
import { observer } from 'mobx-react';
import { frontEndState } from '../../../../../../front-end-state/front-end-state';
import { showFighter } from '../../../../../../front-end-service/front-end-service';



export const YourFightersPanel = observer(() => {

  const {fighters} = frontEndState.serverUIState.serverGameUIState.playerManagerUIState.managerInfo

  return (
    <div className='panel your-fighters'>
      <div className='heading'>Your Fighters</div>
      <div className='list fighter-list'>
        {fighters.map(fighter =>
          <div 
            className={`
            list__row
            `} 
            key={fighter.name} 
            onClick={() => showFighter(fighter.name)}
          >
            <span className='list__row__image'></span>
            <span className='list__row__name'>{fighter.name}</span>
          </div>
        )}
      </div>
    </div>
  )
})

