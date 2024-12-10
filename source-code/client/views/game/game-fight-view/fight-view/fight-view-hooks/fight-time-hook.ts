import { differenceInMilliseconds, isAfter } from "date-fns"
import { floor, round } from "lodash"
import { useCallback, useEffect, useRef, useState } from "react"

type Props = {
  startTime: string
  serverTimeStep: number
  lastTimeStep: number
  maxFightDuration: number
  paused: boolean
}
export function useFightTimeHook({
  startTime,
  serverTimeStep,
  lastTimeStep,
  maxFightDuration,
  paused,
}: Props) {
  const [countdownTime, setCountdownTime] = useState<number>()
  const [fightIsRunning, setFightIsRunning] = useState(false)
  const [fightIsOver, setFightIsOver] = useState(false)
  const [fightTimer, setFightTimer] = useState<number>(0)

  const fightTimerInterval = useRef<NodeJS.Timeout>()
  const countdownTimeInterval = useRef<NodeJS.Timeout>()

  const doFightTimerInterval = useCallback(() => {
    clearInterval(fightTimerInterval.current)
    fightTimerInterval.current = setInterval(() => {
      setFightTimer((currentFightTimer) => {
        console.log("currentFightTimer", currentFightTimer + 1)
        return currentFightTimer + 1
      })
    }, 1000)
  }, [serverTimeStep])

  useEffect(() => {
    const timeIsGreaterThanLastStep = fightTimer > lastTimeStep / 1000

    if (timeIsGreaterThanLastStep) {
      setFightIsOver(true)
      clearInterval(fightTimerInterval.current)
    } else {
      setFightIsOver(false)
    }
  }, [fightTimer, lastTimeStep])

  /* set time remaining loop */
  useEffect(() => {
    if (fightIsRunning) {
      doFightTimerInterval()
    }
  }, [fightIsRunning])

  /* countdown and start */
  useEffect(() => {
    if (paused) {
      setFightIsRunning(false)
      clearTimeout(fightTimerInterval.current)
      clearTimeout(countdownTimeInterval.current)
    }
  }, [paused])

  useEffect(() => {
    verifyStartTime()
    setFightTimer(floor(serverTimeStep / 1000))
    setFightIsRunning(false)
    doCountdown().then(() => {
      setFightIsRunning(true)
    })
  }, [startTime])

  const doStartAnimation = countdownTime === 0

  const timeRemaining =
    fightTimer == undefined ? undefined : maxFightDuration - fightTimer

  return {
    countdownTime,
    timeRemaining,
    doStartAnimation,
    fightIsOver,
    fightIsRunning,
    fightTimer,
  }

  function verifyStartTime() {
    const startTimeDate = new Date(startTime)
    const isInFuture = isAfter(startTimeDate, new Date())
    if (!isInFuture) {
      console.error(
        "startTime should never not be in the future",
        new Date(startTime),
        new Date()
      )
    }
  }

  function doCountdown(): Promise<void> {
    return new Promise((resolve) => {
      const initialTimeUntilStart = getTimeUntilStart()

      const remainderTime = initialTimeUntilStart % 1000

      setCountdownTime(round(initialTimeUntilStart / 1000))

      countdownTimeInterval.current = setTimeout(() => {
        setCountdownTime(round(getTimeUntilStart() / 1000))

        countdownTimeInterval.current = setInterval(() => {
          setCountdownTime((currentCountdownTime) => {
            if (currentCountdownTime === undefined) {
              console.error("currentCountdownTime should not be undefined")
              resolve()
              return undefined
            } else {
              if (currentCountdownTime == 0) {
                clearInterval(countdownTimeInterval.current)
                resolve()
                return undefined
              }
              return round(getTimeUntilStart() / 1000)
            }
          })
        }, 1000)
      }, remainderTime)

      function getTimeUntilStart() {
        return differenceInMilliseconds(new Date(startTime), new Date())
      }
    })
  }
}
