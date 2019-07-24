
import * as React from 'react';
import { ManagerOptionsState } from '../../interfaces/client-ui-state.interface';

export interface ManagerUIProps{
  managerOptions: ManagerOptionsState
  timeTillNextFight: number
}

export default class C_ManagerUI extends React.Component<ManagerUIProps>{
  constructor(props){
    super(props)
  }
  render(){
    const {managerOptions, timeTillNextFight} = this.props
    return (
    <div id='manager-options'>
      Time till next fight: {timeTillNextFight}
    </div>
  }
}