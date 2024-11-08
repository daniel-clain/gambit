import { observer } from "mobx-react"
import { frontEndState } from "../../../front-end-state/front-end-state"
import { Fight_View } from "./fight-view/fight.view"
import "./game-fight.view.scss"
import { FighterStates } from "./fight-view/fight-view-components/fighter-states/fighter-states"
import { ManagersBets_C } from "./fight-view/fight-view-components/managers-bets/managers-bets"
export const GameFight_View = observer(() => {
  const {
    serverUIState: { serverGameUIState },
    clientUIState: {
      clientPreGameUIState: { clientName },
    },
  } = frontEndState

  const isDisplay = clientName == "Game Display"

  const { gameFightUIState, hasGameDisplay } = serverGameUIState!

  const {
    managersWinnings,
    managersBets,
    knownFighterStateData,
    ...fightUiState
  } = gameFightUIState

  return (
    <div
      className={`
      game-fight-ui
      
      ${managersWinnings?.some((m) => m.winnings > 0) ? "has-winnings" : ""}
    `}
    >
      <Fight_View
        {...{ fightUiState, hideSoundToggle: hasGameDisplay && !isDisplay }}
      />
      <FighterStates fighterStates={knownFighterStateData!} />
      <ManagersBets_C
        {...{
          result: fightUiState.result,
          managersWinnings,
          managersBets,
          isDisplay,
        }}
      />
    </div>
  )
})
