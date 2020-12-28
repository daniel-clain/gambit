import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import {connect} from 'react-redux'
import { DisconnectedPlayerVote } from '../../../interfaces/server-game-ui-state.interface';
import RoundStage from '../../../types/game/round-stage.type';
import { FrontEndState } from '../../front-end-state/front-end-state';
import Manager_View from './manager-view/manager.view'
import Fight_View from './fight-view/fight.view'
import PreFightNews_View from './pre-fight-news-view/pre-fight-news.view'
import DisconnectedPlayerModal from './disconnected-player-modal/disconnected-player-modal'



interface GameProps {
  roundStage: RoundStage
  disconnectedPlayerVotes: DisconnectedPlayerVote[]
}


const Game_View = ({
  roundStage, disconnectedPlayerVotes
}: GameProps) => {

  const getActiveView = () => {
    switch (roundStage) {
      case 'Manager Options': return <Manager_View />
      case 'Pre Fight News': return <PreFightNews_View />
      case 'Fight Day': return <Fight_View />
      case 'Post Fight Report': return <div>
        Post Fight Report</div>
      default: return <div>
        no round stage, something went wrong</div>
    }
  }

  return (
    <div id='Gambit'>
      {disconnectedPlayerVotes?.length > 0 ?
        <DisconnectedPlayerModal /> : ''
      }
      
      {getActiveView()}
    </div>
  )
}

const mapStateToProps = ({
  serverUIState: { serverGameUIState: {
    disconnectedPlayerVotes, roundStage
  }}
}: FrontEndState) => ({
  disconnectedPlayerVotes,
  roundStage
})

export default hot(connect(mapStateToProps)(Game_View))