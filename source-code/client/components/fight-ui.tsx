
import * as React from 'react';
import { FightUiState } from '../../interfaces/game-ui-state.interface';

export interface FightUiProps{
  fightUiState: FightUiState
}

export default class FightUi extends React.Component<FightUiProps>{
  render(){
    return <div>fight ui</div>
  }
}