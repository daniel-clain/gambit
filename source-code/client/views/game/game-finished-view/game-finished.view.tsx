
import * as React from 'react';
import '../modal-card.scss';
import { observer } from 'mobx-react';
import { frontEndState } from '../../../front-end-state/front-end-state';

export const GameFinished_View = observer(() => {

  const {
    serverUIState: {serverGameUIState: {gameFinishedData: {winner, players}}}
  } = frontEndState

  return <div className="game-finished-view">
    <div className="celebration-animation"></div>
    <div className="winner-text">
      Congratulations {winner.name}!<br/>
      You are the Winner!<br/>
      Victory Type: {winner.victoryType}
    </div>
    <div className={`winner-image ${getManagerImageClass(winner.image)}`}></div>
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
  function getManagerImageClass(image: string) {
    return image.split(' ').join('-').toLowerCase()
    
  }
})