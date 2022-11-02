
import * as React from 'react';
import '../modal-card.scss';
import { observer } from 'mobx-react';
import { frontEndState } from '../../../front-end-state/front-end-state';
import { toCamelCase } from '../../../../helper-functions/helper-functions';

export const GameFinished_View = observer(() => {

  const {serverUIState: {serverGameUIState} } = frontEndState
  const {winner, players} = serverGameUIState!.gameFinishedData!
  const winnerImage = players.find(p => p.name == winner.name)!.managerImage

  return <div className="game-finished-view">
    <div className="celebration-animation"></div>
    <div className="winner-text">
      Congratulations {winner.name}!<br/>
      You are the Winner!<br/>
      Victory Type: {winner.victoryType}
    </div>
    <div className={`winner-image ${toCamelCase(winnerImage)}`}></div>
    <table className="players-table">
      {players
        .sort((a, b) => a.money - b.money)
        .map(({name,  money}) => <tr className='player'>
          <td className="player-name">{name}</td>
          <td className="player-money">{money}</td>
        </tr>)
      }
    </table>
  </div>
})