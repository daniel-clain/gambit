import { Subject } from 'rxjs';
import {Socket} from 'socket.io';
import { FromClientToGame } from '../client/front-end-service/front-end-service';
import { ServerGameUIState } from '../interfaces/server-game-ui-state.interface';
import { AbilityProcessor } from './abilities-reformed/ability-processor';
import ConnectionManager from './connection-manager';
import { Manager } from './manager';


export class Player{  
  onUIStateUpdate = new Subject<ServerGameUIState>()

  constructor(
    public name: string,
    public id: string,    
    public socket: Socket,
    public manager: Manager,
    private abilityProcessor: AbilityProcessor,
    private connectionManager: ConnectionManager
  ){}

  
  receiveUpdateFromClient: FromClientToGame = {

    toggleReady: () => this.manager.state.readyForNextFight = !this.manager.state.readyForNextFight,

    toggleDropPlayer: ({votingPlayer, disconnectedPlayer, vote}) => this.connectionManager.playerVoteToggle(votingPlayer, disconnectedPlayer, vote),

    abilityConfirmed: this.abilityProcessor.processSelectedAbility,

    betOnFighter: bet => this.manager.has.nextFightBet = bet,

    borrowMoney: this.manager.functions.borrowMoney,

    payBackMoney: this.manager.functions.paybackMoney
  }

}