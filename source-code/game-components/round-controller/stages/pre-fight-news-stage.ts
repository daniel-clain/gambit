import IStage from "../../../interfaces/game/stage";
import { Subject } from "rxjs";
import Game from "../../game";
import { RoundController } from "../round-controller";
import RoundStages from "../../../types/game/round-stages";
import { NewsItem } from "../../../types/game/news-item";
import gameConfiguration from "../../../game-settings/game-configuration";
export default class PreFightNewsStage implements IStage {
  name: RoundStages = 'Pre Fight News'
  private endRound
  newsItems: NewsItem[] = []
  
  constructor(private game: Game, private roundController: RoundController){}

  start(): Promise<void> {
    return new Promise(resolve => {
      this.endRound = resolve
      const totalStageDuration = gameConfiguration.stageDurations.eachNewsSlide * 1000 * this.newsItems.length
      setTimeout(this.endRound, totalStageDuration)  
    })
  }

  
};
