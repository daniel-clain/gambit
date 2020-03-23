import IStage from "../../../interfaces/game/stage";
import { Subject } from "rxjs";
import Game from "../../game";
import { RoundController } from "../round-controller";
import RoundStages from "../../../types/game/round-stages";
import { NewsItem } from "../../../types/game/news-item";
import gameConfiguration from "../../../game-settings/game-configuration";
export default class PreFightNewsStage implements IStage {
  name: RoundStages = 'Pre Fight News'
  uIUpdateSubject: Subject<void> = new Subject()
  finished: Subject<void> = new Subject();
  newsItems: NewsItem[] = []
  
  constructor(private game: Game, private roundController: RoundController){}

  start(): void {
    this.finished = new Subject();
    const totalStageDuration = gameConfiguration.stageDurations.eachNewsSlide * 1000 * this.newsItems.length
    setTimeout(this.stageFinished.bind(this), totalStageDuration)  
  }

  stageFinished(){
    this.finished.next()
    this.finished.complete()
  } 
  
};
