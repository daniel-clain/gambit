import { toJS } from "mobx"
import { observer } from "mobx-react"
import { frontEndState } from "../../../front-end-state/front-end-state"
import { FighterStates } from "./fight-view/fight-view-components/fighter-states/fighter-states"
import { ManagersBets_C } from "./fight-view/fight-view-components/managers-bets/managers-bets"
import { Fight_View } from "./fight-view/fight.view"
import "./game-fight.view.scss"
export const GameFight_View = observer(() => {
  const {
    serverUIState: { serverGameUIState },
    clientUIState: {
      clientPreGameUIState: { clientName },
    },
  } = frontEndState

  const isDisplay = clientName == "Game Display"

  const { fightDayState, hasGameDisplay } = serverGameUIState!

  const {
    fightUiState,
    managersWinnings,
    managersBets,
    knownFighterStateData,
  } = fightDayState!

  console.log("ggg fightUiState", toJS(fightUiState))

  return (
    <div
      className={`
      game-fight-ui
      ${managersWinnings?.some((m) => m.winnings > 0) ? "has-winnings" : ""}
    `}
    >
      {fightUiState && (
        <Fight_View
          {...{
            fightUiState,
            hideSoundToggle: hasGameDisplay && !isDisplay,
            isDisplay,
          }}
        />
      )}
      <FighterStates fighterStates={knownFighterStateData!} />
      <ManagersBets_C
        {...{
          result: fightUiState?.result,
          managersWinnings,
          managersBets,
          isDisplay,
        }}
      />
    </div>
  )
})
