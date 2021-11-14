
import * as React from 'react';
import '../modal-card.scss';
import { connect, ConnectedProps } from 'react-redux';
import { hot } from 'react-hot-loader/root';
import { ClientAbility } from '../../../../../../../game-components/abilities-general/ability';
import { FrontEndState, Employee } from '../../../../../../../interfaces/front-end-state-interface';
import { AbilityBlock } from '../../partials/ability-block/ability-block';
import { Modal } from '../../partials/modal/modal';
import { abilityService } from '../../../../../../front-end-service/ability-service-client';


const mapState = ({
  serverUIState:{serverGameUIState:{
    playerManagerUIState:{managerInfo}
  }}
}: FrontEndState): {managerInfo} => ({managerInfo})


const connector = connect(mapState)
type PropsFromRedux = ConnectedProps<typeof connector>

export const WinOptionsCard = connector(hot(({managerInfo}: PropsFromRedux) => {
  const winOptions = abilityService.getTryToWinAbilities()
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
                source: {
                  type: 'Manager',
                  name:  managerInfo.name
                },
                target: undefined
              }}
            />    
          )}
        </div>
        
      </div>
    </Modal>
  )
}))

