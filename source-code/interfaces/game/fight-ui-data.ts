import { FightReport } from "./fight-report";
import FighterFightState from "./fighter-fight-state-info";
import { ManagerDisplayInfo } from "../game-ui-state.interface";
import { ManagersBet } from "./managers-bet";


export interface FightUiData{
  startCountdown: number
  timeRemaining: number
  report: FightReport
  fighters: FighterFightState[]
  managersBets: ManagersBet[]
}