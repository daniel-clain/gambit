import * as React from 'react';
import './disconnected-player-modal.scss'
import { DisconnectedPlayerVote } from '../../../../interfaces/game-ui-state.interface';
import ClientGameAction from '../../../../types/client-game-actions';
import PlayerNameAndId from '../../../../interfaces/player-name-and-id';
import IUpdateCommunicatorUi from '../../../../interfaces/update-communicator-ui.interface';

interface DisconnectedPlayerModalProps{
  player: PlayerNameAndId
  disconnectedPlayerVotes: DisconnectedPlayerVote[]
  updateCommunicatorUi: IUpdateCommunicatorUi
}

export function DisconnectedPlayerModal({disconnectedPlayerVotes, updateCommunicatorUi, player}: DisconnectedPlayerModalProps){

  console.log('disconnectedPlayerVotes :', disconnectedPlayerVotes);

  const disconnectedPlayers = disconnectedPlayerVotes[0].playerVotesToDrop.map(playerVote => playerVote.disconnectedPlayer)  

  const dropVoteToggle = (votingPlayer: PlayerNameAndId, disconnectedPlayer: PlayerNameAndId, vote: boolean) => {
    const gameAction: ClientGameAction = {
      name: 'Toggle Drop Player',
      data: {
        votingPlayer,
        disconnectedPlayer,
        vote
      }
    }
    updateCommunicatorUi.sendGameAction(gameAction)
  }

  return (
    <div className='disconnected-player-modal'>
      <div className="modal-blackout">
        <div className="modal-content">
          <div className="heading">Game Paused</div>
          <div className="details">The following player(s) have disconnected, wait for them to reconnect or vote to drop the player and continue without them.</div>
          <div className="vote-grid">
            <div className="top-row">
              <div className="top-row-heading">Disconnected Player Names</div>
            <div className="disconnected-player-names">
              {disconnectedPlayers.map(player => <div key={player.id} className="disconnected-player-name">{player.name}</div>)}
            </div>
            </div>
            
            <div className="player-votes">
              {disconnectedPlayerVotes.map(playerVote => 
                <div key={playerVote.player.id} className={`player-vote-row ${playerVote.player.id == player.id ? 'player-vote-row--this-player' : ''}`}>
                  <div className="player-name" key={playerVote.player.id}>{playerVote.player.name}</div>
                  {playerVote.playerVotesToDrop.map(disconnectedPlayerVote => 
                    <div 
                      className={`player-vote player-vote--${disconnectedPlayerVote.drop ? 'drop' : 'dont-drop'}`} 
                      key={disconnectedPlayerVote.disconnectedPlayer.id}
                      onClick={() => dropVoteToggle(playerVote.player, disconnectedPlayerVote.disconnectedPlayer, !disconnectedPlayerVote.drop)}
                    >
                      {disconnectedPlayerVote.drop ? 'Drop' : `Don't Drop`}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}