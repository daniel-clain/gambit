import IStage from "../../../interfaces/game/stage";
import { Subject } from "rxjs";
import Game from "../../game";
import { RoundController } from "../round-controller";
import RoundStages from "../../../types/game/round-stages";
import { NewsItem } from "../../../types/game/news-item";

export default class PreFightNewsStage implements IStage {
  name: RoundStages = 'Pre Fight News'
  uIUpdateSubject: Subject<void> = new Subject()
  finished: Subject<void> = new Subject();
  newsItems: NewsItem[] = []
  
  constructor(private game: Game, private roundController: RoundController){}

  start(): void {
    this.finished = new Subject();
    setTimeout(this.stageFinished.bind(this), 1000)  
  }

  stageFinished(){
    this.finished.next()
    this.finished.complete()
  } 
  
};
