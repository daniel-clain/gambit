import IGameFacade from "../interfaces/game-facade.interface";
import { Subject } from "rxjs";
import { ClientUIState } from "./client";
import ClientWebsocketService from "./client-websocket-service";
import ActionFromPlayer from "../interfaces/player-action";
import PlayerAction from "../interfaces/player-action";

export default class GameFacade implements IGameFacade{
  constructor(private websocketService: ClientWebsocketService){}
  
  trainFighter(fighterName: string){
    const playerAction: PlayerAction = {
      playerId: '123',
      name: 'Train fighter',
      arguments: [fighterName]
    }
    this.websocketService.sendPlayerAction(playerAction)
  }
  betOnFigter(name: string, amount: number){}
  getFighterInfo(name: string){}
  assaultFighter(name: string){}
  protectFighter(name: string){}
  assasinateFighter(name: string){}
  spyOnFighter(name: string){}
  dopeFighter(name: string){}
  
}
