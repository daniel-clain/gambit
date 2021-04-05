
import * as React from 'react';
import {connect} from 'react-redux'
import {frontEndService} from '../../../../../../front-end-service/front-end-service';
import { FighterInfo, FrontEndState } from '../../../../../..//../interfaces/front-end-state-interface';
import '../fighters-list.scss'

export interface YourFightersPanelProps{  
  fighters: FighterInfo[]
}

const YourFightersPanel = ({fighters}: YourFightersPanelProps) => {

  const {showFighter} = frontEndService .setClientState
    
  return (
    <div className='panel your-fighters'>
      <div className='heading'>Your Fighters</div>
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
  )

};



const mapStateToProps = ({
  serverUIState: { serverGameUIState: {playerManagerUIState: {managerInfo: {fighters}}}}
}: FrontEndState): YourFightersPanelProps => ({fighters})
export default connect(mapStateToProps)(YourFightersPanel)
