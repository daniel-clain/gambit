
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import ClientWebsocketService from './client-websocket-service';
import PreGame from './pre-game';
import { GameHostUiState } from '../../interfaces/game-ui-state.interface';
import GameHost from './game-host';
import ClientAction from '../../interfaces/client-action';
import GameUi from '../components/game-ui';
import './global.scss'

interface MainGameProps{
  websocketService: ClientWebsocketService
}

export default class MainGame extends React.Component<MainGameProps>{
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
    if(this.state == undefined)
      return <PreGame tryToConnectToGameHost={this.tryToConnectToGameHost.bind(this)}/>


    const {inGame} = this.state
    if(inGame)
      return <GameUi websocketService={this.props.websocketService}/> 
    
    if(inGame == false)
      return <GameHost 
        gameHostUiState={this.state}
        sendClientAction={this.props.websocketService.sendClientAction.bind(this.props.websocketService)}/>
    
  }
}
ReactDOM.render(<MainGame websocketService={new ClientWebsocketService()}/>, document.getElementById('react-rendering-div'))

