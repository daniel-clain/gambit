
import * as React from 'react';
import C_FightUI from "./fight-ui";
import C_ManagerUI from "./manager-ui";
import { GameUiState } from '../../interfaces/client-ui-state.interface';

export default class C_GameUI extends React.Component<GameUiState>{

  render(){
    const {managerUiState, fightUiState} = this.props
    if(fightUiState != null)
      return <C_FightUI fightUiState={fightUiState}/>
    else
      return <C_ManagerUI managerUiState={managerUiState}/>
  }

}