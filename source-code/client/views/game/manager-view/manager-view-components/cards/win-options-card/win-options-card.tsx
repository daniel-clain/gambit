
import * as React from 'react';
import '../modal-card.scss';
import { AbilityBlock } from '../../partials/ability-block/ability-block';
import { Modal } from '../../partials/modal/modal';
import { frontEndState } from '../../../../../../front-end-state/front-end-state';
import { observer } from 'mobx-react';
import { getTryToWinAbilities } from '../../../../../../front-end-service/ability-service-client';

export const WinOptionsCard = observer(() => {
  const {managerInfo} = frontEndState.serverUIState.serverGameUIState.playerManagerUIState
  const winOptions = getTryToWinAbilities()
  return (
    <Modal>
      <div className='card'>
        <div className='heading'>
          Try To Win
        </div>
        <div className='card__options'>
          <div className='heading'>Options</div>
          {winOptions.map(option =>
            <AbilityBlock 
              key={option.name}
              abilityData={{
                name: option.name,
                source: managerInfo,
                target: undefined
              }}
            />    
          )}
        </div>
        
      </div>
    </Modal>
  )
})

