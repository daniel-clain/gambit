
import * as React from 'react';
import { GameHostState } from '../../interfaces/client-ui-state.interface';
import ClientWebsocketService from './client-websocket-service';
import ClientAction from '../../interfaces/client-action';
import GameLobby from '../../server/game-lobby';
import ClientId from '../../types/client-id.type';
import GameLobbyClient from '../../interfaces/game-lobby-client.interface';
import ChatMessage from '../../interfaces/chat-message.interface';

export interface GameHostProps{
  gameHostState: GameHostState
  websocketService: ClientWebsocketService
}
export default class C_GameHost extends React.Component<GameHostProps>{

  handleCreateGame(){
    const clientAction: ClientAction = {
      name: 'Create Game'
    }
    this.props.websocketService.sendClientAction(clientAction)
  }
  handleJoinGame(id){
    const clientAction: ClientAction = {
      name: 'Join Game',
      data: {gameId: id}
    }
    this.props.websocketService.sendClientAction(clientAction)
  }

  handleLeaveGame(id){
    const clientAction: ClientAction = {
      name: 'Leave Game',
      data: {gameId: id}
    }
    this.props.websocketService.sendClientAction(clientAction)
  }

  handleCancelGame(id){
    const clientAction: ClientAction = {
      name: 'Cancel Game',
      data: {gameId: id}
    }
    this.props.websocketService.sendClientAction(clientAction)
  }

  handleStartGame(id){
    const clientAction: ClientAction = {
      name: 'Start Game',
      data: {gameId: id}
    }
    this.props.websocketService.sendClientAction(clientAction)
  }

  handleReadyToggle(e, id){
    const readyValue: boolean = e.target.checked
    console.log('ready checked ', readyValue);

    const clientAction: ClientAction = {
      name: 'Ready To Start Game',
      data: {gameId: id, readyValue: readyValue}
    }
    this.props.websocketService.sendClientAction(clientAction)
  }
  submitGlobalChat(e){
    const message = e.target.value
    const clientAction: ClientAction = {
      name: 'Submit Global Chat',
      data: {message}
    }
    this.props.websocketService.sendClientAction(clientAction)
    e.target.value = ''
  }

  render(){
    const {connectedPlayers, gameLobbies, globalChat} = this.props.gameHostState
    const thisClientId: ClientId = localStorage.getItem('clientId')

    const inGameLobby: GameLobby = gameLobbies.find((gameLobby: GameLobby) => 
      gameLobby.clients.some((client: GameLobbyClient) => client.id == thisClientId))

    const borderWithPaddingStyle = {
      border: '1px solid black',
      padding: '0.5rem',
      display: 'inline-block'
    }
    const modalBlackoutStyle = {
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
      backgroundColor: 'rgba(0,0,0,0.8)',
      position: 'absolute' as 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
    const modalStyle = {
      margin: 'auto',
      width: '50%',
      display: 'block',
      border: '1px solid black',
      padding: '0.5rem',
      backgroundColor: 'white'
    }

    return (
      <div id='game-lobby'>
        <div id='connected-players' style={borderWithPaddingStyle}>
          <h4>Connected Players</h4>
          {connectedPlayers.map(player => 
            <div className='connected-player' key={player.id}>{player.name}</div>
          )}
        </div>
        <button onClick={() => this.handleCreateGame()}>Create Game</button>
        <div id='available-games' style={borderWithPaddingStyle}>
          <h4>Available Games</h4>
          {gameLobbies.map((gameLobby: GameLobby) =>
            <div className='available-game' key={gameLobby.id}>
              creator: {gameLobby.creator.name}<br/>
              players: {gameLobby.clients.length}<br/>
              <button  onClick={() => this.handleJoinGame(gameLobby.id)}>Join Game</button>
            </div>
          )}
        </div>
        {inGameLobby &&
          <div id='modal-blackout' style={modalBlackoutStyle}>
            <div id='active-game-modal' style={modalStyle}>
              <h4>Game Creator: {inGameLobby.creator.name}</h4>
              <h5>Joined Players</h5>
              {inGameLobby.clients.map((client: GameLobbyClient) => 
                  <div key={client.id}>
                    {client.name} - 
                    <input type='checkbox' checked={client.ready} disabled={true} />
                  </div>)}
              <br/>
              Ready?: <input type='checkbox' onChange={e => this.handleReadyToggle(e, inGameLobby.id)}/>
              <br/><br/>
              {inGameLobby.creator.id == thisClientId ? [
                <button key='cancel-button' onClick={() => this.handleCancelGame(inGameLobby.id)}>Cancel Game</button>,
                <button key='start-button' onClick={() => this.handleStartGame(inGameLobby.id)}>Start Game</button>
              ]
              :
                <button key='leave-button' onClick={() => this.handleLeaveGame(inGameLobby.id)}>Leave Game</button>}  
            </div>
          </div>
        }
        <div id='global-chat' style={borderWithPaddingStyle}>
          <h4>Global Chat</h4>
          {globalChat.map((chatMessage: ChatMessage, index) => 
            <div key={index}>
              {chatMessage.player && chatMessage.player.name + ': '}
              {chatMessage.message}
            </div>
          )}
          <input onKeyPress={(e) => e.key == 'Enter' && this.submitGlobalChat(e)}/>
        </div>
      </div>
    )
  }
}