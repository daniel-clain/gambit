import * as React from 'react';
import './disconnected-player-modal.scss'
import { DisconnectedPlayerVote } from '../../../../interfaces/server-game-ui-state.interface';
import ClientGameAction from '../../../../types/client-game-actions';
import {connect} from 'react-redux'
import { FrontEndState } from '../../../front-end-state/front-end-state';
import { frontEndService } from '../../../front-end-service/front-end-service';
import { ClientNameAndID } from '../../../../server/game-host.types';

interface DisconnectedPlayerModalProps{
  player: ClientNameAndID
  disconnectedPlayerVotes: DisconnectedPlayerVote[]
}

const DisconnectedPlayerModal = ({
  disconnectedPlayerVotes, player
}: DisconnectedPlayerModalProps) => {

  let {toggleDropPlayer} = frontEndService().sendUpdate

  console.log('disconnectedPlayerVotes :', disconnectedPlayerVotes);

  const disconnectedPlayers = disconnectedPlayerVotes[0].playerVotesToDrop.map(playerVote => playerVote.disconnectedPlayer)  


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
                      onClick={() => toggleDropPlayer({
                        votingPlayer: playerVote.player, 
                        disconnectedPlayer: disconnectedPlayerVote.disconnectedPlayer, 
                        vote: !disconnectedPlayerVote.drop
                      })}
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

const mapStateToProps = ({
  serverUIState: {serverGameUIState: {disconnectedPlayerVotes}},
  clientUIState: {clientPreGameUIState: {clientId, clientName}}
}: FrontEndState): DisconnectedPlayerModalProps => ({
  player: {id: clientId, name: clientName},
  disconnectedPlayerVotes,

})

export default connect(mapStateToProps)(DisconnectedPlayerModal)