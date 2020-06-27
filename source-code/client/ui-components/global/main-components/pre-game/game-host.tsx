
import * as React from 'react';
import './game-host.scss'
import { MainGameData } from '../../../../../interfaces/game-ui-state.interface';
import ClientAction from '../../../../../interfaces/client-action';
import GameLobby from '../../../../../interfaces/game-lobby.interface';
import GameLobbyClient from '../../../../../interfaces/game-lobby-client.interface';
import ChatMessage from '../../../../../interfaces/chat-message.interface';
import { GameInfo } from '../../../../../interfaces/game/game-info';

export interface GameHostProps {
  mainGameData: MainGameData
  sendClientAction(clientAction: ClientAction): void
}
export default class GameHost extends React.Component<GameHostProps>{



  handleCreateGame() {
    const clientAction: ClientAction = {
      name: 'Create Game',
      data: null
    }
    this.props.sendClientAction(clientAction)
  }
  handleJoinGame(id) {
    const clientAction: ClientAction = {
      name: 'Join Game',
      data: { gameId: id }
    }
    this.props.sendClientAction(clientAction)
  }

  handleLeaveGame(id) {
    const clientAction: ClientAction = {
      name: 'Leave Game',
      data: { gameId: id }
    }
    this.props.sendClientAction(clientAction)
  }

  handleCancelGame(id) {
    const clientAction: ClientAction = {
      name: 'Cancel Game',
      data: { gameId: id }
    }
    this.props.sendClientAction(clientAction)
  }

  handleStartGame(id) {
    const clientAction: ClientAction = {
      name: 'Start Game',
      data: { gameId: id }
    }
    this.props.sendClientAction(clientAction)
  }

  handleReadyToggle(e, id) {
    const readyValue: boolean = e.target.checked
    console.log('ready checked ', readyValue);

    const clientAction: ClientAction = {
      name: 'Ready To Start Game',
      data: { gameId: id, readyValue: readyValue }
    }
    this.props.sendClientAction(clientAction)
  }

  handleReJoinGame(gameId) {
    const clientAction: ClientAction = {
      name: 'Re-Join Game',
      data: { gameId }
    }
    this.props.sendClientAction(clientAction)
  }

  submitGlobalChat(e) {
    const message = e.target.value
    const clientAction: ClientAction = {
      name: 'Submit Global Chat',
      data: { message }
    }
    this.props.sendClientAction(clientAction)
    e.target.value = ''
  }

  render() {
    const { connectedPlayers, gameLobbies, globalChat, activeGames } = this.props.mainGameData
    const thisClientId: string = localStorage.getItem('clientId')

    const inGameLobby: GameLobby = gameLobbies.find((gameLobby: GameLobby) =>
      gameLobby.clients.some((client: GameLobbyClient) => client.id == thisClientId))

    return (
      <div className='game-host'>
        <div className="main-container">
          <div className="top-container">
            <div className='create-game-button' onClick={() => this.handleCreateGame()}>Create Game</div>
            <div className="lists">
              <div className='connected-players box list'>
                <div className='box__heading'>Connected Players</div>
                <div className="list__items">
                  {connectedPlayers.map(player =>
                    <div className='connected-player' key={player.id}>{player.name}</div>
                  )}
                </div>
              </div>
              <div className='available-games box list'>
                <div className='box__heading'>Available Games</div>
                <div className="list__items">
                  {gameLobbies.map((gameLobby: GameLobby) =>
                    <div className='available-game' key={gameLobby.id}>
                      creator: {gameLobby.creator.name}<br />
                      players: {gameLobby.clients.length}<br />
                      <button onClick={() => this.handleJoinGame(gameLobby.id)}>Join Game</button>
                    </div>
                  )}
                </div>
              </div>
              <div className='active-games box list' >
                <div className='box__heading'>Active Games</div>
                <div className="list__items">
                  {activeGames.map((game: GameInfo) =>
                    <div className='available-game' key={game.id}>
                      <div>game id: {game.id}</div>
                      <div>players: {game.players.map(player => <div key={player.id}>{player.name}</div>)}</div>
                      {game.disconnectedPlayers.some(player => player.id == thisClientId) ?
                        <button onClick={() => this.handleReJoinGame(game.id)}>Re-Join Game</button> : ''}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className='global-chat box'>
            <div className='box__heading'>Global Chat</div>
            <input onKeyPress={(e) => e.key == 'Enter' && this.submitGlobalChat(e)} />
              
            <div className="global-chat__messages">{globalChat.map((chatMessage: ChatMessage, index) =>
                <div key={index}>
                  {chatMessage.player && chatMessage.player.name + ': '}
                  {chatMessage.message}
                </div>
              )}
            </div>
          </div>

        </div>

        {inGameLobby &&
          <div className='modal-blackout'>
            <div className='active-game-modal'>
              <div className='active-game-modal__heading'>Game Creator: {inGameLobby.creator.name}</div>
              <div className='active-game-modal__heading'>Joined Players</div>
              {inGameLobby.clients.map((client: GameLobbyClient) =>
                <div key={client.id}>
                  {client.name} -
                    <input type='checkbox' checked={client.ready} disabled={true} />
                </div>)}
              <br />
              Ready?: <input type='checkbox' onChange={e => this.handleReadyToggle(e, inGameLobby.id)} />
              <br /><br />
              <div className="bottom-buttons">
                {inGameLobby.creator.id == thisClientId ? [
                  <button key='cancel-button' onClick={() => this.handleCancelGame(inGameLobby.id)}>Cancel Game</button>,
                  <button key='start-button' onClick={() => this.handleStartGame(inGameLobby.id)}>Start Game</button>
                ]
                  :
                  <button key='leave-button' onClick={() => this.handleLeaveGame(inGameLobby.id)}>Leave Game</button>}
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}