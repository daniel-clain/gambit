
import { RoundController } from "./round-controller/round-controller"
import Fighter from "./fighter/fighter"
import Manager, { createManager } from "./manager"
import { Professional, PlayerGameUiData } from "../interfaces/game-ui-state.interface"
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


interface Game_Props{
  gameType: GameType
  players: Player[]
  gameDisplays: GameDisplay[]
}


export interface Game_External_Interface{
  id
  players: Player[]
  gameType: GameType
  paused: boolean
  connectionManager: ConnectionManager
  pause()
  unpause()
  shutdown()
  getInfo()
}

interface Game extends Game_External_Interface{
  managers: Manager[]
  fighters: Fighter[]
  professionals: Professional[]
  roundController: RoundController
  abilityProcessor
  messageSender
  messageReceiver
}

export function createGame(
  {players, gameType, gameDisplays}: Game_Props
): Game_External_Interface {

 
  const messageSender = GameMessageSender(players, getGameUiState)

  const game: Game = {
    id: new Date().getTime().toString(),   
    messageSender,
    players,
    gameType,
    managers: players.map(createManager),
    fighters: gameUtility.createFighters(),
    professionals: gameUtility.createProfessionals(),
    paused: false,
    pause,
    unpause,
    shutdown,
    getInfo,
    connectionManager: null,
    roundController: null,
    abilityProcessor: null,
    messageReceiver: null
  }
  game.managers.forEach(manager => manager.updateTrigger)
  
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

  
  function getGameUiState(player: Player): PlayerGameUiData {
    let {roundState, activeStage, preFightNewsStage} = game.roundController
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
          .map(fighter => fighter.name),
        delayedExecutionAbilities: []
      },
      preFightNewsUiData: {newsItems: preFightNewsStage.newsItems},
      fightUiData: activeFight.fightUiData
    }
  }
  function getInfo(): GameInfo {
    return {
      id: game.id,
      players: game.players.map(p => 
        ({name: p.name, id: p.id})),
      paused: game.paused,
      round: game.roundController.roundNumber,
      disconnectedPlayers: disconnectedPlayers.disconnectedPlayers
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

    

    
  return {
    id: game.id,
    players: game.players,
    gameType: game.gameType,
    paused: game.paused,
    getInfo, pause, unpause, shutdown,    
    connectionManager
  }
  
}

export default Game
