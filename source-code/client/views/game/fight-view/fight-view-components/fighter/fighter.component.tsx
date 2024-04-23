import * as React from "react"
import { useState } from "react"
import FighterFightState from "../../../../../../interfaces/front-end-state-interface"
import FighterModelImage from "../../../../../../interfaces/game/fighter/fighter-model-image"
import SoundTime from "../../../../../../interfaces/game/fighter/sound-time"
import { defaultSkinModelImages } from "../../../../../images/fight-view/fighter/default-skin/default-skin-model-images"
import { fastSkinModelImages } from "../../../../../images/fight-view/fighter/fast-skin/fast-skin-model-images"
import { muscleSkinModelImages } from "../../../../../images/fight-view/fighter/muscle-skin/muscle-skin-model-images"
import {
  defaultFighterImages,
  fastFighterImages,
  FighterImageObj,
  muscleFighterImages,
} from "../../../../../images/images"
import {
  blockSound,
  criticalStrikeSound,
  dodgeSound,
  punchSound,
} from "../../../../../sound-effects/sound-effects"
import "./fighter.scss"

export const FighterComponent = ({
  fighterFightState,
  arenaWidth,
  sound,
}: {
  fighterFightState: FighterFightState
  arenaWidth: number
  sound: boolean
}) => {
  const [processedSounds, setProcessedSounds] = useState<SoundTime[]>([])
  //original octagon width height
  const originalWidth = 782
  const originalHeight = 355
  const widthHeightRatio = originalHeight / originalWidth
  // height: 355px;

  const widthRatio = arenaWidth / originalWidth
  const heightRatio = (arenaWidth * widthHeightRatio) / originalHeight

  const soundEffects = {
    punch: punchSound,
    criticalStrike: criticalStrikeSound,
    dodge: dodgeSound,
    block: blockSound,
  }

  const {
    name,
    coords,
    modelState,
    facingDirection,
    currentInterruptibleAction,
    soundsMade,
    onRampage,
    skin,
    strikingCenters,
    spirit,
    energy,
    direction,
    directionBasedOn,
  } = fighterFightState

  if (directionBasedOn)
    console.log(name + " directionBasedOn :>> ", directionBasedOn)

  const soundsToPlay = soundsMade.reduce<SoundTime[]>(
    (soundsToPlay, soundMade) => {
      if (processedSounds.some((sound) => sound.time == soundMade.time))
        return soundsToPlay
      if (
        !soundsToPlay.some(
          (sound: SoundTime) => sound.soundName == soundMade.soundName
        )
      ) {
        soundsToPlay.push(soundMade)
      }
      setProcessedSounds([...processedSounds, soundMade])
      return soundsToPlay
    },
    []
  )

  if (sound && soundsToPlay.length) {
    soundsToPlay.forEach((sound: SoundTime) => {
      const { punch, criticalStrike, dodge, block } = soundEffects
      switch (sound.soundName) {
        case "Punch":
          return punch.play().catch(soundDidntPlay)
        case "Critical Strike":
          return criticalStrike.play().catch(soundDidntPlay)
        case "Dodge":
          return dodge.play().catch(soundDidntPlay)
        case "Block":
          return block.play().catch(soundDidntPlay)
      }
    })
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

  const fighterImageStyle = {
    transform:
      facingDirection === "left"
        ? `scalex(-1) translateX(50%)`
        : `scalex(1) translateX(-50%)`,
    filter: `hue-rotate(${onRampage ? 340 : 0}deg)`,
    width: fighterModelImage.dimensions.width * widthRatio,
    paddingBottom: fighterModelImage.dimensions.height * heightRatio,
  }
  /* const fighterModelClass = `fighter__image--${skin.toLocaleLowerCase()}--${modelState.toLocaleLowerCase().split(' ').join('-')}` */

  const fighterStyle = {
    left: coords.x * widthRatio,
    bottom: coords.y * heightRatio,
    zIndex: modelState == "Knocked Out" ? 0 : 1000 - Math.round(coords.y),
  }
  const fighterNameStyle = {
    bottom: fighterModelImage.dimensions.height * heightRatio + 20,
  }
  const flankedStyle = {
    bottom: fighterModelImage.dimensions.height * heightRatio - 10,
  }
  const repositioningStyle = {
    bottom: fighterModelImage.dimensions.height * heightRatio - 10,
  }
  const trappedStyle = {
    bottom: fighterModelImage.dimensions.height * heightRatio - 10,
  }
  const directionStyle = {
    transform: `rotate(${direction}deg)`,
  }

  const frontStrikingCenterStyle = {
    left: strikingCenters.front.x,
    bottom: strikingCenters.front.y,
  }
  const backStrikingCenterStyle = {
    left: strikingCenters.back.x,
    bottom: strikingCenters.back.y,
  }

  const fighterImageObjs: FighterImageObj[] =
    skin == "Muscle"
      ? muscleFighterImages
      : skin == "Fast"
      ? fastFighterImages
      : defaultFighterImages

  return (
    <>
      <div key="fighter" className="fighter" id={name} style={fighterStyle}>
        <div className="fighter__name" style={fighterNameStyle}>
          {name}
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

          {/* modelState != 'Knocked Out' ?
					<div className='fighter__energy-bar'>
						<div 
							className='fighter__energy-bar__inner' 
							style={{width: `${Math.floor(energy * 10)}%` }}
						></div>
					</div>
				:'' */}
        </div>
        {directionBasedOn == "flanked" && (
          <div
            className="fighter__marker fighter__marker--flanked"
            style={flankedStyle}
          ></div>
        )}
        {directionBasedOn == "reposition" && (
          <div
            className="fighter__marker fighter__marker--reposition"
            style={repositioningStyle}
          ></div>
        )}
        {directionBasedOn == "between flankers" && (
          <div
            className="fighter__marker fighter__marker--between"
            style={repositioningStyle}
          ></div>
        )}
        {directionBasedOn == "away from fighter" && (
          <div
            className="fighter__marker fighter__marker--away"
            style={repositioningStyle}
          ></div>
        )}
        {directionBasedOn == "around edge" && (
          <div
            className="fighter__marker fighter__marker--around"
            style={repositioningStyle}
          ></div>
        )}

        <div className="fighter__direction" style={directionStyle}></div>
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
      ,
      <div key="strike-boxes">
        {modelState != "Knocked Out" && [
          <div
            key="front"
            className="striking-center"
            style={frontStrikingCenterStyle}
          >
            <div className="striking-range"></div>
          </div>,
          <div
            key="back"
            className="striking-center"
            style={backStrikingCenterStyle}
          >
            <div className="striking-range"></div>
          </div>,
        ]}
      </div>
    </>
  )
}
