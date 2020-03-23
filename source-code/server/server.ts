import GameHost from './game-host';
import ClientAction, { ClientActionNames } from '../interfaces/client-action';
import ServerWebsocketService from './server-websocket-service';
import { Socket } from 'socket.io';
import { ClientPregameAction, ConnecToGameHostAction } from '../types/client-pre-game-actions';

console.log('process.pid :', process.pid);

const websocketService = new ServerWebsocketService()
const gameHost = new GameHost()

websocketService.clientConnectedSubject.subscribe(handleConnectingClient)

function handleConnectingClient(socket: Socket) {

  console.log('A client connected to the websocket server');

  socket.on('Action From Client', (actionFromClient: ClientPregameAction) => {  
    console.log('Server received action from client');
    if (actionFromClient.name == 'Connect To Game Host') {
      const connecToGameHostAction = actionFromClient as ConnecToGameHostAction
      gameHost.handleConnectingClient(connecToGameHostAction.data, socket)
    }
  })
}

