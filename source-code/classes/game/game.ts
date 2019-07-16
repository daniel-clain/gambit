import GameImplementationCode from "./game-implementation-code";
import FightScheduler from "./fight-scheduler/fight-scheduler";
import Manager from "./manager/manager";
import gameConfiguration, { GameConfiguration } from "./game-configuration";
import Fighter from "./fighter/fighter";

export default class Game {
  private fighters: Fighter[]
  managers: Manager[]
  private i: GameImplementationCode = new GameImplementationCode()
  private fightScheduler: FightScheduler
  private gameConfiguration: GameConfiguration

	constructor(private _gameId: string, playerIds: string[]) {
    console.log('game started');
    this.gameConfiguration = gameConfiguration
    this.managers = playerIds.map(id => new Manager(id))
    /* this.fighters = this.i.getFightersWithRandomNames(this.gameConfiguration.numberOfFighters)
    this.fightScheduler = new FightScheduler(this.fighters) */
  }

  get gameId(){
    return this._gameId
  }
  
  
}