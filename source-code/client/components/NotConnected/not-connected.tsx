
import * as React from 'react'
import ClientWebsocketService from '../../services/client-websocket.service';
import ClientService from '../../services/client.service';
import Player from '../../../interfaces/player';
import SetPlayerName from './SetPlayerName/set-player-name';
import ConnectionStates from '../../../types/connection-states';
import styled from 'styled-components'
import Button from '../styled/button';

const Container = styled.div`
  display: block;
  margin: 3rem auto 0;
  padding: 3rem;
  border: 1px solid black;
  max-width: 500px;
`


type Props = {
  websocketService: ClientWebsocketService
  clientService: ClientService
  player: Player
  connection: ConnectionStates
}

export default class NotConnected extends React.Component<Props>{

  state = {
    playerNameSet: false
  }
  constructor(props){
    super(props)
  }
  
  render(){
    return (
      <Container>
        {!this.props.player.name ? 
          <SetPlayerName clientService={this.props.clientService}/>        
        :
          this.props.connection == 'Connecting' ?
            <span>Connecting.....</span>
          :
            <Button onClick={() => this.props.websocketService.tryToConnect(this.props.player)}>Connect</Button>
        }
      </Container>
    )
    
  }
}