
import * as React from 'react';
import '../modal-card.scss';
import { connect, ConnectedProps } from 'react-redux';
import { hot } from 'react-hot-loader/root';
import { FrontEndState, GameFinishedData } from '../../../../interfaces/front-end-state-interface';


const mapState = ({serverUIState: {serverGameUIState: {
  gameFinishedData
}}
}: FrontEndState): {gameFinishedData: GameFinishedData} => ({gameFinishedData})


const connector = connect(mapState)
type PropsFromRedux = ConnectedProps<typeof connector>

export const GameFinished_View = connector(hot((
{gameFinishedData: {players, winner}}: PropsFromRedux
) => {
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
}))