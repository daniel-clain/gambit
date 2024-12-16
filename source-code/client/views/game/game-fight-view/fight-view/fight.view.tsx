import { toJS } from "mobx"
import { useEffect, useMemo, useState } from "react"
import { FightUiState } from "../../../../../types/game/ui-fighter-state"
import { ArenaUi } from "./fight-view-components/arena-ui/arena-ui"
import { FighterComponent } from "./fight-view-components/fighter/fighter.component"
import { OverlayMessaging } from "./fight-view-components/overlay-messaging/overlay-messaging"
import { useFightTimeHook } from "./fight-view-hooks/fight-time-hook"
import "./fight.view.scss"
type Props = {
  fightUiState: FightUiState
  isDisplay: boolean
  hideSoundToggle?: boolean
}

export const Fight_View = ({
  fightUiState,
  hideSoundToggle,
  isDisplay,
}: Props) => {
  const [soundOn, setSoundOn] = useState(true)
  const [arenaWidth, setArenaWidth] = useState<number>()

  const {
    startTime: serverStartTime,
    fightersSchedule,
    paused,
    fightTimeStep: serverTimeStep,
    maxFightDuration,
    result,
    lastTimeStep,
    commentarySchedule,
  } = fightUiState

  const {
    countdownTime,
    timeRemaining,
    doStartAnimation,
    fightIsOver,
    fightIsRunning,
    fightTimer,
  } = useFightTimeHook({
    serverStartTime,
    serverTimeStep,
    lastTimeStep,
    maxFightDuration,
    paused,
  })

  /* 
    - current step is always relative to time passed since start time
    - fighter state updates are not based on polling, theyre based on timeouts since start time

  
  */

  useEffect(() => {
    console.log("fightUiState", toJS(fightUiState))
  }, [fightUiState])

  const fighters = useMemo(() => {
    if (!arenaWidth) return ""
    return fightersSchedule.map(({ fighterName, fighterTimeStamps }) => {
      return (
        <FighterComponent
          key={fighterName}
          {...{
            fighterName,
            fightIsRunning,
            serverTimeStep,
            fightTimer,
            fighterTimeStamps,
            arenaWidth,
            soundOn,
          }}
        />
      )
    })
  }, [fightIsRunning, arenaWidth])

  return (
    <div className={`fight-ui`}>
      <OverlayMessaging
        {...{
          serverStartTime,
          timeRemaining,
          countdownTime,
          doStartAnimation,
          soundOn,
          setSoundOn,
          hideSoundToggle,
          fightIsOver,
          result,
          commentarySchedule,
          isDisplay,
          fightIsRunning,
          fightTimer,
        }}
      />

      <ArenaUi
        {...{
          arenaWidth,
          setArenaWidth,
        }}
      >
        {fighters}
      </ArenaUi>
    </div>
  )
}
