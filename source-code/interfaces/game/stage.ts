import { RoundStage } from "../../types/game/round-stage.type";



export default interface IStage {
  name: RoundStage
  pause: () => void
  unpause: () => void
  start(): Promise<void>
};
