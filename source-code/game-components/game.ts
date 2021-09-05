
import Fighter from "./fighter/fighter"
import { Player } from "./player"
import { GameType } from "../types/game/game-type"
import ConnectionManager from "./connection-manager"
import {AbilityProcessor} from './abilities-general/ability-processor'
import { Game_Implementation } from "./game.implementation"
import { RoundController } from './round-controller/round-controller'
import { GameInfo } from '../interfaces/game/game-info'
import { Manager } from './manager'
import { ConnectedClient } from '../game-host/game-host.types'
import { postStartTestState, setupTestState } from './setupTestState'
import { GameHost } from '../game-host/game-host'
import { Professional, ServerGameUIState } from '../interfaces/front-end-state-interface'
import { randomNumber } from "../helper-functions/helper-functions"
import gameConfiguration from "../game-settings/game-configuration"
import { Lawsuit } from "../types/game/lawsuit.type"


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




export class GameState{
  paused: boolean  
  
  constructor(public gameType: GameType){

  }
}


class GameHas{
  protected state: GameState
  id = randomNumber({digits: 6})
  fighters: Fighter[]
  professionals: Professional[]
  players: Player[] = []
  managers: Manager[] = []
  roundController: RoundController
  connectionManager: ConnectionManager
  abilityProcessor: AbilityProcessor

  constructor(
    public gameDisplays: ConnectedClient[],
    private game: Game,
  ){
    this.abilityProcessor = new AbilityProcessor(this.game)
    if(this.game.state.gameType == 'Websockets'){
      this.connectionManager = new ConnectionManager(this.game)
    }

  }
  
}


class GameFunctions{
  
  constructor(private game: Game, private i: Game_Implementation, private gameHost: GameHost){}
  pause(){
    this.game.state.paused = true
    this.game.has.roundController.activeStage.pause()
    this.triggerUIUpdate()
  }
  unPause(){
    this.game.state.paused = false
    this.game.has.roundController.activeStage.unpause()
    this.triggerUIUpdate()
  }

  startGame(){
    const game = this.game
    setTimeout(() => {
      setupTestState(game)
      game.has.roundController.startRound(gameConfiguration.startingRoundNumber)
      postStartTestState(game)
      
    }, 1000);
  }

  resignEmployee = this.i.resignEmployee

  removeFighterFromTheGame = this.i.removeFighterFromTheGame


  tearDownGame(){
    console.log('TEARING DOWN GAME');
    this.gameHost.tearDownGame(this.game.has.id)
  }


  updateGameHostClients(){
    this.gameHost.updateConnectedClients()
  }



  triggerUIUpdate(){
    this.sendUIUpdateToPlayers()
    this.sendUIUpdateToGameDisplays()
  }

  sendUIUpdateToGameDisplays(){
    this.i.getAllConnectedGameDisplays()?.forEach(gameDisplay => gameDisplay.socket.emit(
      'To Client From Server - Game Ui', 
      this.getGameUiState()
    ))
  }


  sendUIUpdateToPlayers(players?: Player[]){

    (players ? players : this.game.has.players)
    .forEach(player => {

      const gameUIState = this.getGameUiState(player.manager)
      const {gameType} = this.game.state

      gameType == 'Websockets' && 
        player.socket.emit(
          'To Client From Server - Game Ui', 
          gameUIState
        )

      gameType == 'Local' &&
        player.onUIStateUpdate.next(gameUIState)
      
    })
  }


  getInfo(): GameInfo{
    const {has, functions, state} = this.game

    return {
      id: has.id,
      players: has.players.map(p => ({name: p.name, id: p.id})),
      gameDisplays: has.gameDisplays.map(d => ({name: d.name, id: d.id})),
      paused: state.paused,
      round: has.roundController.roundNumber,
      disconnectedPlayerVotes: has.connectionManager.disconnectedPlayerVotes
    }
  }
  

  getGameUiState(manager?: Manager): ServerGameUIState{
    let {activeStage, preFightNewsStage, activeFight, managerOptionsStage: {timeLeft}, jobSeekers, roundNumber} = this.game.has.roundController
    let {delayedExecutionAbilities} = this.game.has.abilityProcessor

    const serverGameUIState: ServerGameUIState = {
      disconnectedPlayerVotes: this.game.state.gameType == 'Websockets' ? this.game.has.connectionManager.disconnectedPlayerVotes : null,
      roundStage: activeStage?.name,
      displayManagerUIState: {
        roundStage: activeStage.name,
        timeLeft,
        jobSeekers,
        nextFightFighters: activeFight?.fighters.map(fighter => fighter.name),
        managersDisplayInfo: this.game.has.managers.map(m => ({
          name: m.has.name, ready: m.state.readyForNextFight, image: m.has.image, bet: m.has.nextFightBet
        }))
      },
      playerManagerUIState: {
        round: roundNumber,
        managerInfo: manager?.functions.getInfo(),
        managerOptionsTimeLeft: timeLeft,
        jobSeekers,
        nextFightFighters: activeFight?.fighters.map(fighter => fighter.name),
        delayedExecutionAbilities
      },
      preFightNewsUIState: {
        newsItem: preFightNewsStage.activeNewsItem
      },
      fightUIState: {
        ...activeFight?.fightUiData, 
        knownFighterStates: 
          !activeFight ? [] : manager?.functions.getKnownFighterStats(activeFight?.fighters)}
    }
    serverGameUIState.playerManagerUIState.managerInfo.fighters.forEach(f => {
      console.log(`${f.name}, active contract: ${f.activeContract.weeksRemaining}, goal contract: ${f.goalContract}`);
    })
    return serverGameUIState
  }
}


export class Game {
  state: GameState
  private i: Game_Implementation = new Game_Implementation(this)
  functions: GameFunctions
  has: GameHas

  constructor(
    players: ConnectedClient[],
    gameType: GameType,
    gameHost: GameHost,
    gameDisplays?: ConnectedClient[]
  ){
    this.state = new GameState(gameType)
    this.functions= new GameFunctions(this, this.i, gameHost)
    this.has = new GameHas(gameDisplays, this) 
    this.has.roundController = new RoundController(this)
    
    this.setupPlayersAndManagers(players)
    this.i.setupFightersAndProfessionals()


    this.functions.startGame()
  }

  private setupPlayersAndManagers(players){

    players.forEach(player => {
      const manager = new Manager(player.name, this)
      this.has.managers.push(manager)
      console.log('manager.has.image :>> ', manager.has.image);
      this.has.players.push(
        new Player(
          player.name,
          player.id,
          player.socket,
          manager,
          this
        )
      )
    })
    
    this.has.managers.forEach(manager => {
      manager.has.otherManagers = this.has.managers
      .filter(m => m.has.name != manager.has.name)
      .map(m => ({name: m.has.name, image: m.has.image, money: null, loan: null, fighters: null, employees: null, evidence: null}))
    })
  }


}





