
import * as socketio from 'socket.io'
import { Server, Socket } from 'socket.io';
import { Subject } from 'rxjs';

export default class ServerWebsocketService{
  
  clientConnectedSubject: Subject<Socket>

  constructor() {
    this.clientConnectedSubject = new Subject()
    const port = process.env.WEBSOCKET_PORT
    const webSocketServer: Server = socketio.listen(port)
    console.log(`game server listening for connections on port ${port}`);

    webSocketServer.on("connection", (socket: Socket) => {
      this.clientConnectedSubject.next(socket)
    })
  }
}






