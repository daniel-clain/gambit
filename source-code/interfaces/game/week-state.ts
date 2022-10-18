
import { JobSeeker } from "../front-end-state-interface";
import Fight from "../../game-components/abilities-general/fight/fight";
import { WeekStage } from "../../types/game/week-stage.type";

export interface WeekUIState {
  number: number
  stage: WeekStage
  managerOptionsTimeLeft: number
  jobSeekers: JobSeeker[]
  activeFight: Fight,
}