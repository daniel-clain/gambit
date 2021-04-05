import { Subject } from 'rxjs';
import {Socket} from 'socket.io';
import { FromClientToGame } from '../client/front-end-service/front-end-service-types';
import { ServerGameUIState } from '../interfaces/front-end-state-interface';
import { ClientNameAndID } from '../game-host/game-host.types';
import { Game } from './game';
import { Manager } from './manager';


export class Player{  
  onUIStateUpdate = new Subject<ServerGameUIState>()

  constructor(
    public name: string,
    public id: string,    
    public socket: Socket,
    public manager: Manager,
    private game: Game
  ){}

  
  receiveUpdateFromClient: FromClientToGame = {

    toggleReady: () => this.manager.state.readyForNextFight = !this.manager.state.readyForNextFight,

    toggleDropPlayer: obj => {
      this.game.has.connectionManager.handlePlayerVote(obj.votingPlayer, obj.disconnectedPlayer, obj.vote)
    },

    abilityConfirmed: this.game.has.abilityProcessor.processSelectedAbility,

    betOnFighter: bet => this.manager.has.nextFightBet = bet,

    borrowMoney: this.manager.functions.borrowMoney,

    payBackMoney: this.manager.functions.paybackMoney
  }

}