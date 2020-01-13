
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { GameHostUiState } from '../../interfaces/game-ui-state.interface';

import ClientAction from '../../interfaces/client-action';
import GameUi from '../components/game-ui';
import './global.scss'
import MockClientWebsocketService from './mock-client-websocket-service';
import ClientWebsocketService from '../main-game/client-websocket-service';
import PreGame from '../main-game/pre-game';
import GameHost from '../main-game/game-host';


interface MainGameProps{
  websocketService: ClientWebsocketService
}

export default class SinglePlayerTest extends React.Component<MainGameProps>{
  state: GameHostUiState
  
  constructor(props){
    super(props)
    this.props.websocketService.gameHostUiStateUpdate.subscribe(
      (state: GameHostUiState) => this.setState(state))
    this.tryToConnectToGameHost()


  }

  tryToConnectToGameHost(){
    const name = localStorage.getItem('name')
    if(name == null)
      return

    let clientId = localStorage.getItem('clientId')
    if(clientId == null){
      clientId = new Date().getTime().toString()
      localStorage.setItem('clientId', clientId)
    }
    const connectAction: ClientAction = {      
      name: 'Connect',
      args: {name, clientId}    
    }    
    this.props.websocketService.sendClientAction(connectAction)
  }
  render(){
    
    const {inGame} = this.state
    if(inGame)
      return <GameUi websocketService={this.props.websocketService}/> 
    
  }
}
ReactDOM.render(<SinglePlayerTest websocketService={new MockClientWebsocketService() as unknown as ClientWebsocketService}/>, document.getElementById('react-rendering-div'))

