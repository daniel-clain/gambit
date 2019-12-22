import Fight from "../../classes/game/fight/fight";
import RoundStages from "../../types/game/round-stages";
import { JobSeeker } from "../game-ui-state.interface";

export interface RoundState {
  number: number
  stage: RoundStages
  managerOptionsTimeLeft: number
  gameFinished: boolean
  activeJobSeekers: JobSeeker[]
  activeFight: Fight
}