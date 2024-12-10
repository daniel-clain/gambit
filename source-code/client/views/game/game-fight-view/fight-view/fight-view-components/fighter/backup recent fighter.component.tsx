import { orderBy } from "lodash"
import { useEffect, useMemo, useRef, useState } from "react"
import FighterModelImage from "../../../../../../../interfaces/game/fighter/fighter-model-image"
import { FighterUiTimeStamp } from "../../../../../../../types/game/ui-fighter-state"
import { defaultSkinModelImages } from "../../../../../../images/fight-view/fighter/default-skin/default-skin-model-images"
import { fastSkinModelImages } from "../../../../../../images/fight-view/fighter/fast-skin/fast-skin-model-images"
import { muscleSkinModelImages } from "../../../../../../images/fight-view/fighter/muscle-skin/muscle-skin-model-images"
import {
  defaultFighterImages,
  fastFighterImages,
  FighterImageObj,
  muscleFighterImages,
} from "../../../../../../images/images"
import {
  blockSound,
  dodgeSound,
  kickSound,
  punchSound,
} from "../../../../../../sound-effects/sound-effects"
import "./fighter.scss"

type Props = {
  fighterName: string
  fightIsRunning: boolean
  serverTimeStep: number
  fighterTimeStamps: FighterUiTimeStamp[]
  arenaWidth: number
  soundOn: boolean
}

