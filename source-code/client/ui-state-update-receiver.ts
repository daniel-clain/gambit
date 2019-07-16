import { Subject } from "rxjs";
import { C_ClientState } from './client'
import * as io from 'socket.io-client'

export default class UiStateUpdateReceiver{
  private uIStateUpdateSubject: Subject<C_ClientState> = new Subject()

  constructor(){
    this.setUpWebsockets()
    setTimeout(() => (
      this.uIStateUpdateSubject.next({
        activeView: 'Manager Options',
        activeViewProps: {
          money: 5000,
          actionPoints: 3,
          fightersInTheNextFight: [
            {name: 'Bob'},
            {name: 'Kevin'},
            {name: 'Alan'},
            {name: 'Steve'},
          ],
          yourFighters: [                
            {name: 'Joe'},
            {name: 'Dave'},
            {name: 'Mike'},
            {name: 'Trevor'},
          ],
          options: [                   
            {name: 'Assasinate fighter'},
            {name: 'Get fighter sponsored'},
            {name: 'Give performance enhancing drugs to fighter'},
            {name: 'Research fighter'},
            {name: 'Send body guards to protect fighter'},
            {name: 'Send private investigator to spy on manager'},
            {name: 'Send thugs to assault fighter'},
            {name: 'Train fighter'},
          ]
        }
      })
    ), 10)
  }

  onUIStateUpdateReceived(funcToRun){
    this.uIStateUpdateSubject.subscribe(funcToRun)
  }

  private setUpWebsockets(){
    const websocketServer = io('localhost:77', {transports: ['websocket', 'flashsocket']}); 
    websocketServer.on('UI State Update', uIStateUpdate => this.uIStateUpdateSubject.next(uIStateUpdate))
  }
}