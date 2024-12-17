import { Subject } from "rxjs"
import gameConfiguration from "../../game-settings/game-configuration"
import { wait } from "../../helper-functions/helper-functions"
import { JobSeeker } from "../../interfaces/front-end-state-interface"
import IStage from "../../interfaces/game/stage"
import { WeekUIState } from "../../interfaces/game/week-state"
import Fight from "../fight/fight"
import { Game } from "../game"
import { doEndOfWeekUpdates } from "./end-of-week-updates"
import { setupNewWeek } from "./new-week-setup"
import FightDayStage from "./stages/fight-day-stage"
import ManagerOptionsStage from "./stages/manager-options-stage"
import PreFightNewsStage from "./stages/pre-fight-news-stage"

export class WeekController {
  weekNumber: number
  activeStage: IStage
  jobSeekers: JobSeeker[]
  activeFight: Fight
  lastFightFighters: string[] = []
  nextWeekIsEvent = false
  thisWeekIsEvent = false
  videos = gameConfiguration.videos

  fightUiDataSubject: Subject<void> = new Subject()
  endOfWeekSubject: Subject<void> = new Subject()
  endOfManagerOptionsStageSubject: Subject<void> = new Subject()

  managerOptionsStage: ManagerOptionsStage
  preFightNewsStage: PreFightNewsStage
  fightDayStage: FightDayStage

  constructor(private game: Game) {
    this.managerOptionsStage = new ManagerOptionsStage(this.game)
    this.preFightNewsStage = new PreFightNewsStage(this)
    this.fightDayStage = new FightDayStage(this.game)
  }

  startWeek(number: number) {
    let { abilityProcessor } = this.game.has
    let { state } = this.game
    this.setUpWeek(number)
      .then(() => this.doStage(this.managerOptionsStage))
      .then(() =>
        abilityProcessor.executeAbilities("End Of Manager Options Stage")
      )
      .then(() => {
        console.log("isShowingVideo", state.isShowingVideo)
        if (state.isShowingVideo) return this.showVideo()
      })
      .then(() => this.checkFinalTournament())
      .then(() => {
        const { state } = this.game
        if (state.playerHasVictory) {
          this.onPlayerVictory()
        } else {
          state.playerHasFailedVictory = null
          return this.doStage(this.preFightNewsStage)
            .then(() => this.checkDefaultWinner())
            .then(() => {
              const { state } = this.game
              if (state.playerHasVictory) {
                this.onPlayerVictory()
              } else {
                return this.doStage(this.fightDayStage)
                  .then(() => abilityProcessor.executeAbilities("End Of Week"))
                  .then(() => doEndOfWeekUpdates(this.game))
                  .then(() => this.startWeek(++this.weekNumber))
                  .catch((e) => {
                    console.log("catch! ", e)
                  })
              }
            })
        }
      })
  }

  doStage(stage: IStage): Promise<any> {
    this.activeStage = stage
    this.triggerUIUpdate()
    return stage.start()
  }

  triggerUIUpdate() {
    this.game.functions.triggerUIUpdate()
  }

  private setUpWeek(number: number) {
    this.weekNumber = number
    setupNewWeek(this.game)
    return Promise.resolve()
  }

  onPlayerVictory() {
    this.game.state.gameIsFinished = true
    this.triggerUIUpdate()
    setTimeout(() => {
      console.log("game is finished")
      this.game.functions.tearDownGame()
    }, 20000)
  }

  checkDefaultWinner(): Promise<any> {
    const { managers } = this.game.has
    const nonRetiredPlayers = managers.filter((m) => !m.state.retired)
    console.log("checking default winner")
    if (nonRetiredPlayers.length == 1 && managers.length > 1) {
      const defaultWinner = nonRetiredPlayers[0]
      this.game.state.playerHasVictory = {
        sourceManager: defaultWinner.functions.getInfo(),
        victoryType: "Default Victory",
      }
      this.game.state.isShowingVideo = this.game.i.getSelectedVideo()
      this.triggerUIUpdate()
      return this.showVideo()
    }
    return Promise.resolve()
  }

  async showVideo(): Promise<void> {
    const { state } = this.game

    if (!state.isShowingVideo) {
      return
    }
    const videoObj = this.videos.find((v) => {
      return v.name == state.isShowingVideo!.name
    })!

    const video = videoObj.videos[state.isShowingVideo.index]

    console.log(`waiting for ${videoObj.name}, ${video.duration} secs`)

    await wait(video.duration * 1000)
    state.isShowingVideo = undefined
    return
  }

  async checkFinalTournament(): Promise<void> {
    const {
      state: { finalTournament },
    } = this.game

    if (!finalTournament) return
    else {
      await finalTournament.startTournament()
      await this.showVideo()
    }
  }

  getWeekUIState = (): WeekUIState => {
    return {
      number: this.weekNumber,
      stage: this.activeStage.name,
      jobSeekers: this.jobSeekers,
      managerOptionsTimeLeft: this.managerOptionsStage.timeLeft!,
      activeFight: this.activeFight,
    }
  }
}
