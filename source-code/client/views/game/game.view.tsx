
import * as React from 'react';
import {Manager_View} from './manager-view/manager.view'
import {Fight_View} from './fight-view/fight.view'
import {PreFightNews_View} from './pre-fight-news-view/pre-fight-news.view'
import {DisconnectedPlayerModal} from './disconnected-player-modal/disconnected-player-modal'
import {DisplayManagerOptionsUi} from './manager-view/display-manager-options-ui/display-manager-options-ui';
import {ShowVideo_View} from './show-video-view/show-video.view';
import { frontEndState } from '../../front-end-state/front-end-state';
import { FinalTournament_View } from './final-tournament/final-tournament.view';
import { observer } from 'mobx-react';
import { websocketService } from '../../front-end-service/websocket-service';
import { PostGame_View } from './post-game/post-game.view';
import { useEffect } from 'react';



export const Game_View = observer(() => {
  const {
    clientUIState: { clientPreGameUIState: {clientName}},
    serverUIState: { serverGameUIState}
  } = frontEndState


  const {
    disconnectedPlayerVotes, weekStage, finalTournamentBoard, selectedVideo, gameFinishedData, playerManagerUIState
  } = serverGameUIState!

  
  useEffect(() => {
    window.onbeforeunload = function() {
      return true
    };
  })


  let fighterRetired
  if(clientName != 'Game Display'){
    fighterRetired = playerManagerUIState!.managerInfo.retired
  }

  const getActiveView = () => {
    if(selectedVideo){
      return <ShowVideo_View />
    }
    if(finalTournamentBoard){
      return <FinalTournament_View />
    }
    if(gameFinishedData){      
      return <PostGame_View/>
    }
    switch (weekStage) {
      case 'Manager Options': 
        return (clientName == 'Game Display' || fighterRetired) ?
          <DisplayManagerOptionsUi/> :
          <Manager_View />
      case 'Pre Fight News': return <PreFightNews_View />
      case 'Fight Day': return <Fight_View />
      default: return <div>
        no week stage, something went wrong</div>
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
})