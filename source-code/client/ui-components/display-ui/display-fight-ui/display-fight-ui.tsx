import * as React from 'react';
import { FightUiData } from '../../../../interfaces/game/fight-ui-data';
import FightUi from '../../global/main-components/fight-ui/fight-ui';

interface DisplayFightUiProps{
  fightUiData: FightUiData
}

export default class DisplayFightUi extends React.Component<DisplayFightUiProps>{

  
  render(){                           
    
    return (
      <div className='display-fight-ui'>
        <FightUi fightUiData={this.props.fightUiData}/>
      </div>
    )
  }
}