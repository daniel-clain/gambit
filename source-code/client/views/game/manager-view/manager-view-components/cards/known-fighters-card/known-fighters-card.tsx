import * as React from 'react'
import { Modal } from '../../partials/modal/modal'
import { observer } from 'mobx-react'
import { frontEndState } from '../../../../../../front-end-state/front-end-state'
import { showFighter } from '../../../../../../front-end-service/front-end-service'


export const KnownFightersCard = observer(() => {
  const {serverUIState: {serverGameUIState}} = frontEndState
  const {knownFighters} = serverGameUIState!.playerManagerUIState!.managerInfo
  return (
    <Modal>    
      <div className='panel known-fighters'>
        <div className='heading'>Known Fighters</div>
        <div className='list fighter-list'>
          {knownFighters.map(fighter =>
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
})
