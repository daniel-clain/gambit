import * as React from 'react'
import {frontEndService} from '../../../../../../front-end-service/front-end-service'
import { FighterInfo } from '../../../../../../../interfaces/front-end-state-interface'
import { Modal } from '../../partials/modal/modal'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader/root'

const {managerMap} = frontEndService

const mapping = managerMap<{knownFighters: FighterInfo[]}>(({managerInfo:{knownFighters}}) => ({knownFighters}))

export const KnownFightersCard = connect(mapping, {showFighter: name => ({type: 'showFighter', payload: name})})(hot(
  ({knownFighters, showFighter}) => {
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
}))
