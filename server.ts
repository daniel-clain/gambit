import express, { RequestHandler } from 'express'
import {GameHost} from './source-code/game-host/game-host';
import fs from 'fs';

import {Server} from 'socket.io';
import * as http from 'http'


const PORT = process.env.PORT || 9999;
const app = express();
const httpServer = http.createServer(app)



//let webSocketServer = new Server();
const environment = process.env.NODE_ENV

console.log(environment)

let webSocketServer
let mainGameRequestHandler: RequestHandler

if(environment == 'development'){
  console.log('dev server');
  webSocketServer = new Server(6969)
  mainGameRequestHandler = express.static('host-packages/main-game')
} else {
  console.log('prod server');
  webSocketServer = new Server()
  mainGameRequestHandler = express.static('host-packages/main-game-prod')
}

new GameHost(webSocketServer)

webSocketServer.listen(httpServer)


app.use(mainGameRequestHandler);

app.get('/favicon.ico', (req, res) => {
  res.sendFile(`${__dirname}/favicon.ico`)
})
httpServer.listen(PORT, () => console.log(`Listening on ${PORT}`));
