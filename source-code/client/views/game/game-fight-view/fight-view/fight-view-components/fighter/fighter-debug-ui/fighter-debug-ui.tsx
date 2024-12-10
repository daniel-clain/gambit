import { round } from "lodash"
import { CSSProperties } from "react"
import FighterModelImage from "../../../../../../../../interfaces/game/fighter/fighter-model-image"
import { FighterUiTimeStamp } from "../../../../../../../../types/game/ui-fighter-state"
import { defaultSkinModelImages } from "../../../../../../../images/fight-view/fighter/default-skin/default-skin-model-images"
import { fastSkinModelImages } from "../../../../../../../images/fight-view/fighter/fast-skin/fast-skin-model-images"
import { muscleSkinModelImages } from "../../../../../../../images/fight-view/fighter/muscle-skin/muscle-skin-model-images"
import "./fighter-debug-ui.scss"

type Props = {
  currentTimeStamp: FighterUiTimeStamp
  heightRatio: number
  isOn: boolean
}
export function FighterDebugUi({ isOn, currentTimeStamp, heightRatio }: Props) {
  if (!isOn) return null

  const {
    actionName,
    uiFighterState: {
      modelState,
      skin,
      debuggingState: {
        flanked,
        movingDirection,
        maxStamina,
        stamina,
        energy,
        maxEnergy,
      },
    },
    soundMade,
    startTimeStep,
  } = currentTimeStamp

  const isKnockedOut = modelState == "Knocked Out"
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

  const fighterNameStyle: CSSProperties = {
    bottom: fighterModelImage.dimensions.height * heightRatio + 20,
  }
  const directionStyle: CSSProperties = {
    transform: `rotate(${movingDirection}deg)`,
  }

  const staminaBarStyle: CSSProperties = {
    width: `${round((stamina / maxStamina) * 100)}%`,
  }
  const energyBarStyle: CSSProperties = {
    width: `${round((energy / maxEnergy) * 100)}%`,
  }
  /* debug related */

  /* const frontStrikingCenterStyle = {
    left: strikingCenters.front.x,
    bottom: strikingCenters.front.y,
  }
  const backStrikingCenterStyle = {
    left: strikingCenters.back.x,
    bottom: strikingCenters.back.y,
  } */

  return (
    <div className="debug-container">
      {flanked && !isKnockedOut && (
        <div className={`fighter__marker fighter__marker--flanked `} />
      )}
      <div className="debug-container__above">
        <div className="fighter__action" style={fighterNameStyle}>
          {actionName}
        </div>
        <div className="fighter__meter-bar is-stamina-bar">
          <div
            className="fighter__meter-bar__inner-bar"
            style={staminaBarStyle}
          />
        </div>

        <div className="fighter__meter-bar is-energy-bar">
          <div
            className="fighter__meter-bar__inner-bar"
            style={energyBarStyle}
          />
        </div>
      </div>

      {!isKnockedOut && (
        <div className="fighter__direction" style={directionStyle} />
      )}
    </div>
  )
}
