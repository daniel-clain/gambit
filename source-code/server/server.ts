import * as express from 'express';
import App from './app';
import ServerWebsocketService from './server-websocket.service';

console.clear()

const server = express()
server.use(express.static('compiled-code/client/main-game'))
const serverPort = 3302
server.listen(serverPort, () => console.log('server listening on port ' + serverPort))


new App(new ServerWebsocketService())

