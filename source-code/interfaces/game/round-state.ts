
import RoundStages from "../../types/game/round-stages";
import { JobSeeker } from "../game-ui-state.interface";
import Fight from "../../game-components/fight/fight";

export interface RoundState {
  number: number
  stage: RoundStages
  managerOptionsTimeLeft: number
  jobSeekers: JobSeeker[]
  activeFight: Fight,
}