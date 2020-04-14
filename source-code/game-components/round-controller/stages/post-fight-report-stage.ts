
import { Subject } from "rxjs";
import Game from "../../game";
import { RoundController } from "../round-controller";
import IStage from "../../../interfaces/game/stage";
import RoundStages from "../../../types/game/round-stages";
import gameConfiguration from "../../../game-settings/game-configuration";

export default class PostFightReportStage implements IStage {
  name: RoundStages = 'Post Fight Report'
  uIUpdateSubject: Subject<void> = new Subject()
  finished: Subject<void> = new Subject();
  
  constructor(private game: Game, private roundController: RoundController){}

  start(): void {
    this.finished = new Subject();
    setTimeout(this.stageFinished.bind(this), gameConfiguration.stageDurations.postFightReport)  
  }

  stageFinished(){
    this.finished.next()
    this.finished.complete()
  }
  
};
