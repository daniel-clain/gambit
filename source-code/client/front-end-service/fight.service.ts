import { FighterSchedule } from "../../types/game/ui-fighter-state"

export function getLastTimeStep(fightersSchedule: FighterSchedule[]) {
  return fightersSchedule.reduce((lastTimeStep, schedule) => {
    const fightersLastTimeStep = schedule.fighterTimeStamps.reduce(
      (fightersLastTimeStep, { startTimeStep }) => {
        return startTimeStep > fightersLastTimeStep
          ? startTimeStep
          : fightersLastTimeStep
      },
      0
    )
    return fightersLastTimeStep > lastTimeStep
      ? fightersLastTimeStep
      : lastTimeStep
  }, 0)
}
