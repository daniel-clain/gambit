import * as React from 'react';
import { FightUIState } from '../../../../../interfaces/game/fight-ui-data';
import Fight_View from '../../../game/fight-view/fight.view'

interface DisplayFightUiProps{
  fightUiData: FightUIState
}

export default class DisplayFightUi extends React.Component<DisplayFightUiProps>{

  
  render(){                           
    
    return (
      <div className='display-fight-ui'>
        <Fight_View fightUiData={this.props.fightUiData}/>
      </div>
    )
  }
}