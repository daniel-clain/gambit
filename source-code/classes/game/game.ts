import Manager from "./manager/manager";
import { Subject } from 'rxjs';
import Player from './player';
import ChatMessage from '../../interfaces/chat-message.interface';
import { PlayerInfo } from '../../interfaces/player-info.interface';
import { RoundController } from './round-controller';


export default class Game{
  
  private players: Player[]
  private gameChat: ChatMessage[]
  roundController: RoundController

  gameFinishedSubject: Subject<void> = new Subject()

	constructor(playerInfo: PlayerInfo[]) {
    this.roundController = new RoundController() 
    this.players = playerInfo.map((playerInfo: PlayerInfo) => {
      const {socket, name, id} = playerInfo
      const playersManager: Manager = new Manager(this.roundController)
      return new Player(playersManager, socket, id, name, this.roundController)
    })  
    
    this.start()
    
  }

  start(){
    console.log('game started');
    this.roundController.startRound(1)
  }

  
}