
import * as React from 'react';
import { FightUiState } from '../../interfaces/client-ui-state.interface';

export interface FightUIProps{
  fightUiState: FightUiState
}

export default class C_FightUI extends React.Component<FightUIProps>{
  render(){
    return <div>fight ui</div>
  }
}