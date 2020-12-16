import * as React from 'react'
import {useDispatch} from 'react-redux'
import { Dispatch } from 'redux'
import { FighterInfo } from '../../../../../../../interfaces/server-game-ui-state.interface'
import { ClientManagerUIAction } from '../../../../../../front-end-state/reducers/manager-ui.reducer'
import { Modal } from '../../partials/modal/modal'

export const KnownFightersCard = ({fighters}: {fighters: FighterInfo[]}) => {
  const dispatch: Dispatch<ClientManagerUIAction> = useDispatch()
  return (
    <Modal>    
      <div className='panel known-fighters'>
        <div className='heading'>Known Fighters</div>
        <div className='list fighter-list'>
          {fighters.map(fighter =>
            <div 
              className={'list__row'} 
              key={fighter.name} 
              onClick={() => dispatch({type: 'Fighter Selected', payload: fighter})}
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
