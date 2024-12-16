import { GameHost } from "../backend/game-host/game-host"
import { ConnectedClient } from "../backend/game-host/game-host.types"
import gameConfiguration from "../game-settings/game-configuration"
import { randomNumberDigits } from "../helper-functions/helper-functions"
import {
  Professional,
  SelectedVideo,
  ServerGameUIState,
} from "../interfaces/front-end-state-interface"
import { GameInfo } from "../interfaces/game/game-info"
import { GameType } from "../types/game/game-type"
import {
  PlayerHasFailedVictory,
  PlayerHasVictory,
} from "../types/game/victory-and-loss"
import { AbilityProcessor } from "./abilities-general/ability-processor"
import ConnectionManager from "./connection-manager"
import Fighter from "./fighter/fighter"
import { Game_Implementation } from "./game-setup"
import { KnownManager, Manager } from "./manager"
import { Player } from "./player"
import {
  postStartTestState,
  setupTestState,
  testSetupBeginning,
} from "./setupTestState"
import { FinalTournament } from "./week-controller/final-tournament/final-tournament"
import { WeekController } from "./week-controller/week-controller"

/* 
  What can a 'Game' do
  it can:
    - start
    - finish
    - pause
    - unpause

  What does the 'Game' have
  is has:
    - fighters
    - professionals
    - managers
    - current state of the entire game

  What state can the game be in
  it can be:
   - paused

*/

export class GameState {
  paused: boolean
  playerHasVictory: PlayerHasVictory | null
  playerHasFailedVictory: PlayerHasFailedVictory | null
  finalTournament: FinalTournament | null

  isShowingVideo?: SelectedVideo

  gameIsFinished: boolean

  constructor(public gameType: GameType) {}
}

class GameHas {
  protected state: GameState
  id = randomNumberDigits(6).toString()
  fighters: Fighter[]
  professionals: Professional[]
  players: Player[] = []
  managers: Manager[] = []
  weekController: WeekController
  connectionManager: ConnectionManager
  abilityProcessor: AbilityProcessor

  constructor(private game: Game, public gameDisplays?: ConnectedClient[]) {
    if (this.game.state.gameType == "Websockets") {
      this.connectionManager = new ConnectionManager(this.game)
    }
  }
}

class GameFunctions {
  constructor(
    private game: Game,
    private i: Game_Implementation,
    private gameHost: GameHost
  ) {}
  pause() {
    this.game.state.paused = true
    this.game.has.weekController.activeStage.pause()
    this.triggerUIUpdate()
  }
  unPause() {
    this.game.state.paused = false
    this.game.has.weekController.activeStage.unpause()
    this.triggerUIUpdate()
  }

  startGame() {
    const game = this.game
    setTimeout(() => {
      if (process.env.NODE_ENV == "development") {
        setupTestState(game)
      }
      game.has.weekController.startWeek(gameConfiguration.startingWeekNumber)
      if (process.env.NODE_ENV == "development") {
        postStartTestState(game)
      }
    }, 1000)
  }

  resignEmployee = this.i.resignEmployee

  removeFighterFromTheGame = this.i.removeFighterFromTheGame

  tearDownGame() {
    console.log("TEARING DOWN GAME")
    this.gameHost.tearDownGame(this.game.has.id)
  }

  updateGameHostClients() {
    this.gameHost.updateConnectedClients()
  }

  triggerUIUpdate() {
    this.sendUIUpdateToPlayers()
    this.sendUIUpdateToGameDisplays()
  }

  sendUIUpdateToGameDisplays() {
    this.i
      .getAllConnectedGameDisplays()
      ?.forEach((gameDisplay) =>
        gameDisplay.socket!.emit(
          "To Client From Server - Game Ui",
          this.getGameUiState()
        )
      )
  }

  sendUIUpdateToPlayers(players?: Player[]) {
    ;(players ? players : this.game.has.players).forEach((player) => {
      const gameUIState = this.getGameUiState(player.manager)
      const { gameType } = this.game.state

      gameType == "Websockets" &&
        player.socket.emit("To Client From Server - Game Ui", gameUIState)

      gameType == "Local" && player.onUIStateUpdate.next(gameUIState)
    })
  }

