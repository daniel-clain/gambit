
import * as React from 'react';
import ClientWebsocketService from './client-websocket-service';


export interface GameLobbyUIProps{
  websocketService: ClientWebsocketService
}

export default class C_GameLobby extends React.Component<GameLobbyUIProps>{
  constructor(props){
    super(props)
  }
  render(){
    return <div>game lobby</div>
  }

}