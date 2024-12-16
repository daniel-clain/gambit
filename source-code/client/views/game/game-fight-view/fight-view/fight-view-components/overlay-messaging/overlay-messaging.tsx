import { format } from "date-fns"
import { orderBy } from "lodash"
import { useEffect, useRef, useState } from "react"
import {
  CommentarySchedule,
  ResultInfo,
} from "../../../../../../../types/game/ui-fighter-state"
import { FightStartAnimation } from "./fight-start-animation/fight-start-animation"

interface Props {
  timeRemaining: number | undefined
  countdownTime: number | undefined
  doStartAnimation: boolean
  soundOn: boolean
  setSoundOn: (val: boolean) => void
  hideSoundToggle?: boolean
  fightIsOver: boolean
  result: ResultInfo
  isDisplay: boolean
  fightTimer: number
  commentarySchedule: CommentarySchedule[]
  fightIsRunning: boolean
  serverStartTime: number
}

export const OverlayMessaging = ({
  timeRemaining,
  countdownTime,
  doStartAnimation,
  soundOn,
  setSoundOn,
  hideSoundToggle,
  fightIsOver,
  result,
  isDisplay,
  commentarySchedule,
  fightIsRunning,
  fightTimer,
  serverStartTime,
}: Props) => {
  const [currentComment, setCurrentComment] = useState<
    CommentarySchedule | undefined
  >()

  const commentaryTimeouts = useRef<NodeJS.Timeout[]>([])
  const currentTimeTimeInterval = useRef<NodeJS.Timeout>()
  const [startedTime, setStartedTime] = useState<string | undefined>()
  const [currentTime, setCurrentTime] = useState<string | undefined>()

  useEffect(() => {
    currentTimeTimeInterval.current = setInterval(() => {
      setCurrentTime(new Date().toISOString())
    }, 1000)
    return () => {
      clearInterval(currentTimeTimeInterval.current)
    }
  }, [])
  useEffect(() => {
    setStartedTime(new Date().toISOString())
    if (!isDisplay) return
    console.log("fightIsRunning", fightIsRunning)

    let orderedComments = orderBy(
      commentarySchedule,
      ["startTimeStep"],
      ["asc"]
    )
    let currentComment
    while (orderedComments.length > 0) {
      if (
        orderedComments[0].startTimeStep <= fightTimer &&
        orderedComments[0].startTimeStep >= fightTimer - 3000
      ) {
        currentComment = orderedComments.shift()!
      } else break
    }

    if (fightIsRunning) {
      commentaryTimeouts.current = orderedComments.map((stamp) => {
        const timeout = stamp.startTimeStep - fightTimer
        console.log(timeout, stamp.commentary)
        return setTimeout(() => {
          setCurrentComment(stamp)
        }, timeout)
      })
    } else {
      commentaryTimeouts.current.forEach((timeout) => clearTimeout(timeout))
      commentaryTimeouts.current = []
    }
    setCurrentComment(currentComment)
  }, [fightIsRunning])

  if (currentComment) {
    sayCommentary(currentComment?.commentary)
    setCurrentComment(undefined)
  }
  console.log("startedTime", startedTime)

  return (
    <>
      <div
        style={{ position: "absolute", zIndex: 100, backgroundColor: "white" }}
      >
        <div>
          server start time:{" "}
          {!serverStartTime
            ? "--"
            : format(new Date(serverStartTime), "HH:mm:ss.SSS")}
        </div>
        <div>
          current time:{" "}
          {!currentTime ? "--" : format(new Date(currentTime), "HH:mm:ss.SSS")}
        </div>
      </div>
      {doStartAnimation && (
        <FightStartAnimation {...{ doStartAnimation, soundOn }} />
      )}
      {!!countdownTime && (
        <div className="fight-ui__count-down">{countdownTime}</div>
      )}
      {countdownTime == undefined && !fightIsOver && (
        <div className="fight-ui__time-remaining">
          Time Remaining: {timeRemaining}
        </div>
      )}
      {fightIsOver &&
        (result == "draw" ? (
          <div className="fight-ui__winner">Fight Was A Draw</div>
        ) : (
          <div className="fight-ui__winner">{result.winner.name} Wins!</div>
        ))}
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
  function sayCommentary(message: string) {
    const comentaryMessage = new SpeechSynthesisUtterance(message)
    const voices = speechSynthesis.getVoices()
    comentaryMessage
    const comentatorsVoice = voices.find(
      (voice) => voice.name == "Google UK English Male"
    )

    if (comentatorsVoice) {
      comentaryMessage.voice = comentatorsVoice
    }
    comentaryMessage.pitch = 0.6
    comentaryMessage.rate = 1.3
    setTimeout(() => {
      speechSynthesis.speak(comentaryMessage)
    }, 0)
  }
}
