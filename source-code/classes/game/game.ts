import GameImplementationCode from "./game-implementation-code";
import FightScheduler from "./fight-scheduler/fight-scheduler";
import Manager from "./manager/manager";
import gameConfiguration, { GameConfiguration } from "./game-configuration";
import Fighter from "./fighter/fighter";
import IGameFacade from "../game-facade/game-facade";
import { Subject } from 'rxjs';
import { GameState, GameStateGeneral } from '../../interfaces/client-ui-state.interface';
import Player from './player';
import PlayerNameAndId from '../../interfaces/player-name-and-id';


export default class Game{
  
  private _players: Player[]
  private fighters: Fighter[]
  private managers: Manager[]
  private i: GameImplementationCode = new GameImplementationCode()
  private fightScheduler: FightScheduler
  private gameConfiguration: GameConfiguration


	constructor(playerNameAndIds: PlayerNameAndId[]) {
    console.log('game started');

    this.gameConfiguration = gameConfiguration
    
    this._players = playerNameAndIds.map((playerNameAndId: PlayerNameAndId) => {
      const {name, id} = playerNameAndId
      const player: Player = new Player(id, name, this)
      return player
    })
    setTimeout(() => this.gameUpdate(), 10)
  }
  get players(){
    return this._players
  }

  gameUpdate(){
    this.players.forEach((player: Player) => {
      const players: PlayerNameAndId[] = this.players.map(
        (player: Player) => ({name: player.name, id: player.id})
      )

      const gameStateGeneral: GameStateGeneral = {
        players,
        gameChat: [],
        fightActive: false,
        timeTillNextFight: null
      }

      player.gameGeneralUiUpdate(gameStateGeneral)
    })
  }
  
  
}