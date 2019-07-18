
import * as React from 'react';
import ClientWebsocketService from './client-websocket-service';
import C_GameLobby, { GameLobbyUIProps } from './game-lobby';
import C_EnterYourName from './enter-your-name';
import C_ConnectionError from './connection-error';


export interface PreGameUIProps{
  isConnected: boolean
  hasPlayerAccessedApp: boolean
  gameLobbyProps: GameLobbyUIProps
}

export default class C_PreGame extends React.Component<PreGameUIProps>{
  

  render(){
    const {hasPlayerAccessedApp, isConnected, gameLobbyProps} = this.props
    return !isConnected ? <C_ConnectionError/> : !hasPlayerAccessedApp ? <C_EnterYourName/> : <C_GameLobby {...gameLobbyProps}/>
  }
}

