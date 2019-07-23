import * as express from 'express';
import ServerWebsocketService from './server-websocket.service';
import GameHost from './game-host';

console.clear()

const server = express()
server.use(express.static('compiled-code/client/main-game'))
const serverPort = 3302
server.listen(serverPort, () => console.log('server listening on port ' + serverPort))


new GameHost(new ServerWebsocketService())

