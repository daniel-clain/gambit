import IStage from "../../../interfaces/game/stage";
import { Subject } from "rxjs";
import Game from "../../game";
import { RoundController } from "../round-controller";
import RoundStages from "../../../types/game/round-stage.type";
import { NewsItem } from "../../../types/game/news-item";
import gameConfiguration from "../../../game-settings/game-configuration";
export default class PreFightNewsStage implements IStage {
  name: RoundStages = 'Pre Fight News'
  private endRound
  newsItems: NewsItem[] = []
  
  constructor(private game: Game, private roundController: RoundController){}
  slideDuration = gameConfiguration.stageDurations.eachNewsSlide * 1000
  activNewsItemCount

  activeNewsItem: NewsItem

  start(): Promise<void> {
    return new Promise(resolve => {
      this.endRound = resolve
      if(!this.newsItems.length){
        this.endRound()
      }

      this.activNewsItemCount = 0
      this.activeNewsItem[this.activNewsItemCount]
      const totalStageDuration = this.slideDuration * this.newsItems.length
      const newsItemInterval = setInterval(this.showNextNewsItem, this.slideDuration)
      setTimeout(() => {
        clearInterval(newsItemInterval)
        this.endRound()
      }, totalStageDuration)  
    })
  }

  showNextNewsItem(){
    this.activNewsItemCount ++
    this.activeNewsItem[this.activNewsItemCount]
    this.roundController.triggerUpdate()
  }

  
};
