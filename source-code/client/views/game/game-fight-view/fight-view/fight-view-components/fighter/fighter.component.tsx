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
import { FighterDebugUi } from "./fighter-debug-ui/fighter-debug-ui"
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
  const [currentTimeStamp, setCurrentTimeStamp] = useState<FighterUiTimeStamp>()

  const timeStampTimeouts = useRef<NodeJS.Timeout[]>([])

  useEffect(() => {
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

    if (fightIsRunning) {
      timeStampTimeouts.current = remainingTimeStamps.map((stamp) => {
        const timeout = stamp.startTimeStep - serverTimeStep
        return setTimeout(() => {
          setCurrentTimeStamp(stamp)
        }, timeout)
      })
    } else {
      timeStampTimeouts.current.forEach((timeout) => clearTimeout(timeout))
      timeStampTimeouts.current = []
    }
    setCurrentTimeStamp(currentTimeStamp)
  }, [fightIsRunning])

  const fighterJsx = useMemo(() => {
    if (!currentTimeStamp) return <></>
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
        affliction,
      },
      soundMade,
      startTimeStep,
    } = currentTimeStamp

    const isBeingSick = affliction == "be sick"
    const isFlinching = affliction == "flinch"
    const isHallucinating = affliction == "hallucinations"

    if (isHallucinating) {
      console.log(fighterName, isHallucinating)
    }
    if (isFlinching) {
      console.log(fighterName, isFlinching)
    }
    if (isBeingSick) {
      console.log(fighterName, isBeingSick)
    }

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

    const fighterModelImages: FighterModelImage[] = (() => {
      switch (skin) {
        case "Default":
          return defaultSkinModelImages
        case "Muscle":
          return muscleSkinModelImages
        case "Fast":
          return fastSkinModelImages
      }
    })()

    const fighterModelImage: FighterModelImage = fighterModelImages.find(
      (fighterModelImage: FighterModelImage) =>
        fighterModelImage.modelState == modelState
    )!

    const fighterHue = isHallucinating
      ? "hue-rotate(240deg)"
      : isBeingSick
      ? "hue-rotate(110deg)"
      : onARampage
      ? "hue-rotate(340deg)"
      : isFlinching
      ? "brightness(1.2)  hue-rotate(340deg)"
      : energyState == "low"
      ? "brightness(.9) hue-rotate(10deg)"
      : actionName == "desperate retreat"
      ? "brightness(1.5) hue-rotate(170deg)"
      : ""

    const fighterImageStyle = {
      transform: facingDirection === "left" ? `scalex(-1)` : `scalex(1)`,
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

    const isKnockedOut = modelState == "Knocked Out"

    return (
      <div
        key="fighter"
        className="fighter"
        id={fighterName}
        style={fighterStyle}
      >
        <div className="fighter__container">
          <FighterDebugUi {...{ isOn: true, currentTimeStamp, heightRatio }} />
          <div className="fighter__above-text-container">
            <div className="fighter__name" style={fighterNameStyle}>
              {fighterName}
              {!isKnockedOut ? (
                <span className="fighter__spirit">
                  {isBeingSick
                    ? "🤮"
                    : isFlinching
                    ? "😖"
                    : isHallucinating
                    ? "😱"
                    : spirit == 5
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
      </div>
    )
  }, [currentTimeStamp, arenaWidth])

  return fighterJsx
}

//original octagon width height
const originalWidth = 782
const originalHeight = 355
const widthHeightRatio = originalHeight / originalWidth
