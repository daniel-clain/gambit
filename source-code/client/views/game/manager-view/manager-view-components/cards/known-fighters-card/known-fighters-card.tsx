import * as React from 'react'
import { FrontEndState } from '../../../../../../../interfaces/front-end-state-interface'
import { Modal } from '../../partials/modal/modal'
import { connect, ConnectedProps } from 'react-redux'
import { hot } from 'react-hot-loader/root'



const mapStateToProps = ({
  serverUIState: {serverGameUIState: {
    playerManagerUIState: {managerInfo: {knownFighters}}
  }}
}: FrontEndState) => ({knownFighters})

const mapDispatchToProps = {
  showFighter: name => ({type: 'showFighter', payload: name})
}
const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

export const KnownFightersCard = connector(hot(
  ({knownFighters, showFighter}: PropsFromRedux) => {
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
