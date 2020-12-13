import GameHost from './game-host';
import ServerWebsocketService from './server-websocket-service';
import { Socket } from 'socket.io';
import { ClientPregameAction } from '../types/client-pre-game-actions';

console.log('process.pid :', process.pid);

const websocketService = new ServerWebsocketService()
const gameHost = new GameHost()

websocketService.clientConnectedSubject.subscribe(handleConnectingClient)

function handleConnectingClient(socket: Socket) {

  console.log('A client connected to the websocket server');

  socket.on('To Server From Client', (actionFromClient: ClientPregameAction) => {  
    console.log('To Server From Client: ', actionFromClient.name);
    if (actionFromClient.name == 'Connect To Game Host') {
      console.warn('Connect To Game Host')
      gameHost.handleConnectingClient(actionFromClient.data, socket)
    }
  })
}

