import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import {connect} from 'react-redux'
import { DisconnectedPlayerVote, FrontEndState } from '../../../interfaces/front-end-state-interface';
import {Manager_View} from './manager-view/manager.view'
import Fight_View from './fight-view/fight.view'
import PreFightNews_View from './pre-fight-news-view/pre-fight-news.view'
import DisconnectedPlayerModal from './disconnected-player-modal/disconnected-player-modal'
import { RoundStage } from '../../../types/game/round-stage.type';
import DisplayManagerOptionsUi from './manager-view/display-manager-options-ui/display-manager-options-ui';



interface GameProps {
  roundStage: RoundStage
  disconnectedPlayerVotes: DisconnectedPlayerVote[]
  clientName: string
}


const Game_View = ({
  roundStage, disconnectedPlayerVotes, clientName
}: GameProps) => {

  const getActiveView = () => {
    switch (roundStage) {
      case 'Manager Options': 
        return clientName == 'Game Display' ?
          <DisplayManagerOptionsUi/> :
          <Manager_View />
      case 'Pre Fight News': return <PreFightNews_View />
      case 'Fight Day': return <Fight_View />
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
  clientUIState: { clientPreGameUIState: {clientName}},
  serverUIState: { serverGameUIState: {
    disconnectedPlayerVotes, roundStage
  }}
}: FrontEndState) => ({
  disconnectedPlayerVotes,
  roundStage,
  clientName
})

export default hot(connect(mapStateToProps)(Game_View))