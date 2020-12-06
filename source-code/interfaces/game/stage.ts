
import RoundStages from "../../types/game/round-stage.type";


export default interface IStage {
  name: RoundStages
  start(): Promise<void>
};
