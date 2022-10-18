import { WeekStage } from "../../types/game/week-stage.type";



export default interface IStage {
  name: WeekStage
  pause: () => void
  unpause: () => void
  start(): Promise<void>
};
