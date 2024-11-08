import { useState } from "react"
import {
  ManagersBet,
  ManagerWinnings,
} from "../../../../../../../interfaces/front-end-state-interface"
import "./managers-bets.scss"
import { MoneyRain } from "./money-rain"
import { ResultInfo } from "../../../../../../../types/game/ui-fighter-state"

interface ManagersBetProps {
  managersBets: ManagersBet[]
  managersWinnings?: ManagerWinnings[]
  result?: ResultInfo
  isDisplay?: boolean
}

export const ManagersBets_C = ({
  managersBets,
  managersWinnings,
  isDisplay,
  result,
}: ManagersBetProps) => {
  let [isHidden, setIsHidden] = useState(isDisplay ? false : true)

  const hasWinnings = managersWinnings?.some(({ winnings }) => winnings > 0)

  const managerWinnings = (manager: ManagersBet) => {
    return managersWinnings?.find((m) => m.managerName == manager.name)
      ?.winnings
  }

  return (
    <div
      className={`
      managers-bets 
      ${isHidden ? "is-hidden" : ""} 
      ${hasWinnings ? "has-winnings" : ""}
      ${result == "draw" ? "was-draw" : ""}
      `}
      onClick={() => setIsHidden(!isHidden)}
    >
      {managersBets?.map((manager) => (
        <div className="managers-bet" key={manager.name}>
          <MoneyRain money={managerWinnings(manager)} />
          <div className="managers-bet__manager">
            <div
              className={`managers-bet__manager__image managers-bet__manager__image--${manager.image
                .toLowerCase()
                .replace(" ", "-")}`}
            ></div>
            <div className="managers-bet__manager__name">{manager.name}</div>
          </div>
          {manager.bet ? (
            <div className="fighter-bet-on">
              <div className="fighter-bet-on__name">
                {manager.bet.fighterName}
              </div>
              <div className="fighter-bet-on__image"></div>
              <div className="fighter-bet-on__amount">{manager.bet.size}</div>
            </div>
          ) : (
            <div className="fighter-bet-on">No Bet</div>
          )}
        </div>
      ))}
    </div>
  )
}
