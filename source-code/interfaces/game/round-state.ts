
import { JobSeeker } from "../../interfaces/front-end-state-interface";
import Fight from "../../game-components/abilities-general/fight/fight";
import { RoundStage } from "../../types/game/round-stage.type";

export interface RoundUIState {
  number: number
  stage: RoundStage
  managerOptionsTimeLeft: number
  jobSeekers: JobSeeker[]
  activeFight: Fight,
}