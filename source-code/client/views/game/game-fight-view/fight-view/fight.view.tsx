import { toJS } from "mobx"
import { useEffect, useRef, useState } from "react"
import { FightUIState } from "../../../../../types/game/ui-fighter-state"
import "./fight.view.scss"
import { ArenaUi } from "./fight-view-components/arena-ui/arena-ui"
import { FighterComponent } from "./fight-view-components/fighter/fighter.component"
import { OverlayMessaging } from "./fight-view-components/overlay-messaging/overlay-messaging"
type Props = {
  fightUiState: FightUIState
  hideSoundToggle?: boolean
}
export const Fight_View = ({ fightUiState, hideSoundToggle }: Props) => {
  const {
    startTime,
    fightersSchedule,
    paused,
    fightTimeStep: serverTimeStep,
    maxFightDuration,
    result,
    lastTimeStep,
  } = fightUiState

  useEffect(() => {
    console.log("fightUiState", toJS(fightUiState))
  }, [fightUiState])

  const [workThroughSchedule, setWorkThroughSchedule] = useState(false)
  const [soundOn, setSoundOn] = useState(true)
  const [arenaWidth, setArenaWidth] = useState<number>()
  const [startCountdown, setStartCountdown] = useState<number>(
    new Date(startTime).getTime() - Date.now() / 1000
  )
  const [fightTimeStep, setFightTimeStep] = useState(serverTimeStep)

  if (fightTimeStep % 100 == 0) {
    console.log("fightTimeStep", fightTimeStep)
  }

  const timeStepInterval = useRef<NodeJS.Timeout>()
  const countdownInterval = useRef<NodeJS.Timeout>()

  const timeRemaining = Math.round(maxFightDuration - fightTimeStep / 1000)

  useEffect(() => {
    const timeUntilStart = new Date(startTime).getTime() - Date.now()

    setStartCountdown(Math.ceil(timeUntilStart / 1000))
    countdownInterval.current = setInterval(() => {
      setStartCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    const fightStartTimeout = setTimeout(() => {
      console.log("start interval")
      timeStepInterval.current = setInterval(() => {
        setFightTimeStep((current) => {
          if (current >= lastTimeStep) {
            clearInterval(timeStepInterval.current)
          }
          const nextTimeStep = current + 10
          return nextTimeStep
        })
      }, 10)
    }, timeUntilStart)

    return () => {
      clearInterval(countdownInterval.current)
      clearTimeout(fightStartTimeout)
      clearInterval(timeStepInterval.current)
    }
  }, [startTime, paused])

  const doStartAnimation = startCountdown == 0

  return (
    <div className={`fight-ui`}>
      <OverlayMessaging
        {...{
          timeRemaining,
          startCountdown,
          doStartAnimation,
          soundOn,
          setSoundOn,
          result,
          hideSoundToggle,
        }}
      />

      <ArenaUi
        {...{
          arenaWidth,
          setArenaWidth,
        }}
      >
        {arenaWidth ? (
          <div className="fighters">
            {fightersSchedule.map((fighterSchedule) => (
              <FighterComponent
                key={fighterSchedule.fighterName}
                {...{
                  fighterSchedule,
                  arenaWidth,
                  soundOn,
                  fightTimeStep,
                }}
              />
            ))}
          </div>
        ) : (
          ""
        )}
      </ArenaUi>
    </div>
  )
}
