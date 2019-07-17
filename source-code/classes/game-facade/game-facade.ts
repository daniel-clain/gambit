
import { Subject } from "rxjs";
import { GameUIProps } from "../../client/components/game-ui";
import { PreGameUIState } from "../../client/main-game/pre-game";



export default interface IGameFacade{  
  preGameStateUpdates: Subject<PreGameUIState>
  gameStateUpdates: Subject<GameUIProps>
}
/* 
export default interface IGameFacade{  
  betOnFigter(name: string, amount: number)
  getFighterInfo(name: string)
  trainFighter(name: string)
  assaultFighter(name: string)
  protectFighter(name: string)
  assasinateFighter(name: string)
  spyOnFighter(name: string)
  dopeFighter(name: string)
}

abstract class GameFacade implements IGameFacade{
  trainFighter(name: any) {
    throw new Error("Method not implemented.");
  }

  betOnFigter(name: string, amount: number){}
  getFighterInfo(name: string){}
  assaultFighter(name: string){}
  protectFighter(name: string){}
  assasinateFighter(name: string){}
  spyOnFighter(name: string){}
  dopeFighter(name: string){}
}

export class RemoteGameFacade extends GameFacade{
  constructor(private websocketService: ClientWebsocketService){
    super()
  }
  
  trainFighter(fighterName: string){
    const playerAction: PlayerAction = {
      playerId: '123',
      name: 'Train fighter',
      arguments: [fighterName]
    }
    this.websocketService.sendPlayerAction(playerAction)
  }
  
}


 
 */