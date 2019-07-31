
import * as socketio from 'socket.io'
import { Server, Socket } from 'socket.io';
import { Subject } from 'rxjs';
import IWebsocketService from '../interfaces/websocket-service.interface';
import ClientAction from '../interfaces/client-action';
import ConnectingClientData from '../interfaces/connecting-client-data';


export default class ServerWebsocketService implements IWebsocketService{
  port = 33
  websocketServer: Server
  clientConnected: Subject<ConnectingClientData> = new Subject()

  constructor(){
    this.setUpWebsockets()
  }

  private setUpWebsockets(){
    this.websocketServer = socketio.listen(this.port)
    this.websocketServer.on("connection", (socket: Socket) => { 
      socket.on('Action From Client', (actionFromClient: ClientAction) => {
        if(actionFromClient.name == 'Connect'){
          const {args} = actionFromClient      
          const connectingClientData: ConnectingClientData = {
            socket, id: args.clientId, name: args.name
          }
          this.clientConnected.next(connectingClientData)
        }
      })
    });
  }
}