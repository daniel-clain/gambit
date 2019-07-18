
import * as React from 'react';
import C_FightUI, { FightUIProps } from "./manager-ui";
import C_ManagerUI, { ManagerUIProps } from "./fight-ui";
import IGameFacade from '../../classes/game-facade/game-facade';

export interface GameUIProps{
  gameFacade: IGameFacade
}
export interface GameUIState{
  fightEventActive: boolean
  managerUiProps: ManagerUIProps
  fightUiProps: FightUIProps
}

export default class C_GameUI extends React.Component<GameUIProps>{
  state: GameUIState
  constructor(props){
    super(props)
    this.props.gameFacade.gameStateUpdates.subscribe(this.setState)
  }
  render(){
    const {fightEventActive, fightUiProps, managerUiProps} = this.state
    return fightEventActive ? 
      <C_FightUI {...fightUiProps}/> : 
      <C_ManagerUI {...managerUiProps}/>
  }

}