import { FightReport } from "./fight-report";
import FighterFightState from "./fighter-fight-state-info";
import { ManagerDisplayInfo } from "../server-game-ui-state.interface";
import { ManagersBet } from "./managers-bet";
import { FighterStateData } from "../../client/views/game/fight-view/fight-results-view-components/fighter-states/fighter-states";


export interface FightUiData{
  startCountdown: number
  timeRemaining: number
  report: FightReport
  managersBets: ManagersBet[]
  fighterFightStates: FighterFightState[]
  knownFighterStates?: FighterStateData[]
}