import { orderBy } from "lodash"
import { wait } from "../../../helper-functions/helper-functions"
import {
  FighterInfo,
  FinalTournamentBoard,
} from "../../../interfaces/front-end-state-interface"
import Fight from "../../fight/fight"
import Fighter from "../../fighter/fighter"
import { Game } from "../../game"

export type MatchupName =
  | "Finals"
  | "Semi Finals 1"
  | "Semi Finals 2"
  | "Quarter Finals 1"
  | "Quarter Finals 2"
  | "Quarter Finals 3"
  | "Quarter Finals 4"

export type Matchup = {
  fighter1: Fighter
  fighter2: Fighter
  winner?: Fighter
  matchupName: MatchupName
}
export type MatchupInfo = {
  fighter1: FighterInfo
  fighter2: FighterInfo
  winner?: FighterInfo
  matchupName: MatchupName
}
export class FinalTournament {
  private quarterFinalsMatchups: Matchup[]
  private semiFinalsMatchups: Matchup[]
  private finalsMatchup: Matchup
  private showingBoard: boolean
  activeFight: Fight | undefined
  finalTournamentBoard: FinalTournamentBoard

  constructor(private game: Game) {
    console.log("fight tournament")
    this.setupTournament()
  }

  private setupTournament() {
    const fighters = getTop8Fighters(this)

    this.quarterFinalsMatchups = [
      {
        fighter1: fighters[7],
        fighter2: fighters[3],
        matchupName: "Quarter Finals 1",
      },
      {
        fighter1: fighters[5],
        fighter2: fighters[1],
        matchupName: "Quarter Finals 2",
      },
      {
        fighter1: fighters[6],
        fighter2: fighters[2],
        matchupName: "Quarter Finals 3",
      },
      {
        fighter1: fighters[4],
        fighter2: fighters[0],
        matchupName: "Quarter Finals 4",
      },
    ]

    function getTop8Fighters(thisClass: FinalTournament) {
      const sortedFighters = orderBy(
        thisClass.game.has.fighters.filter((f) => f.state.manager),
        (fighter) => fighter.state.numberOfWins / fighter.state.numberOfFights,
        "desc" // Sort in descending order to place the best win ratios at the top
      )

      console.log(
        "sortedFighters",
        sortedFighters.map((f) => ({
          name: f.name,
          fights: f.state.numberOfFights,
          wins: f.state.numberOfWins,
        }))
      )

      const top8 = sortedFighters.slice(0, 8)
      console.log(
        "top8",
        top8.map((f) => ({
          name: f.name,
          fights: f.state.numberOfFights,
          wins: f.state.numberOfWins,
        }))
      )
      return top8
    }
  }

  startTournament = async (): Promise<string> => {
    await this.showTournamentBoard()
    console.log("quarter finals")
    for (let matchup of this.quarterFinalsMatchups) {
      console.log(`${matchup.fighter1.name} vs. ${matchup.fighter2.name}`)
      matchup.winner = await this.doFight(matchup)

      this.semiFinalsMatchups = [
        {
          fighter1: this.quarterFinalsMatchups[0].winner!,
          fighter2: this.quarterFinalsMatchups[1].winner!,
          matchupName: "Semi Finals 1",
        },
        {
          fighter1: this.quarterFinalsMatchups[2].winner!,
          fighter2: this.quarterFinalsMatchups[3].winner!,
          matchupName: "Semi Finals 2",
        },
      ]
      await this.showTournamentBoard()
    }

    console.log("semi finals")
    for (let matchup of this.semiFinalsMatchups) {
      console.log(`${matchup.fighter1.name} vs. ${matchup.fighter2.name}`)
      matchup.winner = await this.doFight(matchup)
      this.finalsMatchup = {
        fighter1: this.semiFinalsMatchups[0].winner!,
        fighter2: this.semiFinalsMatchups[1].winner!,
        matchupName: "Finals",
      }
      await this.showTournamentBoard()
    }

    console.log("finals")
    console.log(
      `${this.finalsMatchup.fighter1.name} vs. ${this.finalsMatchup.fighter2.name}`
    )
    this.finalsMatchup.winner = await this.doFight(this.finalsMatchup)
    await this.showTournamentBoard()
    await this.setPlayerVictory()
    await this.showWinnerVideo()

    return this.finalsMatchup.winner.name
  }

  private setPlayerVictory() {
    const fightersManager = this.finalsMatchup.winner!.state.manager!
    this.game.state.finalTournament = null
    this.game.state.playerHasVictory = {
      sourceManager: fightersManager.functions.getInfo(),
      victoryType: "Domination Victory",
    }
  }

  private updateTournamentBoard() {
    this.finalTournamentBoard = {
      finals: {
        winner: this.finalsMatchup?.winner?.getInfo(),
        fighter1: this.finalsMatchup?.fighter1?.getInfo(),
        fighter2: this.finalsMatchup?.fighter2?.getInfo(),
        matchupName: "Finals",
      },
      semiFinals: this.semiFinalsMatchups?.map((sf) => {
        return {
          winner: sf.winner?.getInfo(),
          fighter1: sf.fighter1?.getInfo(),
          fighter2: sf.fighter2?.getInfo(),
          matchupName: sf.matchupName,
        }
      }),

      quarterFinals: this.quarterFinalsMatchups.map((qf) => {
        return {
          winner: qf.winner?.getInfo(),
          fighter1: qf.fighter1?.getInfo(),
          fighter2: qf.fighter2?.getInfo(),
          matchupName: qf.matchupName,
        }
      }),
      showTournamentBoard: this.showingBoard,
    }
  }

  private doFight(matchup: Matchup): Promise<Fighter> {
    let resolveFight: (value: Fighter | PromiseLike<Fighter>) => void

    const fightResolvedPromise = new Promise<Fighter>((resolve) => {
      resolveFight = resolve
    })

    this.activeFight = new Fight(
      [matchup.fighter1, matchup.fighter2],
      false,
      true
    )

    this.activeFight.start()

    const handleFightFinished = () => {
      console.log(
        "fight finished",
        this.activeFight!.result == "draw"
          ? "draw"
          : this.activeFight!.result.winner.name
      )
      if (!this.activeFight!.result || this.activeFight!.result == "draw") {
        console.warn("final tournament fight should have a winner")
      }

      const winner: Fighter =
        (this.activeFight!.result as { winner: Fighter }).winner ||
        this.activeFight!.fighters[0]

      setTimeout(() => {
        this.activeFight!.doTeardown()
        this.activeFight = undefined
        this.game.functions.triggerUIUpdate()
        resolveFight(winner)
      }, 2000)
    }

    this.activeFight.fightUiDataSubject.subscribe(() => {
      this.game.functions.triggerUIUpdate()
    })
    this.activeFight.fightFinishedSubject.subscribe(() => {
      handleFightFinished()
    })

    return fightResolvedPromise
  }

  private async showTournamentBoard() {
    this.showingBoard = true
    this.updateTournamentBoard()
    this.game.functions.triggerUIUpdate()
    console.log("show board wait")
    if (this.finalsMatchup?.winner) {
      await wait(5000)
      return
    } else {
      await wait(3000)
    }
    this.finalTournamentBoard.showTournamentBoard = false
    this.game.functions.triggerUIUpdate()
  }

  private async showWinnerVideo() {
    this.game.state.isShowingVideo = {
      sourceManager: this.game.state.playerHasVictory!.sourceManager,
      name: "Domination Victory",
      index: 0,
    }
    this.game.functions.triggerUIUpdate()
  }
}
