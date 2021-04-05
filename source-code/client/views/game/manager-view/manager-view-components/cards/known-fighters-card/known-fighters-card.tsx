import * as React from 'react'
import {frontEndService} from '../../../../../../front-end-service/front-end-service'
import { FighterInfo } from '../../../../../../../interfaces/front-end-state-interface'
import { Modal } from '../../partials/modal/modal'

export const KnownFightersCard = ({fighters}: {fighters: FighterInfo[]}) => {
  const {showFighter} = frontEndService .setClientState
  return (
    <Modal>    
      <div className='panel known-fighters'>
        <div className='heading'>Known Fighters</div>
        <div className='list fighter-list'>
          {fighters.map(fighter =>
            <div 
              className={'list__row'} 
              key={fighter.name} 
              onClick={() => showFighter(fighter.name)}
            >           
              <span className='list__row__image'></span>
              <span className='list__row__name'>{fighter.name}</span>
            </div>
          )}
        </div>
      </div>
      
    </Modal>
  )
}
