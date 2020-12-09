import React from 'react'
import { FighterInfo } from '../../../../../../../interfaces/server-game-ui-state.interface'
import { frontEndService } from '../../../../../../front-end-service/front-end-service'
import { Modal_Partial } from '../../partials/modal/modal'

export const KnownFightersCard = ({fighters}: {fighters: FighterInfo[]}) => {
  return (
    <Modal_Partial>
    
      <div className='panel known-fighters'>
        <div className='heading'>Known Fighters</div>
        <div className='list fighter-list'>
          {fighters.map(fighter =>
            <div 
              className={'list__row'} 
              key={fighter.name} 
              onClick={() => frontEndService.fighterSelected(fighter)}
            >           
              <span className='list__row__image'></span>
              <span className='list__row__name'>{fighter.name}</span>
            </div>
          )}
        </div>
      </div>
      
    </Modal_Partial>
  )
}
