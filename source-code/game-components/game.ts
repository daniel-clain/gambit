
import {UtilityFunctions as u} from '../utility-functions'
import Fighter from "./fighter/fighter"
import { Professional, ServerGameUIState } from "../interfaces/server-game-ui-state.interface"
import { Player } from "./player"
import { GameType } from "../types/game/game-type"
import ConnectionManager from "./connection-manager"
import {AbilityProcessor} from './abilities-reformed/ability-processor'
import { Game_Implementation } from "./game.implementation"
import { RoundController } from './round-controller/round-controller'
import { GameInfo } from '../interfaces/game/game-info'
import { Manager } from './manager'
import { ConnectedClient } from '../server/game-host.types'


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
}


class GameHas{
  protected state: GameState
  id = u.randomNumber({digits: 6})
  fighters: Fighter[]
  professionals: Professional[]
  players: Player[] = []
  managers: Manager[] = []
  roundController: RoundController
  connectionManager: ConnectionManager
  abilityProcessor: AbilityProcessor

  constructor(
    players: ConnectedClient[], 
    public gameType: GameType, 
    public gameDisplays: ConnectedClient[],
    private game: Game
  ){
    this.fighters = this.game.i.createRandomFighters()
    this.professionals = this.game.i.createRandomProfessionals()
    
    this.abilityProcessor = new AbilityProcessor(this.game)

    if(gameType == 'Websockets'){
      this.connectionManager = new ConnectionManager(this.game)
    }

    players.forEach(player => {
      const manager = new Manager(this.game, player.name)
      this.managers.push(manager)
      this.players.push(
        new Player(
          player.name,
          player.id,
          player.socket,
          manager,
          this.abilityProcessor,
          this.connectionManager
        )
      )
    })

  }
  
}


class GameFunctions{
  constructor(private game: Game ){}
  pause(){
    this.game.state.paused = true
    this.game.has.roundController.activeStage.pause()
  }
  unPause(){
    this.game.state.paused = false
    this.game.has.roundController.activeStage.unpause()
  }

  startGame(){
    this.game.has.roundController.startRound(1)
  }


  handleUpdateFromClient(){}



  triggerUIUpdate(){
    this.sendUIUpdateToPlayers()
    this.sendUIUpdateToGameDisplays()
  }

  sendUIUpdateToGameDisplays(){
    this.game.i.getAllConnectedGameDisplays()?.forEach(gameDisplay => gameDisplay.socket.emit(
      'To Client From Server - Game Ui', 
      this.getGameUiState()
    ))
  }


  sendUIUpdateToPlayers(players?: Player[]){

    (players ? players : this.game.has.players)
    .forEach(player => {

      const gameUIState = this.getGameUiState(player.manager)
      const {gameType} = this.game.has

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
      disconnectedClients: has.connectionManager.disconnectedClients
    }
  }
  

  getGameUiState(manager?: Manager): ServerGameUIState{
    let {getRoundUIState, activeStage, preFightNewsStage, activeFight:{fighters}} = this.game.has.roundController
    let {activeFight, managerOptionsTimeLeft, jobSeekers} = getRoundUIState()

    return {
      disconnectedPlayerVotes: this.game.has.gameType == 'Websockets' ? this.game.has.connectionManager.disconnectedPlayerVotes : null,
      roundStage: activeStage.name,
      postFightReportData:  {notifications: []},
      playerManagerUIState: {
        managerInfo: manager?.functions.getInfo(),
        managerOptionsTimeLeft,
        jobSeekers,
        nextFightFighters: fighters.map(fighter => fighter.getInfo()),
        delayedExecutionAbilities: []
      },
      preFightNewsUIState: {newsItem: preFightNewsStage.activeNewsItem},
      FightUIState: {...activeFight.fightUiData, knownFighterStates: manager?.functions.getKnownFighterStats(fighters)}
    }

  }
}


export class Game {
  state: GameState = new GameState()
  i: Game_Implementation = new Game_Implementation(this)
  functions: GameFunctions = new GameFunctions(this)
  has: GameHas

  constructor(
    players: ConnectedClient[],
    gameType: GameType,
    gameDisplays?: ConnectedClient[]
  ){
    this.has = new GameHas(players, gameType, gameDisplays, this)   
    this.has.roundController = new RoundController(this)
    
    this.functions.startGame()
  }

}





