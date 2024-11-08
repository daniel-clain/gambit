import gameConfiguration from "../../../game-settings/game-configuration"
import IStage from "../../../interfaces/game/stage"
import { NewsItem } from "../../../types/game/news-item"
import { WeekStage } from "../../../types/game/week-stage.type"
import { WeekController } from "../week-controller"
export default class PreFightNewsStage implements IStage {
  name: WeekStage = "Pre Fight News"
  private endWeek: (value: void | PromiseLike<void>) => void
  newsItems: NewsItem[] = []
  activeNewsItem: NewsItem

  constructor(private weekController: WeekController) {}
  newsItemDuration = gameConfiguration.stageDurations.eachNewsSlide * 1000

  start(): Promise<void> {
    return new Promise(async (resolve) => {
      this.endWeek = resolve
      if (!this.newsItems.length) {
        this.endWeek()
      }

      for (let i = 0; i < this.newsItems.length; i++) {
        await this.showNewsItem(this.newsItems[i])
      }
      this.endWeek()
    })
  }

  pause() {
    console.log("no implemented")
  }
  unpause() {
    console.log("no implemented")
  }

  showNewsItem(newsItem: NewsItem) {
    this.activeNewsItem = newsItem
    this.weekController.triggerUIUpdate()

    return new Promise((newsItemFinished) =>
      setTimeout(
        newsItemFinished,
        newsItem.duration ? newsItem.duration * 1000 : this.newsItemDuration
      )
    )
  }
}
