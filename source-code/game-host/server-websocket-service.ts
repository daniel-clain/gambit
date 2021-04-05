
import { Server, Socket } from 'socket.io';
import { Subject } from 'rxjs';

export default class ServerWebsocketService{
  
  clientConnectedSubject: Subject<Socket>

  constructor() {
    this.clientConnectedSubject = new Subject()
    const port = +process.env.WEBSOCKET_PORT
    const webSocketServer: Server = new Server()
    webSocketServer.listen(port)
    console.log(`game server listening for connections on port ${port}`);

    webSocketServer.on("connection", (socket: Socket) => {
      this.clientConnectedSubject.next(socket)
    })
  }
}






