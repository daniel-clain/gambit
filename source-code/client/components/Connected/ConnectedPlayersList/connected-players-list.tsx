
import * as React from 'react'
import ClientWebsocketService from '../../../services/client-websocket.service';
import Player from '../../../../interfaces/player';
import styled from 'styled-components'

type Props = {
  websocketService: ClientWebsocketService
}
type State = {
  connectedPlayers: Player[]
}

const PlayerListStyle = styled.div`
  margin: 3rem auto;
  width: 10rem;
  border: 1px solid;
  padding: .5rem;
`

export default class ConnectedPlayersList extends React.Component<Props>{
  state: State = {
    connectedPlayers: []
  }

  constructor(props){
    super(props)
    this.props.websocketService.connectedPlayersSubject.subscribe(
      (connectedPlayers: Player[]) => this.setState({connectedPlayers: connectedPlayers})
    )
  }
  
  render(){
    const {connectedPlayers} = this.state
    return (
      <PlayerListStyle>
        <h4>Connected Players</h4>
        {connectedPlayers.map((player: Player) => 
          <div className='player_tile'>
            <div className='player_tile__name'>{player.name}</div>
            <div className={`player_tile__connection-status--${player.connected ? 'connected' : 'not-connected'}`}></div>
          </div>
        )}
      </PlayerListStyle>
    )
  }
}
