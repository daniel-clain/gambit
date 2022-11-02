import * as React from 'react';
import './disconnected-player-modal.scss'
import { ClientNameAndID } from '../../../../game-host/game-host.types';
import { frontEndState } from '../../../front-end-state/front-end-state';
import { websocketService } from '../../../front-end-service/websocket-service';
interface VotesByPlayer{
  votingPlayer: ClientNameAndID
  disconnectedPlayersVotes: {
    disconnectedPlayer: ClientNameAndID,
    voteToDrop: boolean
  }[]
}

export const DisconnectedPlayerModal = () => {

  const {
    serverUIState: {serverGameUIState},
    clientUIState: {clientPreGameUIState: {clientId, clientName}}
  } = frontEndState
  const {disconnectedPlayerVotes} = serverGameUIState!
  let {toggleDropPlayer} = websocketService.sendUpdate

  console.log('disconnectedPlayerVotes :', disconnectedPlayerVotes);

  const votesByPlayer: VotesByPlayer[] = disconnectedPlayerVotes[0].playerVotesToDrop.map(({votingPlayer}) : VotesByPlayer => ({
      votingPlayer,
      disconnectedPlayersVotes: disconnectedPlayerVotes.map(d => ({
        disconnectedPlayer: d.disconnectedPlayer,
        voteToDrop: d.playerVotesToDrop.find(v => v.votingPlayer.id == votingPlayer.id)!.drop
      }))
    })
  )

  const player: ClientNameAndID = {
    id: clientId!,
    name: clientName!
  }


  console.log('votesByPlayer :>> ', votesByPlayer);



  return (
    <div className='disconnected-player-modal'>
      <div className="modal-blackout"></div>
      <div className="modal-content">
        <div className="heading">Game Paused</div>
        <div className="details">The following player(s) have disconnected, wait for them to reconnect or vote to drop the player and continue without them.</div>


        <table className="vote-table">
          <tr className="top-row">
            <th className="top-row-heading">Disconnected Player Names</th>
            {disconnectedPlayerVotes.map(d => 
              <th 
                key={d.disconnectedPlayer.id} 
                className="disconnected-player-name"
              >
                {d.disconnectedPlayer.name}
              </th>
            )}
          </tr>

          {votesByPlayer.map(({votingPlayer, disconnectedPlayersVotes}) => 
          
            <tr 
              key={votingPlayer.id}  
              className={`
                player-vote-row 
                ${votingPlayer.id == player.id ? 'player-vote-row--this-player' : ''}
              `}
            >
              <td className={`player-vote`}
            >{votingPlayer.name}'s vote:</td>
                
              {disconnectedPlayersVotes.map(({disconnectedPlayer, voteToDrop}) => 

                <td 
                  key={disconnectedPlayer.id} 
                  className={`
                    player-vote 
                    player-vote--${voteToDrop ? 'drop' : 'dont-drop'}
                  `}
                  onClick={() => votingPlayer.id == player.id && 
                    toggleDropPlayer({
                      votingPlayer, 
                      disconnectedPlayer, 
                      vote: !voteToDrop
                    })
                  }
                >
                  {voteToDrop ? 'Drop' : `Don't Drop`}
                </td>
              )}
              
            </tr>
          )}

        </table>
      </div>
    </div>
  )
}
