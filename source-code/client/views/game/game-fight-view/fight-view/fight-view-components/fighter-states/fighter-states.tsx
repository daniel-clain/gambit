import { useState } from "react"
import { FighterStateData } from "../../../../../../../interfaces/front-end-state-interface"
import "./fighter-states.scss"

export interface FighterStatesProps {
  fighterStates: FighterStateData[]
}

export const FighterStates = ({ fighterStates }: FighterStatesProps) => {
  let [isHidden, setIsHidden] = useState(true)
  return (
    <>
      <div
        className={`fighter-states ${isHidden ? "is-hidden" : ""}`}
        onClick={() => setIsHidden(!isHidden)}
      >
        {fighterStates?.map((fighter) => (
          <div className="fighter-state" key={fighter.name}>
            <div className="fighter-state__name">{fighter.name}</div>
            <div className="fighter-state__image"></div>
            {fighter && (
              <div className="fighter-state__stats">
                <div className="fighter-state__stats__fighter-stat fighter-state__stats__strength">
                  <span className="fighter-state__stats__fighter-stat__label">
                    Strength:
                  </span>
                  {fighter.strength
                    ? fighter.strength.lastKnownValue
                    : "unknown"}
                </div>
                <div className="fighter-state__stats__fighter-stat fighter-state__stats__fitness">
                  <span className="fighter-state__stats__fighter-stat__label">
                    Fitness:
                  </span>
                  {fighter.fitness ? fighter.fitness.lastKnownValue : "unknown"}
                </div>
                <div className="fighter-state__stats__fighter-stat fighter-state__stats__aggression">
                  <span className="fighter-state__stats__fighter-stat__label">
                    Aggression:
                  </span>
                  {fighter.aggression
                    ? fighter.aggression?.lastKnownValue
                    : "unknown"}
                </div>
                <div className="fighter-state__stats__fighter-stat fighter-state__stats__intelligence">
                  <span className="fighter-state__stats__fighter-stat__label">
                    Intelligence:
                  </span>
                  {fighter.intelligence
                    ? fighter.intelligence.lastKnownValue
                    : "unknown"}
                </div>
                <div className="fighter-state__stats__fighter-stat fighter-state__stats__fights">
                  <span className="fighter-state__stats__fighter-stat__label">
                    Fights:
                  </span>
                  {fighter.numberOfFights
                    ? fighter.numberOfFights.lastKnownValue
                    : "unknown"}
                </div>
                <div className="fighter-state__stats__fighter-stat fighter-state__stats__fights-won">
                  <span className="fighter-state__stats__fighter-stat__label">
                    Fights Won:
                  </span>
                  {fighter.numberOfWins
                    ? fighter.numberOfWins.lastKnownValue
                    : "unknown"}
                </div>
              </div>
            )}
            <div className="fighter-state__state">
              {fighter.hallucinating ||
                (fighter.sick && (
                  <div className="fighter-state__state__poisoned-icon"></div>
                ))}
              {fighter.injured && (
                <div className="fighter-state__state__injured-icon"></div>
              )}
              {fighter.doping && (
                <div className="fighter-state__state__doped-icon"></div>
              )}
              {fighter.takingADive && (
                <div className="fighter-state__state__dive-icon"></div>
              )}
              {fighter.hallucinating && (
                <div className="fighter-state__state__hallucinating-icon"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
