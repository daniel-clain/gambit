import * as React from 'react';
import FightUi from '../../fight-ui/fight-ui';
import { FightUiData } from '../../../../interfaces/game/fight-ui-data';
import { ManagerDisplayInfo } from '../../../../interfaces/game-ui-state.interface';
import ManagersBets from '../../../global/partials/fight-ui/managers-bet';

interface DisplayFightUiProps{
  fightUiData: FightUiData,
  managers: ManagerDisplayInfo[]
}

export default class DisplayFightUi extends React.Component<DisplayFightUiProps>{

  
  render(){
    const {fightUiData, managers} = this.props                             
    
    return (
      <div className='display-fight-ui'>
        <ManagersBets managers={managers.map(manager => {
          delete manager.bet.size
          return manager
        })}/> 
        <FightUi fightUiData={fightUiData}/>
      </div>
    )
  }
}