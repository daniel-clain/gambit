import { useEffect, useState } from "react"
import { wait } from "../../../../../../../../helper-functions/helper-functions"
import { fightSound } from "../../../../../../../sound-effects/sound-effects"

type FightExplosionAnimationStages =
  | "start"
  | "grow"
  | "shrink-and-fade"
  | "removed"

export const FightStartAnimation = ({
  doStartAnimation,
  soundOn,
}: {
  doStartAnimation: boolean
  soundOn: boolean
}) => {
  const doFightExplosionAnimation = async () => {
    setFightExplosionAnimationStage("start")
    await wait(400)
    setFightExplosionAnimationStage("grow")
    await wait(800)
    setFightExplosionAnimationStage("shrink-and-fade")
    await wait(400)
    setFightExplosionAnimationStage("removed")
  }

  useEffect(() => {
    if (soundOn) {
      fightSound.play().catch(() => null)
    }
    doFightExplosionAnimation()
  }, [doStartAnimation])

  const [fightExplosionAnimationStage, setFightExplosionAnimationStage] =
    useState<FightExplosionAnimationStages>("removed")

  return (
    <div
      className={`fight-explosion fight-explosion--${fightExplosionAnimationStage}`}
    >
      <div className="fight-explosion__inner"></div>
    </div>
  )
}
