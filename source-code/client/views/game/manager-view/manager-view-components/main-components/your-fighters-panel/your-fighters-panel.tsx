import { observer } from "mobx-react"
import * as React from "react"
import { showFighter } from "../../../../../../front-end-service/front-end-service"
import { frontEndState } from "../../../../../../front-end-state/front-end-state"
import "../fighters-list.scss"

export const YourFightersPanel = observer(() => {
  const {
    serverUIState: { serverGameUIState },
  } = frontEndState
  const { fighters } = serverGameUIState!.playerManagerUIState!.managerInfo

  return (
    <div className="panel your-fighters">
      <div className="heading">Your Fighters</div>
      <div className="list fighter-list">
        {fighters.map((fighter) => {
          const hasRecontracted =
            fighter.activeContract.weeksRemaining == 0 &&
            frontEndState.serverUIState.serverGameUIState.playerManagerUIState.delayedExecutionAbilities.find(
              (a) => a.name == "Offer Contract" && a.target.name == fighter.name
            )
          return (
            <div
              className={`
            list__row ${hasRecontracted ? "is-expiring" : ""}
            `}
              key={fighter.name}
              onClick={() => showFighter(fighter.name)}
            >
              <span className="list__row__image"></span>
              <span className="list__row__name">{fighter.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
})
