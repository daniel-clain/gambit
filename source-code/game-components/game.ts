
import { RoundController } from "./round-controller/round-controller"
import Fighter from "./fighter/fighter"
import Manager, { createManager } from "./manager"
import { Professional, ServerGameUIState } from "../interfaces/server-game-ui-state.interface"
import { Player } from "../interfaces/player-info.interface"
import { GameType } from "../types/game/game-type"
import { GameInfo } from "../interfaces/game/game-info"
import DisconnectedPlayers from "./disconnected-players"
import gameUtility from "./game-setup"
import { GameDisplay } from "../interfaces/game-display-interface"
import ConnectionManager from "./disconnected-players"
import { GameMessageReceiver } from "./update-communicators/server-receives-websocket-msg-from-client"
import {GameMessageSender} from './update-communicators/server-sends-game-update-to-all'
import {AbilityProcessor, getAbilityProcessor} from './abilities-reformed/ability-processor'
import { FighterStateData } from "../client/views/game/fight-view/fight-results-view-components/fighter-states/fighter-states"
import GameUtility from "./game-setup"


interface Game_Props{
  gameType: GameType
  players: Player[]
  gameDisplays: GameDisplay[]
}


export interface Game_External_Interface{
  id
  players: Player[]
  displays
  gameType: GameType
  paused: boolean
  connectionManager: ConnectionManager
  pause()
  unpause()
  shutdown()
  getInfo()
  getGameUiState(player: Player): ServerGameUIState

}

export class Game{

  constructor(public players: Player[], public gameType: GameType, gameDisplays: GameDisplay[]){

  }
/* 
 
  const messageSender = GameMessageSender(players, getGameUiState)
  const gameUtility = new GameUtility()

  const game: Game = {
    id: new Date().getTime().toString(),   
    messageSender,
    players,
    gameType,
    managers: players.map(player => createManager(player, messageSender.triggerUpdate)),
    fighters: gameUtility.createFighters(),
    professionals: gameUtility.createProfessionals(),
    paused: false,
    pause,
    unpause,
    shutdown,
    getInfo,
    getGameUiState,
    connectionManager: null,
    roundController: null,
    abilityProcessor: null,
    messageReceiver: null
  }
  
  const disconnectedPlayers = new DisconnectedPlayers(game)
  const connectionManager = disconnectedPlayers
  
  game.connectionManager = new ConnectionManager(game),
  game.roundController = new RoundController(game, game.messageSender.triggerUpdate)
  game.abilityProcessor = getAbilityProcessor(game)
  game.messageReceiver = GameMessageReceiver(players, game.abilityProcessor),
  startGame()


  

  function startGame(){
    console.log('game started');
    game.roundController.startRound(1)
  }

  
  function getGameUiState(player: Player): ServerGameUIState{
    let {roundState, activeStage, preFightNewsStage, activeFight:{fighters}} = game.roundController
    let {activeFight, managerOptionsTimeLeft, jobSeekers} = roundState

    return {
      disconnectedPlayerVotes: game.connectionManager.disconnectedPlayerVotes,
      roundStage: activeStage,
      postFightReportData:  {notifications: []},
      playerManagerUiData: {
        managerInfo: player.manager.getInfo(),
        managerOptionsTimeLeft,
        jobSeekers,
        nextFightFighters: activeFight.fighters
          .map(fighter => fighter.getInfo()),
        delayedExecutionAbilities: []
      },
      preFightNewsUiData: {newsItem: preFightNewsStage.activeNewsItem},
      fightUiData: {...activeFight.fightUiData, knownFighterStates: getPlayerKnownFighterStats(player, fighters)}
    }

    function getPlayerKnownFighterStats({manager}:Player, fighers: Fighter[]): FighterStateData[]{
      return fighers.map(fighter => {
        const {poisoned, injured, doping} = fighter.state
        const foundFighter = manager.knownFighters?.find(kf => kf.name == fighter.name)
        if(foundFighter){
          const {activeContract,  goalContract, name, ...knownFighterStats} = foundFighter

          return {name, poisoned, injured, doping, ...knownFighterStats}
        }
        return {name: fighter.name, poisoned, injured, doping, fitness: undefined, strength: undefined, aggression: undefined, intelligence: undefined, numberOfFights: undefined, manager: undefined, numberOfWins: undefined}

      })
    }
  } */
  getInfo(): GameInfo {
    return {
      id: this.id,
      players: this.players.map(p => 
        ({name: p.name, id: p.id})),
      paused: this.paused,
      round: this.roundController.roundNumber,
      disconnectedPlayers: this.disconnectedPlayers.disconnectedPlayers
    }
  }
  
  
  function pause() {
    game.paused = true
    /* if(this.roundController.activeStage == 'Manager Options')
      this.roundController.managerOptionsStage.pause()
    if(this.roundController.activeStage == 'Fight Day')
      this.roundController.activeFight.pause() */
  }

  function unpause() {
    game.paused = false
    /* if(this.roundController.activeStage == 'Manager Options')
      this.roundController.managerOptionsStage.unpause()
    if(this.roundController.activeStage == 'Fight Day')
      this.roundController.activeFight.unpause() */
  }
  
  function shutdown(){}

    

    
  return game
  
}

export default Game
