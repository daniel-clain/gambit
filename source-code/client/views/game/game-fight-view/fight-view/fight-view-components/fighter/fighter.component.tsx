import FighterModelImage from "../../../../../../../interfaces/game/fighter/fighter-model-image"
import {
  FighterSchedule,
  FighterUiTimeStamp,
} from "../../../../../../../types/game/ui-fighter-state"
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
  fighterSchedule: FighterSchedule
  arenaWidth: number
  soundOn: boolean
  fightTimeStep: number
}

export const FighterComponent = ({
  fighterSchedule,
  arenaWidth,
  soundOn,
  fightTimeStep,
}: Props) => {
  //original octagon width height
  const originalWidth = 782
  const originalHeight = 355
  const widthHeightRatio = originalHeight / originalWidth

  const { fighterName, fighterTimeStamps } = fighterSchedule
  console.log("fightTimeStep", fighterName, fightTimeStep)
  const currentTimeStamp: FighterUiTimeStamp = fighterTimeStamps.reduce(
    (currentTimeStamp: FighterUiTimeStamp | undefined, t) => {
      if (!currentTimeStamp) return t
      if (t.startTimeStep > fightTimeStep) return currentTimeStamp
      return t
    },
    undefined
  )!

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
    console.log(`play sound ${soundMade}`)
    switch (soundMade) {
      case "punch":
        punchSound.play().catch(soundDidntPlay)
        break
      case "kick":
        kickSound.play().catch(soundDidntPlay)
        break
      case "dodge":
        dodgeSound.play().catch(soundDidntPlay)
        break
      case "block":
        blockSound.play().catch(soundDidntPlay)
        break
    }
  }

  function soundDidntPlay(e: unknown) {
    console.log("sound didnt play :>> ", e)
    debugger
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
    : energyState == "high"
    ? "brightness(1.1)"
    : energyState == "low"
    ? "brightness(.9) hue-rotate(10deg)"
    : actionName == "desperate retreat"
    ? "hue-rotate(180deg)"
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