export const FighterComponent = ({
  fighterName,
  fightIsRunning,
  serverTimeStep,
  fighterTimeStamps,
  arenaWidth,
  soundOn,
}: Props) => {
  const initial = useMemo(() => {
    let [currentTimeStamp, ...remainingTimeStamps] = orderBy(
      fighterTimeStamps,
      ["startTimeStep"],
      ["asc"]
    )

    while (remainingTimeStamps.length > 0) {
      if (remainingTimeStamps[0].startTimeStep <= serverTimeStep) {
        currentTimeStamp = remainingTimeStamps.shift()!
      } else break
    }

    return { currentTimeStamp, remainingTimeStamps }
  }, [])

  const [handlingSync, setSetHandlingSync] = useState(false)

  const [currentTimeStamp, setCurrentTimeStamp] = useState<FighterUiTimeStamp>(
    initial.currentTimeStamp
  )
  const [remainingTimeStamps, setRemainingTimeStamps] = useState<
    FighterUiTimeStamp[]
  >(initial.remainingTimeStamps)

  const nextTimeStampTimeout = useRef<NodeJS.Timeout>()

  /* const x = useMemo(() => {
    if (fighterName == "Intelligent") {
      console.log(`~~Intelligent currentTimeStamp updated`, currentTimeStamp)
    }
  }, [currentTimeStamp])

  const y = useMemo(() => {
    if (fighterName == "Intelligent") {
      console.log(
        `--Intelligent remainingTimeStamps updated`,
        remainingTimeStamps
      )
    }
  }, [remainingTimeStamps]) */

  useEffect(() => {
    setSetHandlingSync(true)
    console.log("time step sync", timeStepSync)
    clearTimeout(nextTimeStampTimeout.current)

    const latest = fighterTimeStamps.reduce(
      ({ currentTimeStamp, remainingTimeStamps }, loopTimeStamp) => {
        if (loopTimeStamp.startTimeStep <= timeStepSync) {
          return { currentTimeStamp: loopTimeStamp, remainingTimeStamps }
        } else {
          remainingTimeStamps.push(loopTimeStamp)
          return { currentTimeStamp, remainingTimeStamps }
        }
      },
      {
        currentTimeStamp: {} as FighterUiTimeStamp,
        remainingTimeStamps: [] as FighterUiTimeStamp[],
      }
    )
    if (!latest.remainingTimeStamps.length) return
    setRemainingTimeStamps(latest.remainingTimeStamps)
    setCurrentTimeStamp(latest.currentTimeStamp)

    const [nextTimeStamp] = latest.remainingTimeStamps

    const timeToNext = nextTimeStamp.startTimeStep - timeStepSync
    console.log(
      "============== \n sync time to next stamp ",
      timeToNext,
      fighterName
    )
    console.log("current ", currentTimeStamp)
    console.log("next ", nextTimeStamp)

    nextTimeStampTimeout.current = setTimeout(() => {
      setRemainingTimeStamps((remainingTimeStamps) => {
        const [nextTimeStamp, ...restOfTimeStamps] = remainingTimeStamps

        console.log(
          "sync finished, setting next ",
          fighterName,
          nextTimeStamp.actionName
        )
        /* if (fighterName == "Intelligent") {
            console.log(`time expired, setting next `, nextTimeStamp)
            console.log("restOfTimeStamps", restOfTimeStamps)
          } */

        /* 
            - if its normal and current is 50 and next is 175, then timeout is 125, but if its sync, and sync time is 115, then timeout is 60
          */
        setSetHandlingSync(false)
        setCurrentTimeStamp(nextTimeStamp)
        return restOfTimeStamps
      })
    }, timeToNext)
  }, [timeStepSync])

  useEffect(() => {
    console.log(
      "action: ",
      currentTimeStamp.actionName,
      fighterName,
      currentTimeStamp.startTimeStep
    )
  }, [currentTimeStamp])

  useEffect(() => {
    if (!fightIsRunning || handlingSync || !remainingTimeStamps.length) return

    const [nextTimeStamp] = remainingTimeStamps

    const timeToNext =
      nextTimeStamp.startTimeStep - currentTimeStamp.startTimeStep

    /* if (fighterName == "Intelligent") {
        console.log("remainingTimeStamps", remainingTimeStamps)
        console.log("current", currentTimeStamp)
        console.log("next", nextTimeStamp)
        console.log(`Intelligent timeToNext ${timeToNext}`)
      } */

    nextTimeStampTimeout.current = setTimeout(() => {
      setRemainingTimeStamps((remainingTimeStamps) => {
        if (remainingTimeStamps.length > 0) {
          const [nextTimeStamp, ...restOfTimeStamps] = remainingTimeStamps
          /* if (fighterName == "Intelligent") {
            console.log(`time expired, setting next `, nextTimeStamp)
            console.log("restOfTimeStamps", restOfTimeStamps)
          } */
          setCurrentTimeStamp(nextTimeStamp)
          return restOfTimeStamps
        }
        return remainingTimeStamps
      })
    }, timeToNext)

    return () => clearTimeout(nextTimeStampTimeout.current)
  }, [remainingTimeStamps.length])

  const {
    actionName,
    uiFighterState: {
      coords,
      facingDirection,
      modelState,
      onARampage,
      energyState,
      skin,
      spirit,
    },
    soundMade,
  } = currentTimeStamp

  const widthRatio = arenaWidth / originalWidth
  const heightRatio = (arenaWidth * widthHeightRatio) / originalHeight

  if (soundOn && soundMade) {
    switch (soundMade) {
      case "punch":
        punchSound.play()
        break
      case "kick":
        kickSound.play()
        break
      case "dodge":
        dodgeSound.play()
        break
      case "block":
        blockSound.play()
        break
    }
  }

  const getSkinModelImages = (): FighterModelImage[] => {
    switch (skin) {
      case "Default":
        return defaultSkinModelImages
      case "Muscle":
        return muscleSkinModelImages
      case "Fast":
        return fastSkinModelImages
    }
  }

  const fighterModelImages: FighterModelImage[] = getSkinModelImages()

  const fighterModelImage: FighterModelImage = fighterModelImages.find(
    (fighterModelImage: FighterModelImage) =>
      fighterModelImage.modelState == modelState
  )!

  const fighterHue = onARampage
    ? "hue-rotate(340deg)"
    : energyState == "low"
    ? "brightness(.9) hue-rotate(10deg)"
    : actionName == "desperate retreat"
    ? "brightness(1.5) hue-rotate(170deg)"
    : ""

  const fighterImageStyle = {
    transform:
      facingDirection === "left"
        ? `scalex(-1) translateX(50%)`
        : `scalex(1) translateX(-50%)`,
    filter: fighterHue,
    width: fighterModelImage.dimensions.width * widthRatio,
    paddingBottom: fighterModelImage.dimensions.height * heightRatio,
  }

  const fighterStyle = {
    left: coords.x * widthRatio,
    bottom: coords.y * heightRatio,
    zIndex: modelState == "Knocked Out" ? 0 : 1000 - Math.round(coords.y),
  }
  const fighterNameStyle = {
    bottom: fighterModelImage.dimensions.height * heightRatio + 20,
  }

  const fighterImageObjs: FighterImageObj[] =
    skin == "Muscle"
      ? muscleFighterImages
      : skin == "Fast"
      ? fastFighterImages
      : defaultFighterImages

  return (
    <>
      <div
        key="fighter"
        className="fighter"
        id={fighterName}
        style={fighterStyle}
      >
        <div className="fighter__name" style={fighterNameStyle}>
          {fighterName}
          {modelState != "Knocked Out" ? (
            <span className="fighter__spirit">
              {spirit == 5
                ? "😈"
                : spirit == 4
                ? "😁"
                : spirit == 3
                ? "🙂"
                : spirit == 2
                ? "😐"
                : spirit == 1
                ? "😟"
                : spirit == 0
                ? "😨"
                : "👽"}
            </span>
          ) : (
            ""
          )}
        </div>
        <div
          className={`fighter__image-container fighter__image--${modelState
            .toLocaleLowerCase()
            .split(" ")
            .join("-")}`}
          style={fighterImageStyle}
        >
          {fighterImageObjs.map((imageObj) => (
            <img
              key={imageObj.modelState}
              className={`fighter__image`}
              src={imageObj.image}
              style={
                modelState == imageObj.modelState
                  ? { visibility: "visible" }
                  : {}
              }
            />
          ))}
        </div>
      </div>
    </>
  )
}

//original octagon width height
const originalWidth = 782
const originalHeight = 355
const widthHeightRatio = originalHeight / originalWidth
