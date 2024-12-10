import { observer } from "mobx-react"
import { useEffect } from "react"
import { ManagerDisplayInfo } from "../../../interfaces/front-end-state-interface"
import { frontEndState } from "../../front-end-state/front-end-state"
import { DisconnectedPlayerModal } from "./disconnected-player-modal/disconnected-player-modal"
import { FinalTournament_View } from "./final-tournament/final-tournament.view"
import { GameFight_View } from "./game-fight-view/game-fight.view"
import { DisplayManagerOptionsUi } from "./manager-view/display-manager-options-ui/display-manager-options-ui"
import { Manager_View } from "./manager-view/manager.view"
import { PostGame_View } from "./post-game/post-game.view"
import { PreFightNews_View } from "./pre-fight-news-view/pre-fight-news.view"
import { ShowVideo_View } from "./show-video-view/show-video.view"

export const Game_View = observer(() => {
  const {
    clientUIState: {
      clientPreGameUIState: { clientName },
    },
    serverUIState: { serverGameUIState },
  } = frontEndState

  const {
    displayManagerUiData,
    disconnectedPlayerVotes,
    weekStage,

    selectedVideo,
    gameFinishedData,
    playerManagerUIState,
    fightDayState,
    finalTournamentState,
  } = serverGameUIState!

  const isDisplay = clientName == "Game Display"

  useEffect(() => {
    window.onbeforeunload = function () {
      return true
    }
  })

  let fighterRetired: boolean
  if (clientName != "Game Display") {
    fighterRetired = playerManagerUIState!.managerInfo.retired
  }

  const getActiveView = () => {
    if (selectedVideo) {
      return <ShowVideo_View {...{ selectedVideo }} />
    }
    if (finalTournamentState) {
      return <FinalTournament_View {...{ finalTournamentState, isDisplay }} />
    }
    if (gameFinishedData) {
      return <PostGame_View />
    }
    switch (weekStage) {
      case "Manager Options":
        return clientName == "Game Display" || fighterRetired ? (
          fighterRetired ? (
            <DisplayManagerOptionsUi
              {...{
                timeLeft: playerManagerUIState!.managerOptionsTimeLeft!,
                jobSeekers: playerManagerUIState!.jobSeekers,
                nextFightFighters: playerManagerUIState!.nextFightFighters,
                managersDisplayInfo: getRetiredManagerDisplayInfo(),
              }}
            />
          ) : (
            <DisplayManagerOptionsUi {...displayManagerUiData!} />
          )
        ) : (
          <Manager_View />
        )
      case "Pre Fight News":
        return <PreFightNews_View />
      case "Fight Day":
        return <GameFight_View />
      default:
        return <div>no week stage, something went wrong</div>
    }
  }

  return (
    <div id="Gambit">
      {disconnectedPlayerVotes && disconnectedPlayerVotes.length > 0 ? (
        <DisconnectedPlayerModal />
      ) : (
        ""
      )}
      {getActiveView()}
    </div>
  )

  function getRetiredManagerDisplayInfo(): ManagerDisplayInfo[] {
    const {
      managerInfo: { otherManagers },
      otherPlayersReady,
    } = playerManagerUIState!
    return [
      ...[],
      ...otherManagers.map((manager): ManagerDisplayInfo => {
        return {
          name: manager.name,
          image: manager.image,
          ready: otherPlayersReady.find((p) => p.name == manager.name)!.ready,
        }
      }),
    ]
  }
})
