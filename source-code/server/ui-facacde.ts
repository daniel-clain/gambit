export interface IUIFacade{

}

export default class UIFacade implements IUIFacade{
  
  protected uIStateUpdateSubject: Subject<C_ClientState> = new Subject()

  constructor(){}
 
  onUIStateUpdateReceived(clientUpdateFunction: any) {
    this.uIStateUpdateSubject.subscribe(clientUpdateFunction)
  }
  
}
