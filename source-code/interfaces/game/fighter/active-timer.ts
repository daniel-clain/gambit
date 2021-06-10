import { TimerName } from "../../../types/fighter/timer-name";

export interface ActiveTimer{
  name: TimerName
  timeRemaining: number
  timeoutRef
  timeRemainingIntervalRef
}
