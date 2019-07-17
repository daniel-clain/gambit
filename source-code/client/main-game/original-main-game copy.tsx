
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { GameLobbyView, ManagerOptionsView, FightEventView } from '../views/view';
import styled from 'styled-components';
import ClientWebsocketService from '../client-websocket-service';
import C_LocalGame, { LocalGameProps } from '../local-single-player/local-single-player';
import Game from '../../classes/game/game';


export type ClientUIState = {
  views: {
    gameLobby: GameLobbyView
    managerOptions: ManagerOptionsView
    fightEvent: FightEventView
  }
}

const S_UIRoot = styled.div`
  background-color: #ffecd4;
  font-family: 'Titillium Web', sans-serif;
`

export default class C_ClientUI extends React.Component{
  websocketService: ClientWebsocketService

  private gameFacade: IGameFacade

  state: ClientUIState = {    
    views: {
      gameLobby: {
        props: {
          isActive: true,
          connected: false,
          websockeService: this.websocketService
        }
      },
      managerOptions: null,
      fightEvent: null
    }
  }
  

  constructor(props){
    super(props)
    this.websocketService = new ClientWebsocketService()
    this.gameFacade = new RemoteGameFacade(this.websocketService)
    this.websocketService.uIStateUpdateSubject.subscribe((updatedState: ClientUIState) => {
      console.log(updatedState)
       this.setState(updatedState)
    })
  }
  
  render(){
    const {views} = this.state
    return (
      <S_UIRoot id='root-ui'>
        <h1>{process.env.GameLocation}</h1>
        {views.gameLobby != null && 
          <C_GameLobby {...views.gameLobby.props} websockeService={this.websocketService}></C_GameLobby>
        }
        {views.managerOptions != null && 
          <C_ManagerOptions {...views.managerOptions.props}></C_ManagerOptions>
        }
        {views.fightEvent != null && 
          <C_FightEvent {...views.fightEvent.props}></C_FightEvent>
        }
      </S_UIRoot>
    )
  }
}
ReactDOM.render(<C_ClientUI/>, document.getElementById('react-rendering-div'))

