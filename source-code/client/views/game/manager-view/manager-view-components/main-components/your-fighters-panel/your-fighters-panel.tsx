
import * as React from 'react';
import {connect, ConnectedProps} from 'react-redux'
import {frontEndService} from '../../../../../../front-end-service/front-end-service';
import { FighterInfo, FrontEndState } from '../../../../../..//../interfaces/front-end-state-interface';
import '../fighters-list.scss'
import { hot } from 'react-hot-loader/root';



const mapState = (s: FrontEndState): {fighters: FighterInfo[]} => {
  const {managerInfo:{fighters}} = frontEndService.toAllManagerState(s)
  return {fighters}
}
const mapDispatch = {
  showFighter: name => ({type: 'showFighter', payload: name})
}
const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

export const YourFightersPanel = connector(hot(({fighters, showFighter}: PropsFromRedux) => {

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

}))

