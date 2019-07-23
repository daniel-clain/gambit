
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import ClientWebsocketService from './client-websocket-service';
import C_GameUI from '../components/game-ui';
import C_PreGame from './pre-game';
import ClientUIState from '../../interfaces/client-ui-state.interface';
import C_GameHost from './game-host';
import ClientAction from '../../interfaces/client-action';

interface MainGameProps{
  websocketService: ClientWebsocketService
}

export default class C_MainGame extends React.Component<MainGameProps>{
  state: ClientUIState = {
    gameHost: null,
    game: null
  }
  
  constructor(props){
    super(props)
    this.props.websocketService.cientUIStateUpdate.subscribe(
      (clientUIState: ClientUIState) => this.setState(clientUIState))
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
      data: {name, clientId}    
    }    
    this.props.websocketService.sendClientAction(connectAction)
  }

  render(){
    const {gameHost, game} = this.state
    if(game !== null)
      return <C_GameUI {...game}/> 
    
    if(gameHost !== null)
      return <C_GameHost gameHostState={gameHost} websocketService={this.props.websocketService}/>
    
    return <C_PreGame tryToConnectToGameHost={this.tryToConnectToGameHost.bind(this)}/>
  }
}
ReactDOM.render(<C_MainGame websocketService={new ClientWebsocketService()}/>, document.getElementById('react-rendering-div'))

