import { observer } from "mobx-react"
import { useEffect, useState } from "react"
import gameConfiguration from "../../../../../../../game-settings/game-configuration"
import { websocketService } from "../../../../../../front-end-service/websocket-service"
import { frontEndState } from "../../../../../../front-end-state/front-end-state"
import ActionPoints from "../../partials/action-points/action-points"
import Money from "../../partials/money/money"
import "./headbar.scss"

export const Headbar = observer(() => {
  let { sendUpdate } = websocketService
  const {
    serverUIState: { serverGameUIState },
  } = frontEndState

  const {
    managerOptionsTimeLeft,
    managerInfo: { actionPoints, money, nextFightBet },
    otherPlayersReady,
    thisManagerReady,
  } = serverGameUIState!.playerManagerUIState!

  const { disconnectedPlayerVotes } = serverGameUIState!

  let [timeLeft, setTimeLeft] = useState(managerOptionsTimeLeft)
  let timeLeftTimeout: NodeJS.Timeout

  useEffect(() => {
    const playersDisconnected = disconnectedPlayerVotes?.length
    timeLeftTimeout = setTimeout(() => {
      if (timeLeft && !playersDisconnected) {
        setTimeLeft(--timeLeft)
      }
    }, 1000)

    return () => {
      clearTimeout(timeLeftTimeout)
    }
  }, [timeLeft])

  useEffect(() => {
    setTimeLeft(managerOptionsTimeLeft)
  }, [managerOptionsTimeLeft, disconnectedPlayerVotes])

  return (
    <div className="headbar">
      <div className="headbar__left">
        <div>Time: {isNaN(timeLeft!) ? "..." : timeLeft}</div>
      </div>
      {otherPlayersReady?.map(({ name, ready }) => (
        <div
          key={name}
          className={`
            player-ready
            player-ready${ready ? "--true" : "--false"}
          `}
        ></div>
      ))}
      <div className="headbar__right">
        <span className="finished-turn">
          Finished?
          <input
            type="checkbox"
            onChange={sendUpdate.toggleReady}
            defaultChecked={thisManagerReady}
          />
        </span>

        <Money
          money={
            nextFightBet
              ? money -
                Math.round(
                  (gameConfiguration.betSizePercentages[nextFightBet.size] /
                    100) *
                    money
                )
              : money
          }
        />
        <ActionPoints {...{ actionPoints }} />
      </div>
    </div>
  )
})
