
import { Subject } from "rxjs";

export default class UIFacade implements IGameFacade{
  
  protected eventsFromClient: Subject<C_ClientState> = new Subject()

  constructor(){}

  inputHandler: IInputHandler = {
    gameLobby: {
      joinGame: () => {}
    },
    managerOptions: {
      betOnFigter: (name: string, amount: number) => {},
      getFighterInfo: (name: string) => {},
      trainFighter: (name: string) => {},
      assaultFighter: (name: string) => {},
      protectFighter: (name: string) => {},
      assasinateFighter: (name: string) => {},
      spyOnFighter: (name: string) => {},
      dopeFighter: (name: string) => {},
    }
  }
  sendStateUpdate(state: C_ClientState){

  }
  
}
