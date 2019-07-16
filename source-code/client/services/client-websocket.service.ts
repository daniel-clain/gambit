import { Subject, Observable, Subscription } from "rxjs";
import { ClientToServer } from '../../interfaces/client-to-server.interface';
import * as io from 'socket.io-client'
import { ServerToClient } from '../../interfaces/server-to-client.interface';
import { ServerToClientName } from '../../types/serverToClientName.type';
import Player from '../../interfaces/player';
import ConnectionStates from '../../types/connection-states';
import IMessageService from "../../interfaces/message-service.interface";
import GameUpdates from "../../interfaces/game/fighter/game-updates";
import GameView, { GameViewProps } from "../app-ui/views/game-view/game-view";
import { ManagerOptionNames } from "../../types/game/managerOptionNames";

export default class ClientWebsocketService{
  private websocketServer
  appStateUpdates: Subject<AppUIView> = new Subject()
  private serverToClientSubject: Subject<ServerToClient> = new Subject()
  
  connectedPlayersSubject: Subject<Player[]> = new Subject()
  connectedSubject: Subject<ConnectionStates> = new Subject()
  gameUpdatesSubject: Subject<GameUpdates> = new Subject()

  constructor(){
    setTimeout(() => {
      const stateUpdate: AppUIViewState = {        
        name: 'Game',
        props: <GameViewProps>{
          activeScene: {
            name: 'Manager Options',
            props: <ManagerOptionsSceneProps>{
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
          }
        }
      }
      this.appStateUpdates.next(stateUpdate)
    })
  }

  
  onReceiveGameUpdates(callback: (value: GameUpdates) => void): void{
    this.gameUpdatesSubject.subscribe(callback)
  
  }

  private handleServerMessages(){
    this.websocketServer.on('server to client', (serverToClient: ServerToClient) => {
      console.log(`serverToClient: ${serverToClient.name}`)
      this.serverToClientSubject.next(serverToClient)
      switch(serverToClient.name){
        case 'connected players update' : {
          this.connectedPlayersSubject.next(serverToClient.data)
        }
      }
    })
  }

  sendMessageToServer(clientToServer: ClientToServer): void{
    this.websocketServer.emit('client to server', clientToServer)
  }

  sendPromiseToServer(clientToServer: ClientToServer, serverEventName?: ServerToClientName): Promise<ServerToClient>{
    const transactionId: number = new Date().getTime()
    clientToServer.transactionId = transactionId
    this.sendMessageToServer(clientToServer)
    switch(clientToServer.name){
      case 'connect' : {
        serverEventName = 'player connected'
      }
    }    
    return this.awaitServerEvent(serverEventName, transactionId)
    
  }

  private awaitServerEvent(serverEventName: ServerToClientName, transactionId: number): Promise<ServerToClient>{
    return new Promise((resolve) => {
      const subscription = this.serverToClientSubject.subscribe(
        (serverToClient: ServerToClient) => {
          if(serverToClient.name == serverEventName && serverToClient.transactionId == transactionId){
            subscription.unsubscribe()
            resolve(serverToClient)
          }
        }
      )
    })
  }


  tryToConnect(player: Player){
    console.log('trying to connect');
    const connectionTimeout = setTimeout(() => this.connectedSubject.next('Not Connected'), 3000)
    this.websocketServer = io('localhost:69', {transports: ['websocket', 'flashsocket']}); 
    this.connectedSubject.next('Connecting')
    this.websocketServer.on('connect', () => {
      this.sendPromiseToServer({
        name: 'connect',
        data: player,
        clientId: '123'
      }, 'player connected')
      .then(() => {
        clearTimeout(connectionTimeout)
        this.connectedSubject.next('Connected')
      })
    })
    this.websocketServer.on('error', (error) => console.log('error :', error))
    this.websocketServer.on('disconnect', (error) => {
      console.log('disconnect :', error)
    })

    this.websocketServer.on('connection_refused', (error) => console.log('connection_refused :', error))
    this.websocketServer.on('connection_error', (error) => console.log('connection_error :', error))
    this.websocketServer.on('connect_timeout', (error) => console.log('connect_timeout :', error))
    this.websocketServer.on('reconnect', (error) => console.log('reconnect :', error))
    this.websocketServer.on('reconnect_attempt', (error) => console.log('reconnect_attempt :', error))
    this.websocketServer.on('reconnecting', (error) => console.log('reconnecting :', error))
    this.websocketServer.on('reconnect_error', (error) => console.log('reconnect_error :', error))
    this.handleServerMessages()
  }

}