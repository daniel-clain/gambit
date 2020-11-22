
import RoundStages from "../../types/game/round-stages";


export default interface IStage {
  name: RoundStages
  start(): Promise<void>
};
