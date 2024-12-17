import { format, isAfter } from "date-fns"
import { ceil, round } from "lodash"
import { useCallback, useEffect, useRef, useState } from "react"

type Props = {
  serverStartTime: number
  serverTimeStep: number
  lastTimeStep: number
  maxFightDuration: number
  paused: boolean
}
export function useFightTimeHook({
  serverStartTime,
  serverTimeStep,
  lastTimeStep,
  maxFightDuration,
  paused,
}: Props) {
  const [countdownTime, setCountdownTime] = useState<number | undefined>()
  const [fightIsRunning, setFightIsRunning] = useState(false)
  const [fightIsOver, setFightIsOver] = useState(false)
  const [fightTimer, setFightTimer] = useState<number>(serverTimeStep)

  const fightTimerInterval = useRef<NodeJS.Timeout>()
  const timeUntilStartTimeout = useRef<NodeJS.Timeout>()
  const countdownTimeInterval = useRef<NodeJS.Timeout>()

  const doFightTimerInterval = useCallback(() => {
    const timeNow = Date.now()
    const diff = timeNow - serverStartTime
    const modulus1000Remainder = (diff + serverTimeStep) % 1000
    const modified1SecTimout = 1000 - modulus1000Remainder

    fightTimerInterval.current = setTimeout(() => {
      setFightTimer(() => {
        const timeNow = Date.now()
        const formattedNow = format(new Date(timeNow), "HH:mm:ss.SSS")
        console.log("formattedNow ", formattedNow)
        const diff = timeNow - serverStartTime

        const newTime = round(diff / 1000)
        console.log("fight time step", newTime)
        return newTime
      })
      doFightTimerInterval()
    }, modified1SecTimout)
  }, [serverTimeStep])

  useEffect(() => {
    setFightTimer(Math.floor(serverTimeStep))
  }, [serverTimeStep])

  useEffect(() => {
    return () => {
      console.log("time hook clearing timeouts")
      clearTimeout(fightTimerInterval.current)
      clearTimeout(timeUntilStartTimeout.current)
      clearTimeout(countdownTimeInterval.current)
    }
  }, [])

  useEffect(() => {
    const timeIsGreaterThanLastStep = fightTimer > lastTimeStep / 1000

    if (timeIsGreaterThanLastStep) {
      setFightIsOver(true)
      setFightIsRunning(false)
    } else {
      setFightIsOver(false)
    }
  }, [fightTimer, lastTimeStep])

  /* set time remaining loop */
  useEffect(() => {
    clearInterval(fightTimerInterval.current)
    if (fightIsRunning) {
      doFightTimerInterval()
    }
  }, [fightIsRunning])

  /* countdown and start */
  useEffect(() => {
    if (paused) {
      setFightIsRunning(false)
      clearTimeout(timeUntilStartTimeout.current)
      clearTimeout(countdownTimeInterval.current)
    }
  }, [paused])

  useEffect(() => {
    if (!startTimeInTheFuture()) {
      startTheFight()
    } else {
      const msUntilFightStarts = serverStartTime - Date.now()
      timeUntilStartTimeout.current = setTimeout(() => {
        startTheFight()
      }, msUntilFightStarts)

      doCountdown()
    }
  }, [serverStartTime])

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
    localTimeStep: fightTimer * 1000,
  }

  function startTheFight() {
    const startTime = Date.now()
    const formattedStart = format(new Date(startTime), "HH:mm:ss.SSS")
    console.log("start at ", startTime, formattedStart)
    setFightIsRunning(true)
  }

  function startTimeInTheFuture() {
    const startTimeDate = new Date(serverStartTime)
    const isInFuture = isAfter(startTimeDate, new Date())
    if (!isInFuture) {
      console.error(
        `startTime should never not be in the future \nstartTime: ${startTimeDate}\nverify time: ${new Date()}`
      )
      return false
    }
    return true
  }

  async function doCountdown() {
    const msUntilFightStarts = serverStartTime - Date.now()

    const remainderTime = msUntilFightStarts % 1000
    console.log("remainderTime", remainderTime)
    const secondsAfterRemainder = msUntilFightStarts - remainderTime
    console.log("secondsAfterRemainder", secondsAfterRemainder)
    setCountdownTime(ceil(msUntilFightStarts / 1000))
    // eg if 2500, coundown time should be 3

    if (remainderTime) {
      await waitRemainderTime()
    }
    if (secondsAfterRemainder) {
      countdownTimeInterval.current = setInterval(() => {
        setCountdownTime((currentCountdownTime) => {
          if (currentCountdownTime === undefined) {
            console.error("currentCountdownTime should not be undefined")
            return undefined
          } else {
            if (currentCountdownTime <= 0) {
              clearInterval(countdownTimeInterval.current)
              return undefined
            }
            return currentCountdownTime - 1
          }
        })
      }, 1000)
    }

    function waitRemainderTime() {
      return new Promise<void>((resolve) => {
        countdownTimeInterval.current = setTimeout(() => {
          const msUntilFightStarts = serverStartTime - Date.now()
          console.log("after remainder time, time diff is", msUntilFightStarts)
          setCountdownTime(round(msUntilFightStarts / 1000))
          resolve()
        }, remainderTime)
      })
    }
  }
}
