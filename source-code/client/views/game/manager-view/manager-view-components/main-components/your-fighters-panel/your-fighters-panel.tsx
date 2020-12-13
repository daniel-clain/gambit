
import * as React from 'react';
import {connect, useDispatch} from 'react-redux'
import { Dispatch } from 'redux';
import { FighterInfo } from '../../../../../../../interfaces/server-game-ui-state.interface';
import { FrontEndState } from '../../../../../../front-end-state/front-end-state';
import { ClientManagerUIAction } from '../../../../../../front-end-state/reducers/manager-ui.reducer';
import '../fighters-list.scss'

export interface YourFightersPanelProps{  
  yourFighters: FighterInfo[]
}

const YourFightersPanel = ({yourFighters}: YourFightersPanelProps) => {

  const dispatch: Dispatch<ClientManagerUIAction> = useDispatch()
    
  return (
    <div className='panel your-fighters'>
      <div className='heading'>Your Fighters</div>
      <div className='list fighter-list'>
        {yourFighters.map(fighter =>
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
  )

};



const mapStateToProps = ({
  serverUIState: { serverGameUIState: {playerManagerUiData: {managerInfo: {yourFighters}}}}
}: FrontEndState): YourFightersPanelProps => ({yourFighters})
export default connect(mapStateToProps)(YourFightersPanel)
