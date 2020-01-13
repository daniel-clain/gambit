import { TimerName } from "../../../types/figher/timer-name";

export interface Timer{
  name: TimerName
  duration: number
  afterEffect?: () => void
}