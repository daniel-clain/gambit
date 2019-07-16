import styled from 'styled-components';
import UIView, { UIViewProps } from '../view';
import IGameFacade from '../../../interfaces/game-facade.interface';
import * as React from 'react'
import ClientWebsocketService from '../../client-websocket-service';

export interface GameLobbyProps extends UIViewProps {
  isActive: boolean
  connected: boolean
  websockeService?: ClientWebsocketService
}


const S_GameLobby = styled.div``

export default class C_GameLobby extends React.Component<GameLobbyProps>{


  public render() {
    const {connected, websockeService} = this.props    
    let inputName
    function nameInput(x){
      inputName = x.target.value
    }
    
    function connectToGame(name){
      if(name)
        websockeService.sendClientAction({name: 'Connect', arguments: {name: name}})
    }
    
    function joinGame(){
      websockeService.sendClientAction({name: 'Join Game'})
    }

    return (
      <S_GameLobby id='game-lobby'>
        {!connected ? 
          <div id='enter-name'>
            <input placeholder='enter your name' onInput={(e) => nameInput(e)}/>
            <button onClick={() => connectToGame(inputName)}>Connect To Game</button>
          </div>
        :
          <div id='join-game'>
            <button onClick={() => joinGame()}>Join Game</button>
            {/* <button>ready to start</button> */}
          </div>
        }
      </S_GameLobby>
    )
  }
}
