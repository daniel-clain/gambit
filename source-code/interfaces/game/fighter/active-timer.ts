import { TimerName } from "../../../types/figher/timer-name";

export interface ActiveTimer{
  name: TimerName
  timeRemaining: number
  timeoutRef
  timeRemainingIntervalRef
}
