import { Subject } from "rxjs";
import RoundStages from "../../types/game/round-stages";


export default interface IStage {
  name: RoundStages
  start(): void
  finished: Subject<void>
  uIUpdateSubject: Subject<void>
};
