
import * as React from 'react';
import { MainGameData } from '../../../interfaces/game-ui-state.interface';
import ClientAction from '../../../interfaces/client-action';
import ClientId from '../../../types/client-id.type';
import GameLobby from '../../../interfaces/game-lobby.interface';
import GameLobbyClient from '../../../interfaces/game-lobby-client.interface';
import ChatMessage from '../../../interfaces/chat-message.interface';

export interface GameHostProps{
  mainGameData: MainGameData
  sendClientAction(clientAction: ClientAction): void
}
export default class GameHost extends React.Component<GameHostProps>{
  

  handleCreateGame(){
    const clientAction: ClientAction = {
      name: 'Create Game',
      args: null
    }
    this.props.sendClientAction(clientAction)
  }
  handleJoinGame(id){
    const clientAction: ClientAction = {
      name: 'Join Game',
      args: {gameId: id}
    }
    this.props.sendClientAction(clientAction)
  }

  handleLeaveGame(id){
    const clientAction: ClientAction = {
      name: 'Leave Game',
      args: {gameId: id}
    }
    this.props.sendClientAction(clientAction)
  }

  handleCancelGame(id){
    const clientAction: ClientAction = {
      name: 'Cancel Game',
      args: {gameId: id}
    }
    this.props.sendClientAction(clientAction)
  }

  handleStartGame(id){
    const clientAction: ClientAction = {
      name: 'Start Game',
      args: {gameId: id}
    }
    this.props.sendClientAction(clientAction)
  }

  handleReadyToggle(e, id){
    const readyValue: boolean = e.target.checked
    console.log('ready checked ', readyValue);

    const clientAction: ClientAction = {
      name: 'Ready To Start Game',
      args: {gameId: id, readyValue: readyValue}
    }
    this.props.sendClientAction(clientAction)
  }
  submitGlobalChat(e){
    const message = e.target.value
    const clientAction: ClientAction = {
      name: 'Submit Global Chat',
      args: {message}
    }
    this.props.sendClientAction(clientAction)
    e.target.value = ''
  }

  render(){
    const {connectedPlayers, gameLobbies, globalChat} = this.props.mainGameData
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