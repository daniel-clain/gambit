
import * as React from 'react';
import C_FightUI, { FightUIProps } from "./manager-ui";
import C_ManagerUI, { ManagerUIProps } from "./fight-ui";

export interface GameUIProps{
  fightEventActive: boolean
  managerUiProps: ManagerUIProps
  fightUiProps: FightUIProps
}

export default class C_GameUI extends React.Component<GameUIProps>{
  constructor(props){
    super(props)
  }
  render(){
    const {fightEventActive, fightUiProps, managerUiProps} = this.props
    return fightEventActive ? 
      <C_FightUI {...fightUiProps}/> : 
      <C_ManagerUI {...managerUiProps}/>
  }

}