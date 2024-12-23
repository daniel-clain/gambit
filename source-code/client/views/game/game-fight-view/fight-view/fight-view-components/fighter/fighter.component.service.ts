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
  const nowTimeIsAfterStartTime = unixNow > serverStartTime

  let nowTimeStep: number

  if (nowTimeIsAfterStartTime) {
    const startTimeDiff = unixNow - serverStartTime
    nowTimeStep = startTimeDiff + serverTimeStep
  } else {
    nowTimeStep = serverTimeStep
  }

  const lastStampIndex = fighterTimeStamps.length - 1

  const lastTimeStep = fighterTimeStamps[lastStampIndex]

  const remainingTimeStamps = fighterTimeStamps.filter(
    (s) => s.startTimeStep > nowTimeStep
  )
  // assumes stamps are in order of start time
  const currentTimeStamp =
    nowTimeStep > lastTimeStep.startTimeStep
      ? lastTimeStep
      : fighterTimeStamps.find(
          (loopStamp, loopStampIndex) =>
            loopStampIndex != lastStampIndex &&
            nextStamp(loopStampIndex).startTimeStep > nowTimeStep
        )!

  return { currentTimeStamp, remainingTimeStamps }

  function nextStamp(stampIndex: number) {
    return fighterTimeStamps[stampIndex + 1]
  }
}