  getInfo(): GameInfo {
    const { has, state } = this.game

    return {
      id: has.id,
      players: has.players.map((p) => ({ name: p.name, id: p.id })),
      gameDisplays: has.gameDisplays?.map((d) => ({ name: d.name, id: d.id })),
      paused: state.paused,
      week: has.weekController.weekNumber,
      disconnectedPlayerVotes: has.connectionManager.disconnectedPlayerVotes,
    }
  }

  getGameUiState(manager?: Manager): ServerGameUIState {
    let {
      activeStage,
      preFightNewsStage,
      activeFight,
      managerOptionsStage: { timeLeft },
      jobSeekers,
      weekNumber,
    } = this.game.has.weekController
    const {
      has: { fighters, managers, gameDisplays },
      state: { finalTournament },
    } = this.game
    let { delayedExecutionAbilities } = this.game.has.abilityProcessor

    const serverGameUIState: ServerGameUIState = {
      disconnectedPlayerVotes:
        this.game.state.gameType == "Websockets"
          ? this.game.has.connectionManager.disconnectedPlayerVotes
          : null,
      weekStage: activeStage?.name,
      hasGameDisplay: !!gameDisplays?.length,
      displayManagerUiData: manager
        ? undefined
        : {
            timeLeft: timeLeft!,
            jobSeekers,
            nextFightFighters: activeFight?.fighters.map(
              (fighter) => fighter.name
            ),
            managersDisplayInfo: this.game.has.managers.map((m) => ({
              name: m.has.name,
              ready: m.state.readyForNextFight,
              image: m.has.image,
              bet: m.has.nextFightBet,
              retired: m.state.retired,
            })),
          },
      playerManagerUIState: !manager
        ? undefined
        : {
            week: weekNumber,
            managerInfo: manager?.functions.getInfo(),
            managerOptionsTimeLeft: timeLeft,
            jobSeekers,
            nextFightFighters: activeFight?.fighters.map(
              (fighter) => fighter.name
            ),
            delayedExecutionAbilities,
            otherPlayersReady: managers
              .filter(
                (m) => m.has.name !== manager.has.name && !m.state.retired
              )
              .map((m) => {
                return {
                  name: m.has.name,
                  ready: !!m.state.readyForNextFight,
                }
              }),
            thisManagerReady: manager.state.readyForNextFight,
          },
      selectedVideo: this.game.state.isShowingVideo,
      enoughFightersForFinalTournament:
        fighters.filter((f) => f.state.manager).length >= 8,

      finalTournamentState: !finalTournament
        ? undefined
        : {
            finalTournamentBoard: finalTournament.finalTournamentBoard,
            fightUiState: finalTournament.activeFight?.fightUiState,
          },
      preFightNewsUIState: {
        newsItem: preFightNewsStage.activeNewsItem,
      },
      fightDayState: this.i.getFightUiState(manager),
      gameFinishedData: this.game.state.gameIsFinished
        ? this.i.getGameFinishedData()
        : undefined,
    }
    return serverGameUIState
  }
}

export class Game {
  state: GameState
  i: Game_Implementation = new Game_Implementation(this)
  functions: GameFunctions
  has: GameHas

  constructor(
    players: ConnectedClient[],
    gameType: GameType,
    gameHost: GameHost,
    gameDisplays?: ConnectedClient[]
  ) {
    testSetupBeginning()
    this.state = new GameState(gameType)
    this.functions = new GameFunctions(this, this.i, gameHost)
    this.has = new GameHas(this, gameDisplays)
    this.has.abilityProcessor = new AbilityProcessor(this)
    this.has.weekController = new WeekController(this)

    this.setupPlayersAndManagers(players)
    this.i.setupFightersAndProfessionals()

    this.functions.startGame()
  }

  private setupPlayersAndManagers(players: ConnectedClient[]) {
    players.forEach((player) => {
      const manager = new Manager(player.name, this)
      this.has.managers.push(manager)
      this.has.players.push(
        new Player(player.name, player.id, player.socket!, manager, this)
      )
    })

    this.has.managers.forEach((manager) => {
      manager.has.otherManagers = this.has.managers
        .filter((m) => m.has.name != manager.has.name)
        .map((m) => {
          const knownManager: KnownManager = {
            name: m.has.name,
            characterType: "Known Manager",
            image: m.has.image,
            money: undefined,
            loan: undefined,
            fighters: undefined,
            employees: undefined,
            evidence: undefined,
          }
          return knownManager
        })
    })
  }
}
