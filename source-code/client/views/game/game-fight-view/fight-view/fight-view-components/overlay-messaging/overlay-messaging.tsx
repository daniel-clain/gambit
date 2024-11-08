import { useEffect } from "react"
import { ResultInfo } from "../../../../../../../types/game/ui-fighter-state"
import { fightSound } from "../../../../../../sound-effects/sound-effects"
import { FightStartAnimation } from "./fight-start-animation/fight-start-animation"

interface Props {
  timeRemaining: number
  startCountdown: number
  doStartAnimation: boolean
  soundOn: boolean
  setSoundOn: (val: boolean) => void
  hideSoundToggle?: boolean
  result: ResultInfo
}

export const OverlayMessaging = ({
  timeRemaining,
  startCountdown,
  doStartAnimation,
  soundOn,
  setSoundOn,
  hideSoundToggle,
  result,
}: Props) => {
  useEffect(() => {
    if (doStartAnimation && soundOn) {
      fightSound.play().catch(() => null)
    }
  }, [doStartAnimation])

  return (
    <>
      {doStartAnimation && <FightStartAnimation {...{ doStartAnimation }} />}
      {startCountdown != 0 && (
        <div className="fight-ui__count-down">{startCountdown}</div>
      )}
      {startCountdown == 0 && timeRemaining != 0 && (
        <div className="fight-ui__time-remaining">
          Time Remaining: {timeRemaining}
        </div>
      )}
      {timeRemaining ? (
        <></>
      ) : result == "draw" ? (
        <div className="fight-ui__winner">Fight Was A Draw</div>
      ) : (
        <div className="fight-ui__winner">{result.winner.name} Wins!</div>
      )}
      <div className="turn-phone">
        <div className="turn-phone__message">
          Turn your phone to landscape view
        </div>
        <div className="turn-phone__image"></div>
      </div>
      {hideSoundToggle ? (
        ""
      ) : (
        <div
          className={`
          sound-icon
          sound-icon--${soundOn ? "on" : "off"}
        `}
          onClick={(_) => setSoundOn(!soundOn)}
        ></div>
      )}
    </>
  )
}
