import * as React from "react"
import { hot } from "react-hot-loader/root"
import {connect} from 'react-redux'
import ChatMessage from "../../interfaces/chat-message.interface"
import GameLobbyClient from "../../interfaces/game-candidate-client.interface"
import { GameInfo } from "../../interfaces/game/game-info"
import { GameBeingCreated } from "../../game-host/game-host.types"
import {frontEndService}  from "../front-end-service/front-end-service"
import { FrontEndState, ServerPreGameUIState } from "./../../interfaces/front-end-state-interface"
import './lobby.view.scss'

interface LobbyProps extends ServerPreGameUIState{
  clientId: string
}

const Lobby_View = ({
  connectedClients, 
  gamesBeingCreated, 
  globalChat, 
  activeGames,
  clientId
}: LobbyProps) => {


  const joinedGameBeingCreated: GameBeingCreated = gamesBeingCreated.find((g: GameBeingCreated) =>
    g.clients.some(c => c.id == clientId) || g.creator.id == clientId
  )
  
  let { create, cancel, start, join, readyToStart, 
    leave, reJoin, submitGlobalChat, 
  } = frontEndService.sendUpdate

  return (
    <div className='game-host'>
      <div className="main-container">
        <div className='create-game-button' onClick={create}>Create Game</div>
        <div className="lists">
            <div className='connected-players box list'>
              <div className='box__heading'>Connected Players</div>
              <div className="list__items">
                {connectedClients.map(player =>
                  <div className='connected-player' key={player.id}>{player.name}</div>
                )}
              </div>
            </div>
            <div className='available-games box list'>
              <div className='box__heading'>Available Games</div>
              <div className="list__items">
                {gamesBeingCreated.map((gameBeingCreated) =>
                  <div className='available-game' key={gameBeingCreated.id}>
                    creator: {gameBeingCreated.creator.name}<br />
                    players: {gameBeingCreated.clients.length}<br />
                    <button onClick={() => join(gameBeingCreated.id)}>Join Game</button>
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
                    {game.disconnectedPlayerVotes.some(d => d.disconnectedPlayer.id == clientId) ?
                      <button onClick={() => reJoin(game.id)}>Re-Join Game</button> : ''}
                  </div>
                )}
              </div>
            </div>
          </div>
        <div className='global-chat box'>
          <div className='box__heading'>Global Chat</div>
            
          <div className="global-chat__messages">{globalChat.map((chatMessage: ChatMessage, index) =>
              <div key={index}>
                {chatMessage.player && chatMessage.player + ': '}
                {chatMessage.message}
              </div>
            )}
          </div>
          <input onKeyPress={({key, currentTarget: {value}}) => key == 'Enter' && submitGlobalChat(value)} />
        </div>
      </div>

      {joinedGameBeingCreated &&
        <div className='modal-blackout'>
          <div className='active-game-modal'>
            <div className='active-game-modal__heading'>Game Creator: {joinedGameBeingCreated.creator.name}</div>
            <div className='active-game-modal__heading'>Joined Players</div>
            {joinedGameBeingCreated.clients.map((client: GameLobbyClient) =>
              <div key={client.id}>
                {client.name} -
                  <input type='checkbox' checked={client.ready} disabled={true} />
              </div>)}
            <br />
            Ready?: <input type='checkbox' onChange={({currentTarget: {checked}}) => readyToStart({gameId: joinedGameBeingCreated.id, ready: checked})} />
            <br /><br />
            <div className="bottom-buttons">
              {joinedGameBeingCreated.creator.id == clientId ? [
                <button key='cancel-button' onClick={() => cancel(joinedGameBeingCreated.id)}>Cancel Game</button>,
                <button key='start-button' onClick={() => start(joinedGameBeingCreated.id)}>Start Game</button>
              ]
                :
                <button key='leave-button' onClick={() => leave(joinedGameBeingCreated.id)}>Leave Game</button>}
            </div>
          </div>
        </div>
      }
    </div>
  )
  
}

const mapStateToProps = ({
  serverUIState: {serverPreGameUIState},
  clientUIState: {clientPreGameUIState: {clientId}}
}: FrontEndState): LobbyProps => {
  return {...serverPreGameUIState, clientId}
}

export default connect(mapStateToProps)(hot(Lobby_View))