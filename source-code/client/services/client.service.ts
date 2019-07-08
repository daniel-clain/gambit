import {Subject} from 'rxjs';
import { Observable } from 'rxjs';
import Player from '../../interfaces/player';

export default class ClientService{
  player: Player = {
    name: null,
    clientId: null,
    gameId: null,
    connected: false
    
  }
  playerSubject: Subject<Player> = new Subject()
  playerObservable: Observable<Player> = new Observable(subscriber => {
    this.playerSubject.subscribe((player: Player) => subscriber.next(player))
  })

  setPlayerName(name){
    this.player.name = name
    this.playerSubject.next(this.player)
  }
}