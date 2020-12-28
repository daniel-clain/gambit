
import RoundStages from "../../types/game/round-stage.type";


export default interface IStage {
  name: RoundStages
  pause: () => void
  unpause: () => void
  start(): Promise<void>
};
