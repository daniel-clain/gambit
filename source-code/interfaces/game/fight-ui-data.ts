import { FightReport } from "./fight-report";
import FighterFightState from "./fighter-fight-state-info";


export interface FightUiData{
  startCountdown: number
  timeRemaining: number
  report: FightReport
  fighters: FighterFightState[]
}