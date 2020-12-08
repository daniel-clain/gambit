import * as React from "react"
import {connect} from 'react-redux'
import ChatMessage from "../../interfaces/chat-message.interface"
import GameCandidate from "../../interfaces/game-candidate.interface"
import GameCandidateClient from '../../interfaces/game-candidate-client.interface'
import GameLobbyClient from "../../interfaces/game-candidate-client.interface"
import { GameInfo } from "../../interfaces/game/game-info"
import PlayerNameAndId from '../../interfaces/player-name-and-id'
import { frontEndService } from "../front-end-service/front-end-service"
import { FrontEndState } from "../front-end-state/front-end-state"
import './lobby.view.scss'

interface LobbyProps{
  connectedPlayers: PlayerNameAndId[]
  gameCandidates: GameCandidate[]
  globalChat: ChatMessage[]
  activeGames: GameInfo[]
}

const Lobby_View = ({
  connectedPlayers, 
  gameCandidates, 
  globalChat, 
  activeGames
}: LobbyProps) => {


  const thisClientId: string = localStorage.getItem('clientId')

  const inGameCandidate: GameCandidate = gameCandidates.find((gameLobby: GameCandidate) =>
    gameLobby.clients.some((client: GameCandidateClient) => client.id == thisClientId)
  )
  
  let {sendUpdate} = frontEndService

  return (
    <div className='game-host'>
      <div className="main-container">
        <div className="top-container">
          <div className='create-game-button' onClick={() => handleCreateGame()}>Create Game</div>
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
                {gameCandidates.map((gameCandidate) =>
                  <div className='available-game' key={inGameCandidate.id}>
                    creator: {inGameCandidate.creator.name}<br />
                    players: {inGameCandidate.clients.length}<br />
                    <button onClick={() => handleJoinGame(inGameCandidate.id)}>Join Game</button>
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
                      <button onClick={() => handleReJoinGame(game.id)}>Re-Join Game</button> : ''}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='global-chat box'>
          <div className='box__heading'>Global Chat</div>
          <input onKeyPress={(e) => e.key == 'Enter' && submitGlobalChat(e)} />
            
          <div className="global-chat__messages">{globalChat.map((chatMessage: ChatMessage, index) =>
              <div key={index}>
                {chatMessage.player && chatMessage.player.name + ': '}
                {chatMessage.message}
              </div>
            )}
          </div>
        </div>

      </div>

      {inGameCandidate &&
        <div className='modal-blackout'>
          <div className='active-game-modal'>
            <div className='active-game-modal__heading'>Game Creator: {inGameCandidate.creator.name}</div>
            <div className='active-game-modal__heading'>Joined Players</div>
            {inGameCandidate.clients.map((client: GameLobbyClient) =>
              <div key={client.id}>
                {client.name} -
                  <input type='checkbox' checked={client.ready} disabled={true} />
              </div>)}
            <br />
            Ready?: <input type='checkbox' onChange={e => handleReadyToggle(e, inGameCandidate.id)} />
            <br /><br />
            <div className="bottom-buttons">
              {inGameCandidate.creator.id == thisClientId ? [
                <button key='cancel-button' onClick={() => handleCancelGame(inGameCandidate.id)}>Cancel Game</button>,
                <button key='start-button' onClick={() => handleStartGame(inGameCandidate.id)}>Start Game</button>
              ]
                :
                <button key='leave-button' onClick={() => handleLeaveGame(inGameCandidate.id)}>Leave Game</button>}
            </div>
          </div>
        </div>
      }
    </div>
  )
  
  


  function handleCreateGame() {
    sendUpdate({name: 'Create Game'})
  }

  function handleJoinGame(id) {
    sendUpdate({
      name: 'Join Game',
      data: { gameId: id }
    })
  }

  function handleLeaveGame(id) {
    sendUpdate({
      name: 'Leave Game',
      data: { gameId: id }
    })
  }

  function handleCancelGame(id) {
    sendUpdate({
      name: 'Cancel Game',
      data: { gameId: id }
    })
  }

  function handleStartGame(id) {
    sendUpdate({
      name: 'Start Game',
      data: { gameId: id }
    })
  }

  function handleReadyToggle(e, id) {
    const readyValue: boolean = e.target.checked
    console.log('ready checked ', readyValue);

    sendUpdate({
      name: 'Ready To Start Game',
      data: { gameId: id, readyValue: readyValue }
    })
  }

  function handleReJoinGame(gameId) {
    sendUpdate({
      name: 'Re-Join Game',
      data: { gameId }
    })
  }

  function submitGlobalChat(e) {
    const message = e.target.value
    sendUpdate({
      name: 'Submit Global Chat',
      data: { message }
    })
    e.target.value = ''
  }
}

const mapStateToProps = (
  {lobbyUiState}: FrontEndState
): LobbyProps => {
  return lobbyUiState
}

export default connect(mapStateToProps)(Lobby_View)