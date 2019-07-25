import {ManagerUiState} from './../../interfaces/client-ui-state.interface';
import {Fight} from './fight/fight-original';
import GameImplementationCode from "./game-implementation-code";
import FightScheduler, { FightSchedule } from "./fight-scheduler/fight-scheduler";
import Manager from "./manager/manager";
import gameConfiguration, { GameConfiguration } from "./game-configuration";
import Fighter from "./fighter/fighter";
import IGameFacade from "../game-facade/game-facade";
import { Subject } from 'rxjs';
import { GameUiState } from '../../interfaces/client-ui-state.interface';
import Player from './player';
import PlayerNameAndId from '../../interfaces/player-name-and-id';
import ChatMessage from '../../interfaces/chat-message.interface';


export default class Game{
  
  private _players: Player[]
  private fighters: Fighter[]
  private managers: Manager[]
  private i: GameImplementationCode = new GameImplementationCode()
  private fightScheduler: FightScheduler
  private gameConfiguration: GameConfiguration
  private gameChat: ChatMessage[]

  gameFinishedSubject: Subject<void> = new Subject()


	constructor(playerNameAndIds: PlayerNameAndId[]) {
    console.log('game started');

    this.gameConfiguration = gameConfiguration
    
    this._players = playerNameAndIds.map((playerNameAndId: PlayerNameAndId) => {
      const {name, id} = playerNameAndId
      const player: Player = new Player(id, name, this)
      return player
    })
    const {numberOfFighters, numberOfFightersPerFight, fighterNames} = this.gameConfiguration
    this.fighters = this.i.getFightersWithRandomNames(numberOfFighters, fighterNames)

    this.fightScheduler = new FightScheduler(this.fighters, numberOfFightersPerFight)
    



  }
  get players(){
    return this._players
  }

  
}