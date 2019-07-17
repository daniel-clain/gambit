import GameImplementationCode from "./game-implementation-code";
import FightScheduler from "./fight-scheduler/fight-scheduler";
import Manager from "./manager/manager";
import gameConfiguration, { GameConfiguration } from "./game-configuration";
import Fighter from "./fighter/fighter";
import { Subject } from "rxjs";
import IGameFacade from "../game-facade/game-facade";
import { GameUIProps } from "../../client/components/game-ui";
import { PreGameUIState } from "../../client/main-game/pre-game";

export default class Game implements IGameFacade {
  preGameStateUpdates: Subject<PreGameUIState>;
  gameStateUpdates: Subject<GameUIProps>;
  
  private fighters: Fighter[]
  private managers: Manager[]
  private i: GameImplementationCode = new GameImplementationCode()
  private fightScheduler: FightScheduler
  private gameConfiguration: GameConfiguration


	constructor(playerIds: string[] = ['local']) {
    console.log('game started');
    this.gameConfiguration = gameConfiguration
    
    this.managers = playerIds.map(id => new Manager(id))
    /* this.fighters = this.i.getFightersWithRandomNames(this.gameConfiguration.numberOfFighters)
    this.fightScheduler = new FightScheduler(this.fighters) */
  }
  
  
}