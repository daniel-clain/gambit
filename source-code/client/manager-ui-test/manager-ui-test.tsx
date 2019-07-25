
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ManagerUi } from './manager-ui';
import './global.scss'

class ManagerUiTest extends React.Component{
  
  render(){

    const managerUiState = {
      timeUntilNextFight: 50,
      money: 500,
      actionPoints: 5,
      clientFighters: [],
      fightersInNextFight: [],
      actionLog: []
    }
    
    return <ManagerUi managerUiState={managerUiState}/>
  }
}
ReactDOM.render(<ManagerUiTest/>, document.getElementById('react-rendering-div'))

