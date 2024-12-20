import { FighterUiTimeStamp } from "../../../../../../../types/game/ui-fighter-state"

export function getCurrentAndRemainingTimeStamps(
  fighterTimeStamps: FighterUiTimeStamp[],
  serverStartTime: number, // unix timestamp
  serverTimeStep: number
): {
  currentTimeStamp: FighterUiTimeStamp
  remainingTimeStamps: FighterUiTimeStamp[]
} {
  const unixNow = Date.now()
  const startTimeDiff = unixNow - serverStartTime
  console.log("startTimeDiff", startTimeDiff)

  const nowTimeStep = serverTimeStep + startTimeDiff

  const lastTimeStep = fighterTimeStamps[fighterTimeStamps.length - 1]

  const remainingTimeStamps = fighterTimeStamps.filter(
    (s) => s.startTimeStep > nowTimeStep
  )
  const currentTimeStamp =
    nowTimeStep > lastTimeStep.startTimeStep
      ? lastTimeStep
      : fighterTimeStamps.find(
          (s, i) =>
            i < fighterTimeStamps.length - 1 &&
            fighterTimeStamps[i + 1].startTimeStep > nowTimeStep
        )!

  return { currentTimeStamp, remainingTimeStamps }
}
