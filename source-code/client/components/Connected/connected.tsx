
import * as React from 'react'
import ClientWebsocketService from '../../services/client-websocket.service';
import ClientService from '../../services/client.service';
import Player from '../../../interfaces/player';
import ConnectedPlayersList from './ConnectedPlayersList/connected-players-list';

type Props = {
  websocketService: ClientWebsocketService,
  clientService: ClientService,
  player: Player
}

export default class Connected extends React.Component<Props>{
  
  render(){
    const {websocketService} = this.props
    return (
      <div>
        <ConnectedPlayersList websocketService={websocketService}/>
      </div>
    )
    
  }
}