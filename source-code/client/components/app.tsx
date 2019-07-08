import ClientWebsocketService from '../services/client-websocket.service';
import NotConnected from './NotConnected/not-connected';
import Connected from './Connected/connected';
import Player from '../../interfaces/player';
import ClientService from '../services/client.service';
import * as React from 'react'
import ConnectionStates from '../../types/connection-states';
import StyledApp from './styled/app'
import Header from './Header/header';

type AppState = {
  connection: ConnectionStates,
  player: Player
}

export default class App extends React.Component{
  websocketService: ClientWebsocketService
  clientService: ClientService
  state: AppState = {
    connection: 'Not Connected',
    player: {
      name: null,
      connected: false,
      clientId: null,
      gameId: null
    }

  }
  constructor(props){
    super(props)
    this.websocketService = new ClientWebsocketService()
    this.clientService = new ClientService()
    
    this.clientService.playerObservable.subscribe(
      (player: Player) => this.setState({player: player})
    )
    this.websocketService.connectedSubject.subscribe(
      (connection: ConnectionStates) => this.setState({connection: connection})
    )
  }

  componentDidUpdate(){
    if(this.state.player.name && this.state.connection == 'Not Connected'){
      this.websocketService.tryToConnect(this.state.player)
    }
  }

  render(){
    const {connection, player} = this.state
    return (
      <StyledApp>
        <Header connectionState={connection}></Header>
        {connection == 'Connected' ? 
          <Connected
            websocketService={this.websocketService} 
            clientService={this.clientService} 
            player={player}
          />
        :
          <NotConnected
            websocketService={this.websocketService} 
            clientService={this.clientService} 
            player={player}
            connection={connection}
          />
        } 
      </StyledApp>
    )
  }
  
}