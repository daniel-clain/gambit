import { TimerName } from "../../../types/figher/timer-name";

export interface ActiveTimer{
  name: TimerName
  cancel: (reason?: any) => void
  timeRemaining: number
}
