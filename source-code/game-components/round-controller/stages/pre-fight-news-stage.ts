import IStage from "../../../interfaces/game/stage";
import { RoundController } from "../round-controller";
import { NewsItem } from "../../../types/game/news-item";
import gameConfiguration from "../../../game-settings/game-configuration";
import { RoundStage } from "../../../types/game/round-stage.type";
export default class PreFightNewsStage implements IStage {
  name: RoundStage = 'Pre Fight News'
  private endRound
  newsItems: NewsItem[] = []
  activeNewsItem: NewsItem
  
  constructor(private roundController: RoundController){}
  newsItemDuration = gameConfiguration.stageDurations.eachNewsSlide * 1000

  start(): Promise<void> {
    return new Promise(async resolve => {
      this.endRound = resolve
      if(!this.newsItems.length){
        this.endRound()
      }

      for(let i = 0; i < this.newsItems.length; i++ ){
        await this.showNewsItem(this.newsItems[i])
      }
      this.endRound()


    })
  }

  pause(){console.log('no implemented')}
  unpause(){console.log('no implemented')}

  showNewsItem(newsItem){
    this.activeNewsItem = newsItem
    this.roundController.triggerUIUpdate()

    return new Promise(newsItemFinished => 
      setTimeout(newsItemFinished, newsItem.duration ? newsItem.duration*1000 : this.newsItemDuration)
    )
  }

  
};
