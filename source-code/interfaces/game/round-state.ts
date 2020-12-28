
import RoundStages from "../../types/game/round-stage.type";
import { JobSeeker } from "../server-game-ui-state.interface";
import Fight from "../../game-components/fight/fight";

export interface RoundUIState {
  number: number
  stage: RoundStages
  managerOptionsTimeLeft: number
  jobSeekers: JobSeeker[]
  activeFight: Fight,
}